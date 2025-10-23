"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  type PromptInputMessage,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
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
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import { models } from "@/lib/models";
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";
import { DynamicToolUIPart } from "ai";
import { toast } from "sonner";
import {
  ArrowDownRightIcon,
  BoltIcon,
  BoxIcon,
  BrainIcon,
  GemIcon,
  ImageIcon,
  MonitorDownIcon,
  SmileIcon,
  WrenchIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import { localTools } from "@/lib/tools";

const ChatBotDemo = () => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const LS_MODEL_KEY = "settings:model";
  const LS_MCP_KEY = "settings:mcpServers";

  // Tool display names mapping
  const toolDisplayNames: Record<string, string> = {
    time: "Knowing Current time",
    calculate: "Performing calculations",
    search: "Searching the web",
    weather: "Getting weather",
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
      {!messages || messages.length === 0 ? (
        <div className="absolute flex flex-col top-0 left-0 right-0 bottom-0 space-y-4 -z-50 items-center justify-center text-center mb-24">
          <SmileIcon className="w-16 h-16 text-muted-foreground" />
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
                    <MessageContent className="group">
                      {message.parts.map((part, i) => {
                        switch (true) {
                          case part.type == "text":
                            return (
                              <Response key={`${message.id}-${i}`}>
                                {part.text}
                              </Response>
                            );
                          case part.type == "reasoning":
                            return (
                              <Reasoning
                                key={`${message.id}-${i}`}
                                className="w-full"
                                isStreaming={
                                  status === "streaming" &&
                                  message.id === messages.at(-1)?.id
                                }>
                                <ReasoningTrigger />
                                <ReasoningContent>{part.text}</ReasoningContent>
                              </Reasoning>
                            );
                          case part.type.startsWith("tool-") ||
                            part.type == "dynamic-tool":
                            const dyn = part as DynamicToolUIPart;
                            const toolType = part.type.replace("tool-", "");

                            // Only show tool when running (output not available)
                            if (dyn.state === "output-available") {
                              return null;
                            }

                            return (
                              <Tool key={`${message.id}-${i}-${toolType}`}>
                                <ToolHeader
                                  name={toolDisplayNames[toolType] || toolType}
                                  type={`tool-${toolType}`}
                                  state={dyn.state}
                                />
                              </Tool>
                            );
                          case part.type == "file":
                            return (
                              <Image
                                alt={part.filename ?? "Simp AI image gen"}
                                src={part.url}
                                width={100}
                                height={100}
                                className="rounded-md"
                              />
                            );
                          default:
                            return null;
                        }
                      })}
                      {metadata?.stats && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="gap-2 flex opacity-70 items-center">
                            <ArrowDownRightIcon className="w-4 h-4 -rotate-90" />
                            {metadata.stats?.outputTokens ?? 0} tokens
                            <ArrowDownRightIcon className="w-4 h-4 rotate-90" />
                            {metadata.stats?.inputTokens ?? 0} tokens
                            <BoxIcon className="w-4 h-4" />
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

        <PromptInput onSubmit={handleSubmit} globalDrop multiple>
          <PromptInputBody>
            <PromptInputAttachments>
              {(attachment) => <PromptInputAttachment data={attachment} />}
            </PromptInputAttachments>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
          </PromptInputBody>
          <PromptInputToolbar>
            <PromptInputTools>
              <PromptInputActionMenuTrigger />
              <PromptInputModelSelect
                onValueChange={(value) => {
                  setModel(value);
                }}
                value={model}>
                <PromptInputModelSelectTrigger>
                  <PromptInputModelSelectValue />
                </PromptInputModelSelectTrigger>
                <PromptInputModelSelectContent>
                  {models.map((model) => (
                    <PromptInputModelSelectItem
                      key={model.value}
                      value={model.value}>
                      <Image
                        alt={model.name}
                        src={"/ai-logos" + model.logo}
                        width={20}
                        height={20}
                      />
                      <p className="font-bold">{model.name}</p>
                      {model.reasoning && (
                        <span className="bg-green-100 text-green-800 p-1 rounded-md flex items-center">
                          <BrainIcon className="w-4 h-4 text-current" />
                        </span>
                      )}
                      {model.fast && (
                        <span className="bg-indigo-100 text-indigo-800 p-1 rounded-md flex items-center">
                          <ZapIcon className="w-4 h-4 text-current" />
                        </span>
                      )}
                      {model.image && (
                        <span className="bg-blue-100 text-blue-800 p-1 rounded-md flex items-center">
                          <ImageIcon className="w-4 h-4 text-current" />
                        </span>
                      )}
                      {model.pro && (
                        <span className="bg-orange-100 text-orange-800 p-1 rounded-md flex items-center">
                          <GemIcon className="w-4 h-4 text-current" />
                        </span>
                      )}
                      {model.local && (
                        <span className="bg-yellow-100 text-yellow-800 p-1 rounded-md flex items-center">
                          <MonitorDownIcon className="w-4 h-4 text-current" />
                        </span>
                      )}
                    </PromptInputModelSelectItem>
                  ))}
                </PromptInputModelSelectContent>
              </PromptInputModelSelect>
            </PromptInputTools>
            <PromptInputSubmit
              disabled={!input && !status}
              status={status}
              stop={stop}
            />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  );
};

export default ChatBotDemo;
