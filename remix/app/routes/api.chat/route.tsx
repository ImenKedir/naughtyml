import { requireAuth } from "@/sessions.server";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createChat, createMessage } from "drizzle/model";
import type { ActionFunctionArgs } from "@remix-run/node"; // or cloudflare/deno

// API route for creating new chat and redicting to it
export const action = async ({ request, params }: ActionFunctionArgs) => {
  switch (request.method) {
    case "POST": {
      /* handle "POST" */
      const userId = await requireAuth(request);

      const formData = await request.formData();

      const characterId = String(formData.get("characterId"));
      const name = String(formData.get("name"));
      const greeting = String(formData.get("greeting"));

      const chatId = crypto.randomUUID();
      const messageId = crypto.randomUUID();

      await Promise.all([
        createChat({
          id: chatId,
          title: name,
          user: userId,
          character: characterId,
          created: new Date().toISOString(),
        }),
        createMessage({
          id: messageId,
          author: "ai",
          content: greeting,
          chat: chatId,
          created: new Date().toISOString(),
        }),
      ]);
      return redirect(`/app/chat/${characterId}/${chatId}`);
    }
    case "PUT": {
      /* handle "PUT" */
      throw new Response(null, {
        status: 400,
        statusText: "Bad Request",
      });
    }
    case "PATCH": {
      /* handle "PATCH" */
      throw new Response(null, {
        status: 400,
        statusText: "Bad Request",
      });
    }
    case "DELETE": {
      /* handle "DELETE" */
      throw new Response(null, {
        status: 400,
        statusText: "Bad Request",
      });
    }
  }
};
