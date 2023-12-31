# Run optimized inference server using [Text Generation Inference (TGI)](https://github.com/huggingface/text-generation-inference)
# with performance advantages over standard text generation pipelines including:
# - continuous batching, so multiple generations can take place at the same time on a single container
# - PagedAttention, an optimization that increases throughput.

# ## Setup
#
# First we import the components we need from `modal`.
import subprocess
from pathlib import Path

from modal import Image, Stub, asgi_app, gpu, method

# Next, we set which model to serve, taking care to specify the GPU configuration required
# to fit the model into VRAM, and the quantization method (`bitsandbytes` or `gptq`) if desired.
# Note that quantization does degrade token generation performance significantly.
#
# Any model supported by TGI can be chosen here.
GPU_CONFIG = gpu.A10G(count=2)
MODEL_ID = "Austism/chronos-hermes-13b-v2"
# Add `["--quantize", "gptq"]` for TheBloke GPTQ models.
LAUNCH_FLAGS = [
    "--model-id",
    MODEL_ID,
    "--port",
    "8000",
]

# ## Define a container image
#
# We want to create a Modal image which has the Huggingface model cache pre-populated.
# The benefit of this is that the container no longer has to re-download the model from Huggingface -
# instead, it will take advantage of Modal's internal filesystem for faster cold starts.
#
# ### Download the weights
# We can use the included utilities to download the model weights (and convert to safetensors, if necessary)
# as part of the image build.
def download_model():
    subprocess.run(
        [
            "text-generation-server", "download-weights", MODEL_ID
        ]
    )


# ### Image definition
# We’ll start from a Dockerhub image recommended by TGI, and override the default `ENTRYPOINT` for
# Modal to run its own which enables seamless serverless deployments.
#
# Next we run the download step to pre-populate the image with our model weights.
#
# Finally, we install the `text-generation` client to interface with TGI's Rust webserver over `localhost`.
image = (
    Image.from_registry("ghcr.io/huggingface/text-generation-inference:1.3.1")
    .dockerfile_commands("ENTRYPOINT []")
    .run_function(download_model, timeout=60 * 20)
    .pip_install("text-generation")
)

stub = Stub("tgi-chronos-hermes-13b-v2", image=image)


# ## The model class
#
# The inference function is best represented with Modal's [class syntax](/docs/guide/lifecycle-functions).
# The class syntax is a special representation for a Modal function which splits logic into two parts:
# 1. the `__enter__` method, which runs once per container when it starts up, and
# 2. the `@method()` function, which runs per inference request.
#
# This means the model is loaded into the GPUs, and the backend for TGI is launched just once when each
# container starts, and this state is cached for each subsequent invocation of the function.
# Note that on start-up, we must wait for the Rust webserver to accept connections before considering the
# container ready.
#
# Here, we also
# - specify how many A100s we need per container
# - specify that each container is allowed to handle up to 10 inputs (i.e. requests) simultaneously
# - keep idle containers for 1 minute before spinning down
# - lift the timeout of each request.
@stub.cls(
    gpu=GPU_CONFIG,
    allow_concurrent_inputs=10,
    container_idle_timeout=60,
    timeout=60 * 60,
)
class Model:
    def __enter__(self):
        import socket
        import time

        from text_generation import AsyncClient

        self.launcher = subprocess.Popen(
            ["text-generation-launcher"] + LAUNCH_FLAGS
        )
        self.client = AsyncClient("http://127.0.0.1:8000", timeout=60)

        # Poll until webserver at 127.0.0.1:8000 accepts connections before running inputs.
        webserver_ready = False
        while not webserver_ready:
            try:
                socket.create_connection(("127.0.0.1", 8000), timeout=1).close()
                webserver_ready = True
                print("Webserver ready!")
            except (socket.timeout, ConnectionRefusedError):
                # If launcher process exited, a connection can never be made.
                if retcode := self.launcher.poll():
                    raise RuntimeError(f"launcher exited with code {retcode}")
                time.sleep(1.0)

    def __exit__(self, _exc_type, _exc_value, _traceback):
        self.launcher.terminate()

    @method()
    async def generate(self, prompt: str, max_new_tokens: int):
        result = await self.client.generate(prompt, max_new_tokens=max_new_tokens)

        return result.generated_text

    @method()
    async def generate_stream(self, prompt: str, max_new_tokens: int):
        async for response in self.client.generate_stream(
            prompt, max_new_tokens=max_new_tokens
        ):
            if not response.token.special:
                yield response.token.text


# ## Run the model
# We define a [`local_entrypoint`](/docs/guide/apps#entrypoints-for-ephemeral-apps) to invoke
# our remote function. You can run this script locally with `modal run backend.py`.
@stub.local_entrypoint()
def main():
    print(
        Model().generate.remote(
            "Implement a Python function to compute the Fibonacci numbers."
        )
    )


@stub.function(
    keep_warm=1,
    allow_concurrent_inputs=20,
    timeout=60 * 10,
)
@asgi_app(label="tgi-chronos-hermes-13b-v2")
def backend():
    import json

    import fastapi
    import fastapi.staticfiles
    from fastapi.responses import StreamingResponse
    from fastapi.middleware.cors import CORSMiddleware

    app = fastapi.FastAPI()

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],  # Specify the exact origin
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/stats")
    async def stats():
        stats = await Model().generate_stream.get_current_stats.aio()
        return {
            "backlog": stats.backlog,
            "num_total_runners": stats.num_total_runners,
            "model": MODEL_ID + " (TGI)",
        }

    @app.get("/completion")
    async def completion(prompt: str, max_new_tokens: int = 30):
        from urllib.parse import unquote

        async def generate():
            async for text in Model().generate_stream.remote_gen.aio(
                prompt=unquote(prompt), max_new_tokens=max_new_tokens
            ):
                yield f"data: {json.dumps(dict(text=text), ensure_ascii=False)}\n\n"

        return StreamingResponse(generate(), media_type="text/event-stream")

    return app


# ## Invoke the model from other apps
# Once the model is deployed, we can invoke inference from other apps, sharing the same pool
# of GPU containers with all other apps we might need.
#
# ```
# $ python
# >>> import modal
# >>> f = modal.Function.lookup("example-tgi-Mixtral-8x7B-Instruct-v0.1", "Model.generate")
# >>> f.remote("What is the story about the fox and grapes?")
# 'The story about the fox and grapes ...
# ```