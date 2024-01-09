// server
import { getChat, getUser, getCharacter, getChatMessages } from "drizzle/model";
import { LoaderFunctionArgs, json } from "@remix-run/node";
import { requireAuth } from "@/sessions.server";
import { Bucket } from "sst/node/bucket";
import { formatS3ImageUrl } from "@/utils/s3";

// hooks
import { useEffect } from "react";
import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { useChatStore } from "@/hooks/useChatStore";

// components
import { Header } from "@/routes/app.character.$characterId/header";
import { Button } from "@/components/shadcn/button";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const userId = await requireAuth(request);
  const [user, character] = await Promise.all([
    getUser(userId),
    getCharacter(params.characterId),
    getChat(params.chatId),
  ]);

  if (!user || !character) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  return json({
    user: user,
    character: character,
    chatId: params.chatId,
    bucket: Bucket.content.bucketName,
  });
}

export default function Character() {
  const data = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const setCharacter = useChatStore((state) => state.setCharacter);

  useEffect(() => {
    setCharacter(data.character);
  }, [data.character]);

  const character = useChatStore((state) => state.character);
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full flex-col items-center gap-8 text-white">
      <Header />
      <div className="flex flex-col gap-6 md:flex-row md:px-6">
        <div className="flex w-full items-center justify-center rounded-xl">
          <img
            className=" rounded-xl border border-[var(--primary-light)]"
            src={formatS3ImageUrl(data.character!.image, data.bucket, "md")}
          />
        </div>

        <div className="flex w-full flex-col gap-12">
          <div className="flex flex-col gap-6 px-[50px] text-center">
            <h1 className="font-[Geist-Bold] text-2xl">{character?.name}</h1>
            <h2 className="font-[Geist-Light]">{character?.title}</h2>
          </div>
          <div className="flex w-full flex-row justify-between">
            <div className="rounded-xl border border-[var(--primary-light)] p-2">
              <h3>🙋🏻‍♀️Woman</h3>
            </div>
            <div className="rounded-xl border border-[var(--primary-light)] p-2">
              <h3>🤸🏻‍♀️Submissive</h3>
            </div>
            <div className="rounded-xl border border-[var(--primary-light)] p-2">
              <h3>🥳Happy</h3>
            </div>
          </div>
          <Button
            className="border border-[var(--primary-light)]"
            onClick={() => {
              const formData = new FormData();
              formData.append("characterId", data.character.id);
              formData.append("name", data.character.name);
              formData.append("greeting", data.character.greeting);
              submit(formData, { action: "/api/chat", method: "post" });
            }}
          >
            Start Chatting
          </Button>
        </div>
      </div>
    </div>
  );
}
