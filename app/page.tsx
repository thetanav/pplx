"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
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
import { DynamicToolUIPart, tool, type UIMessage } from "ai";
import { toast } from "sonner";
import Image from "next/image";
import { ArrowDownRightIcon, WrenchIcon } from "lucide-react";

const ChatBotDemo = () => {
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const LS_MODEL_KEY = "settings:model";
  const LS_MCP_KEY = "settings:mcpServers";
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
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => {
              const metadata = message.metadata as
                | undefined
                | { stats?: { inputTokens?: number; outputTokens?: number } };
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

                            // Show tool during execution and when output is available
                            return (
                              <Tool
                                defaultOpen={dyn.state === "output-available"}
                                key={`${message.id}-${i}-${toolType}`}>
                                <ToolHeader
                                  name={toolType}
                                  type={`tool-${toolType}`}
                                  state={dyn.state}
                                />
                                <ToolContent>
                                  <ToolInput input={dyn.input} />
                                  <ToolOutput
                                    errorText=""
                                    output={dyn.output}
                                  />
                                </ToolContent>
                              </Tool>
                            );
                          default:
                            return null;
                        }
                      })}
                      {metadata?.stats && (
                        <div className="gap-2 flex opacity-70 items-center">
                          <ArrowDownRightIcon className="w-4 h-4 -rotate-90" />
                          {metadata.stats?.outputTokens ?? 0} tokens
                          <ArrowDownRightIcon className="w-4 h-4 rotate-90" />
                          {metadata.stats?.inputTokens ?? 0} tokens
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

        <PromptInput onSubmit={handleSubmit} className="" globalDrop multiple>
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
              <PromptInputActionMenu>
                <PromptInputActionMenuTrigger />
                <PromptInputActionMenuContent>
                  <PromptInputActionAddAttachments />
                </PromptInputActionMenuContent>
              </PromptInputActionMenu>
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
                      {model.name}
                      {model.tools && (
                        <WrenchIcon className="w-6 h-6 opacity-55" />
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
