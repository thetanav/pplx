"use client";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationUserLocator,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageActions,
  AssistantMessageDelete,
} from "@/components/ai-elements/message";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { Response } from "@/components/ai-elements/response";
import Image from "next/image";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import { models } from "@/lib/models";
import { Tool, ToolHeader } from "@/components/ai-elements/tool";
import { DynamicToolUIPart } from "ai";
import { toast } from "sonner";
import {
  BoxIcon,
  GlobeIcon,
  LoaderCircleIcon,
  SmileIcon,
} from "lucide-react";
import Navbar from "@/components/navbar";
import AIInput from "@/components/ai-input";
import { PromptInputMessage } from "@/components/ai-elements/prompt-input";
import { useSession } from "@/lib/auth-client";

const convertMessagesToMarkdown = (messages: UIMessage[]) => {
  let md = "# Chat Export\n\n";
  messages.forEach((message) => {
    const role = message.role === "user" ? "User" : "Assistant";
    md += `## ${role}\n\n`;

    message.parts.forEach((part) => {
      if (part.type === "text") {
        md += `${part.text}\n\n`;
      } else if (part.type === "reasoning") {
        md += `**Reasoning:**\n\n${part.text}\n\n`;
      } else if (
        part.type.startsWith("tool-") ||
        part.type === "dynamic-tool"
      ) {
        const toolType = part.type.replace("tool-", "");
        md += `**Tool: ${toolType}**\n\n`;
        const dyn = part as {
          state?: string;
          output?: { title?: string; link?: string }[];
        };
        if (dyn.state === "output-available" && Array.isArray(dyn.output)) {
          dyn.output.forEach((item) => {
            if (item.title && item.link) {
              md += `- [${item.title}](${item.link})\n`;
            }
          });
          md += "\n";
        }
      }
    });
  });
  return md;
};

const downloadMarkdown = (content: string) => {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "chat-export.md";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const ChatBotDemo = () => {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [model, setModel] = useState<string>(models[0].value);
  const [localMessages, setLocalMessages] = useState<UIMessage[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const lastSyncedCountRef = useRef(0);
  const LS_MODEL_KEY = "settings:model";
  const LS_MCP_KEY = "settings:mcpServers";
  const LS_MESSAGES_KEY = "chat:messages";

  // Tool display names mapping
  const getToolDisplayName = (toolType: string, state: string) => {
    const baseNames: Record<string, string> = {
      time: "Knowing Current time",
      calculate: "Performing calculations",
      search: "Searching the web",
      scrape: "Viewing the page",
      deepresearch: "Deep research analysis",
    };

    if (toolType === "search" && state !== "output-available") {
      return "Searching...";
    }

    return baseNames[toolType] || toolType;
  };
  const {
    messages: chatMessages,
    sendMessage,
    status,
    stop,
  } = useChat({
    onError: (error) => {
      const message =
        (error as { message?: string })?.message ||
        "Something went wrong while contacting the server.";
      toast.error("Request failed", {
        description: message,
      });
    },
  });

  // Load messages from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_MESSAGES_KEY);
      if (stored) {
        const parsedMessages = JSON.parse(stored);
        setLocalMessages(parsedMessages);
      }
    } catch (error) {
      console.error("Failed to load messages from localStorage:", error);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(LS_MESSAGES_KEY, JSON.stringify(localMessages));
    } catch (error) {
      console.error("Failed to save messages to localStorage:", error);
    }
  }, [localMessages]);

  // Sync new messages from useChat to local state
  useEffect(() => {
    // Only sync if we have new messages from useChat and we're not in the middle of editing
    if (chatMessages.length > lastSyncedCountRef.current && !editingMessageId) {
      const newMessages = chatMessages.slice(lastSyncedCountRef.current);
      setLocalMessages((prev) => [...prev, ...newMessages]);
      lastSyncedCountRef.current = chatMessages.length;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatMessages.length, editingMessageId]);

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

  const handleSubmit = (
    message: PromptInputMessage,
    deepresearch?: boolean
  ) => {
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
          deepresearch,
        },
      }
    );
    setInput("");
  };

  const handleDownload = () => {
    const md = convertMessagesToMarkdown(localMessages);
    downloadMarkdown(md);
  };

  const handleEditMessage = (messageId: string, currentText: string) => {
    setEditingMessageId(messageId);
    setEditingText(currentText);
  };

  const handleSaveEdit = () => {
    if (!editingMessageId || !editingText.trim()) return;

    setLocalMessages((prev) =>
      prev.map((msg) =>
        msg.id === editingMessageId
          ? {
              ...msg,
              parts: msg.parts.map((part) =>
                part.type === "text" ? { ...part, text: editingText } : part
              ),
            }
          : msg
      )
    );

    setEditingMessageId(null);
    setEditingText("");
    toast.success("Message updated successfully");
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditingText("");
  };

  const handleDeleteMessage = (messageId: string) => {
    setLocalMessages((prev) => {
      const newMessages = prev.filter((msg) => msg.id !== messageId);
      return newMessages;
    });
    toast.success("Message deleted successfully");
  };

  const handleClearAllMessages = () => {
    if (
      confirm(
        "Are you sure you want to clear all messages? This action cannot be undone."
      )
    ) {
      setLocalMessages([]);
      localStorage.removeItem(LS_MESSAGES_KEY);
      toast.success("All messages cleared");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-3 relative size-full h-screen">
      <Navbar
        onDownload={handleDownload}
        onClearMessages={handleClearAllMessages}
        hasMessages={localMessages.length > 0}
      />
       {!localMessages || localMessages.length === 0 ? (
        <div className="absolute flex flex-col top-0 left-0 right-0 bottom-0 space-y-8 -z-50 items-center justify-center text-center mb-24 px-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl scale-150"></div>
            <SmileIcon className="relative w-24 h-24 text-primary drop-shadow-lg" suppressHydrationWarning={true} />
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
              Welcome to Simp AI
            </h2>
            <p className="text-muted-foreground text-lg max-w-md leading-relaxed font-medium">
              Experience the future of AI conversation. Ask anything, explore ideas, and discover insights with our advanced AI assistant.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full border">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            AI is ready to assist you
          </div>
        </div>
      ) : null}
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {localMessages.map((message: UIMessage) => {
              const metadata = message.metadata as
                | undefined
                | {
                    stats?: { inputTokens?: number; outputTokens?: number };
                    model: string;
                  };
              const isEditing = editingMessageId === message.id;
              const messageText =
                message.parts.find((part) => part.type === "text")?.text || "";

              return (
                <div key={message.id} id={`message-${message.id}`}>
                  <Message
                    from={message.role}
                    actions={
                      message.role === "user" ? (
                        <MessageActions
                          role={message.role}
                          onEdit={() =>
                            handleEditMessage(message.id, messageText)
                          }
                          onDelete={() => handleDeleteMessage(message.id)}
                          isEditing={isEditing}
                          variant="hover"
                        />
                      ) : (
                        <MessageActions
                          role={message.role}
                          onEdit={() =>
                            handleEditMessage(message.id, messageText)
                          }
                          isEditing={isEditing}
                          variant="hover"
                        />
                      )
                    }
                    actionsVariant={
                      message.role === "user" ? "hover" : "hover"
                    }>
                    <MessageContent>
                      <div className="overflow-x-auto gap-4">
                        {message.parts.map((part, i) => {
                          switch (true) {
                            case part.type == "text":
                              if (isEditing && message.role === "user") {
                                return (
                                  <div
                                    key={`${message.id}-${i}`}
                                    className="space-y-2">
                                    <Textarea
                                      value={editingText}
                                      onChange={(e) =>
                                        setEditingText(e.target.value)
                                      }
                                      className="w-full resize-none"
                                      rows={3}
                                      autoFocus
                                    />
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        onClick={handleSaveEdit}>
                                        Save
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={handleCancelEdit}>
                                        Cancel
                                      </Button>
                                    </div>
                                  </div>
                                );
                              }
                              return (
                                <Response
                                  key={`${message.id}-${i}`}
                                  className="text-base">
                                  {part.text}
                                </Response>
                              );
                            case part.type == "reasoning":
                              return (
                                <Reasoning
                                  key={`${message.id}-${i}`}
                                  className="w-full bg-muted/50 border border-border rounded-lg my-2"
                                  isStreaming={status === "streaming"}
                                  defaultOpen={true}>
                                  <ReasoningTrigger />
                                  <ReasoningContent>
                                    {part.text}
                                  </ReasoningContent>
                                </Reasoning>
                              );
                            case part.type.startsWith("tool-") ||
                              part.type == "dynamic-tool":
                              const dyn = part as DynamicToolUIPart;
                              const toolType = part.type.replace("tool-", "");

                              // Hide search tool when output is available (results shown below)
                              if (
                                dyn.state === "output-available" &&
                                toolType === "search"
                              ) {
                                return null;
                              }

                              // Only show tool when running (output not available) for other tools
                              if (
                                dyn.state === "output-available" &&
                                toolType !== "search"
                              ) {
                                return null;
                              }

                              return (
                                <Tool
                                  key={`${message.id}-${i}-${toolType}`}
                                  className="bg-muted/50 border border-border rounded-lg p-3 my-2">
                                  <div className="flex items-center gap-3">
                                    <div className="flex-shrink-0">
                                      <ToolHeader
                                        name={getToolDisplayName(
                                          toolType,
                                          dyn.state
                                        )}
                                        type={`tool-${toolType}`}
                                        state={dyn.state}
                                      />
                                    </div>
                                    {dyn.state === "output-available" &&
                                      Array.isArray(dyn.output) && (
                                        <div className="flex ml-auto">
                                          {dyn.output
                                            .slice(0, 5)
                                            .map((item, outputIndex) => {
                                              let hostname: string;
                                              try {
                                                hostname = new URL(item.link)
                                                  .hostname;
                                              } catch {
                                                hostname = "external";
                                              }

                                               return (
                                                 <Image
                                                   key={`${message.id}-${i}-${toolType}-${outputIndex}`}
                                                   src={`https://www.google.com/s2/favicons?domain=${hostname}`}
                                                   alt={`Favicon for ${hostname}`}
                                                   width={24}
                                                   height={24}
                                                   className="rounded-full border-2 border-white shadow-sm w-6 h-6 -ml-2 bg-white"
                                                 />
                                               );
                                            })}
                                          {dyn.output.length > 5 && (
                                            <div className="rounded-full border-2 border-white shadow-sm w-6 h-6 -ml-2 bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                                              +{dyn.output.length - 5}
                                            </div>
                                          )}
                                        </div>
                                      )}
                                  </div>
                                </Tool>
                              );
                             case part.type == "file" &&
                               part.mediaType.startsWith("image/"):
                               return (
                                 <Image
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
                      {/* Token count, model info, and sources in one line - only for assistant messages */}
                      {message.role === "assistant" && (
                        <div className="w-full">
                          <div className="flex items-center justify-between w-full">
                             <div className="flex items-center gap-3 text-sm">
                               <div className="flex items-center gap-1">
                                {(() => {
                                  switch (status) {
                                     case "streaming":
                                       return (
                                         <LoaderCircleIcon className="w-3 h-3 animate-spin text-green-500" suppressHydrationWarning={true} />
                                       );
                                     default:
                                       return (
                                         <BoxIcon className="w-3 h-3 text-muted-foreground" suppressHydrationWarning={true} />
                                       );
                                  }
                                })()}
                                <span className="font-medium text-muted-foreground">
                                  {metadata?.model}
                                </span>
                              </div>
                            </div>

                            {/* Collect search results from tool outputs and show sources + delete */}
                            {(() => {
                              const searchResults: Array<{
                                title: string;
                                link: string;
                                snippet: string;
                              }> = [];
                              message.parts.forEach((part) => {
                                if (part.type === "tool-search") {
                                  const dyn = part as unknown as {
                                    state: string;
                                    output?: unknown[];
                                  };
                                  if (
                                    dyn.state === "output-available" &&
                                    Array.isArray(dyn.output)
                                  ) {
                                    searchResults.push(
                                      ...(dyn.output as Array<{
                                        title: string;
                                        link: string;
                                        snippet: string;
                                      }>)
                                    );
                                  }
                                }
                              });

                              return (
                                <div className="flex items-center gap-2">
                                  {searchResults.length > 0 && (
                                    <Dialog>
                                      <DialogTrigger asChild>
                                         <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-foreground transition-all duration-200 opacity-60 hover:opacity-100 cursor-pointer">
                                           <GlobeIcon className="w-4 h-4" suppressHydrationWarning={true} />
                                           {searchResults.length} sources
                                         </button>
                                      </DialogTrigger>
                                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                        <DialogHeader>
                                          <DialogTitle>
                                            Search Results
                                          </DialogTitle>
                                          <DialogDescription>
                                            Sources used to generate this
                                            response
                                          </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 mt-4">
                                          {searchResults.map((result, i) => (
                                            <div
                                              key={i}
                                              className="border rounded-lg p-4 hover:bg-accent transition-colors">
                                              <div className="flex items-start gap-3">
                                                <div className="flex-1 min-w-0">
                                                  <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mb-1">
                                                    <a
                                                      href={result.link}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="line-clamp-1">
                                                      {result.title}
                                                    </a>
                                                  </h3>
                                                  <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs text-green-600 dark:text-green-400 truncate">
                                                      {
                                                        new URL(result.link)
                                                          .hostname
                                                      }
                                                    </span>
                                                  </div>
                                                  <p className="text-sm text-muted-foreground line-clamp-3">
                                                    {result.snippet}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </DialogContent>
                                    </Dialog>
                                  )}
                                  <AssistantMessageDelete
                                    onDelete={() =>
                                      handleDeleteMessage(message.id)
                                    }
                                  />
                                </div>
                              );
                            })()}
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
        <ConversationUserLocator messages={localMessages} />
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
