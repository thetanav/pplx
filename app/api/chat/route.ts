import {
  streamText,
  UIMessage,
  convertToModelMessages,
  LanguageModel,
  UIDataTypes,
  ToolSet,
  tool,
  InferUITools,
} from "ai";
import { getModel } from "@/lib/models";
import { z } from "zod";

export const maxDuration = 30;

const tools = {
  getTime: tool({
    description: "Returns the current time",
    inputSchema: z.object({}),
    execute: async () => {
      return { time: new Date().toISOString() };
    },
  }),
} satisfies ToolSet;

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  const { messages, model }: { messages: ChatMessage[]; model: string } =
    await req.json();

  const result = streamText({
    model: getModel(model) as LanguageModel,
    messages: convertToModelMessages(messages),
    system:
      "You are a helpful assistant that can answer questions and help with tasks",
    // tools,
  });

  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  });
}
