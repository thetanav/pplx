"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { useEffect, useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";

import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import {
  Reasoning,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import { models } from "@/lib/models";
import { Tool, ToolHeader } from "@/components/ai-elements/tool";
import { DynamicToolUIPart } from "ai";
import { toast } from "sonner";
import {
  ArrowDownRightIcon,
  BoxIcon,
  LoaderCircleIcon,
  SmileIcon,
} from "lucide-react";
import Navbar from "@/components/navbar";
import AIInput from "@/components/ai-input";
import { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { useSession } from "@/lib/auth-client";

const ChatBotDemo = () => {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const LS_MODEL_KEY = "settings:model";
  const LS_MCP_KEY = "settings:mcpServers";

  // Tool display names mapping
  const toolDisplayNames: Record<string, string> = {
    time: "Knowing Current time",
    calculate: "Performing calculations",
    search: "Searching the web",
    scrape: "Viewing the page",
  };
  const { messages, sendMessage, status, stop } = useChat({
    onError: (error) => {
      const message =
        (error as { message?: string })?.message ||
        "Something went wrong while contacting the server.";
      toast.error("Request failed", {
        description: message,
      });
    },
  });

  useEffect(() => {
    try {
      const storedModel = localStorage.getItem(LS_MODEL_KEY);
      if (storedModel) setModel(storedModel);
    } catch {}
  }, []);

  const activeMcpUrl = useMemo(() => {
    try {
      const storedServers = localStorage.getItem(LS_MCP_KEY);
      if (!storedServers) return undefined;
      const list = JSON.parse(storedServers) as {
        url: string;
        active?: boolean;
      }[];
      const active = list.find((s) => s.active);
      return active?.url;
    } catch {
      return undefined;
    }
  }, []);

  const handleSubmit = (message: PromptInputMessage) => {
    const hasText = Boolean(message.text);
    const hasAttachments = Boolean(message.files?.length);

    if (!(hasText || hasAttachments)) {
      return;
    }

    sendMessage(
      {
        text: message.text || "Sent with attachments",
        files: message.files,
      },
      {
        body: {
          model: model,
          mcpGatewayUrl: activeMcpUrl,
        },
      }
    );
    setInput("");
  };

  return (
    <div className="max-w-3xl mx-auto p-3 relative size-full h-screen">
      <Navbar />
      {!messages || messages.length === 0 ? (
        <div className="absolute flex flex-col top-0 left-0 right-0 bottom-0 space-y-4 -z-50 items-center justify-center text-center mb-24">
          <SmileIcon className="w-16 h-16 text-muted-foreground animate-bounce" />
          <h2 className="text-2xl font-semibold">Welcome to Simp Chat</h2>
          <p className="text-muted-foreground w-96">
            Start a conversation by typing a message below. Choose your model
            and attach files as needed.
          </p>
        </div>
      ) : null}
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => {
              const metadata = message.metadata as
                | undefined
                | {
                    stats?: { inputTokens?: number; outputTokens?: number };
                    model: string;
                  };
              return (
                <div key={message.id}>
                  {message.role === "assistant" &&
                    message.parts.filter((part) => part.type === "source-url")
                      .length > 0 && (
                      <Sources>
                        <SourcesTrigger
                          count={
                            message.parts.filter(
                              (part) => part.type === "source-url"
                            ).length
                          }
                        />
                        {message.parts
                          .filter((part) => part.type === "source-url")
                          .map((part, i) => (
                            <SourcesContent key={`${message.id}-${i}`}>
                              <Source
                                key={`${message.id}-${i}`}
                                href={part.url}
                                title={part.url}
                              />
                            </SourcesContent>
                          ))}
                      </Sources>
                    )}
                  <Message from={message.role}>
                    <MessageContent>
                      <div className="overflow-x-auto gap-4">
                        {message.parts.map((part, i) => {
                          switch (true) {
                            case part.type == "text":
                              return (
                                <Response key={`${message.id}-${i}`}>
                                  {part.text}
                                </Response>
                              );
                            case part.type == "reasoning":
                              const isStreamingReasoning =
                                status === "streaming";
                              if (!isStreamingReasoning) return null;
                              return (
                                <Reasoning
                                  key={`${message.id}-${i}`}
                                  className="w-full"
                                  isStreaming={isStreamingReasoning}>
                                  <ReasoningTrigger />
                                </Reasoning>
                              );
                            case part.type.startsWith("tool-") ||
                              part.type == "dynamic-tool":
                              const dyn = part as DynamicToolUIPart;
                              const toolType = part.type.replace("tool-", "");

                              // Only show tool when running (output not available)
                              if (
                                dyn.state === "output-available" &&
                                toolType !== "search"
                              ) {
                                return null;
                              }

                              return (
                                <Tool key={`${message.id}-${i}-${toolType}`}>
                                  <div className="flex gap-3">
                                    <ToolHeader
                                      name={
                                        toolDisplayNames[toolType] || toolType
                                      }
                                      type={`tool-${toolType}`}
                                      state={dyn.state}
                                    />
                                    {dyn.state === "output-available" &&
                                      Array.isArray(dyn.output) && (
                                        <div className="flex ml-2">
                                          {dyn.output.map((item) => (
                                            <img
                                              src={`https://www.google.com/s2/favicons?domain=${
                                                new URL(item.link).hostname
                                              }`}
                                              className="rounded-full border w-6 h-6 -ml-2 bg-white"
                                            />
                                          ))}
                                        </div>
                                      )}
                                  </div>
                                </Tool>
                              );
                            case part.type == "file" &&
                              part.mediaType.startsWith("image/"):
                              return (
                                <img
                                  alt={part.filename ?? "Simp AI image gen"}
                                  src={part.url}
                                  key={`${part.filename}`}
                                  width={100}
                                  height={100}
                                  className="rounded-md"
                                />
                              );
                            default:
                              return null;
                          }
                        })}
                      </div>
                      {metadata?.stats && (
                        <div>
                          <div className="gap-2 flex opacity-60 items-center">
                            <ArrowDownRightIcon className="w-4 h-4 -rotate-90" />
                            {metadata.stats?.outputTokens ?? 0} tokens
                            <ArrowDownRightIcon className="w-4 h-4 rotate-90" />
                            {metadata.stats?.inputTokens ?? 0} tokens
                            {(() => {
                              switch (status) {
                                case "streaming":
                                  return (
                                    <LoaderCircleIcon className="w-4 h-4 animate-spin" />
                                  );
                                default:
                                  return <BoxIcon className="w-4 h-4" />;
                              }
                            })()}
                            {metadata.model}
                          </div>
                        </div>
                      )}
                    </MessageContent>
                  </Message>
                </div>
              );
            })}

            {status === "submitted" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        {session && (
          <AIInput
            handleSubmit={handleSubmit}
            setInput={setInput}
            input={input}
            setModel={setModel}
            model={model}
            status={status}
            stop={stop}
          />
        )}
      </div>
    </div>
  );
};

export default ChatBotDemo;
