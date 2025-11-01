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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  ArrowDownRightIcon,
  BoxIcon,
  GlobeIcon,
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

  const handleSubmit = (message: PromptInputMessage, deepresearch?: boolean) => {
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
                               return (
                                 <Reasoning
                                   key={`${message.id}-${i}`}
                                   className="w-full bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200/50 dark:border-purple-800/50 rounded-lg my-2"
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
                               if (dyn.state === "output-available" && toolType === "search") {
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
                                 <Tool key={`${message.id}-${i}-${toolType}`} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg p-3 my-2">
                                   <div className="flex items-center gap-3">
                                     <div className="flex-shrink-0">
                                       <ToolHeader
                                         name={getToolDisplayName(toolType, dyn.state)}
                                         type={`tool-${toolType}`}
                                         state={dyn.state}
                                       />
                                     </div>
                                     {dyn.state === "output-available" &&
                                       Array.isArray(dyn.output) && (
                                         <div className="flex ml-auto">
                                           {dyn.output.slice(0, 5).map(
                                             (item, outputIndex) => {
                                               let hostname: string;
                                               try {
                                                 hostname = new URL(item.link)
                                                   .hostname;
                                               } catch {
                                                 hostname = "external";
                                               }

                                               return (
                                                 <img
                                                   key={`${message.id}-${i}-${toolType}-${outputIndex}`}
                                                   src={`https://www.google.com/s2/favicons?domain=${hostname}`}
                                                   alt={`Favicon for ${hostname}`}
                                                   className="rounded-full border-2 border-white shadow-sm w-6 h-6 -ml-2 bg-white"
                                                 />
                                               );
                                             }
                                           )}
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
                        {/* Token count, model info, and sources in one line - only for assistant messages */}
                        {message.role === "assistant" && (
                          <div className="mt-4 pt-3 border-t border-border/50">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 text-xs bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 rounded-lg px-3 py-2 border border-gray-200/50 dark:border-gray-700/50">
                                {metadata?.stats && (
                                  <>
                                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                                      <ArrowDownRightIcon className="w-3 h-3 -rotate-90" />
                                      <span className="font-medium">{metadata.stats?.outputTokens ?? 0}</span>
                                      <span className="text-muted-foreground">out</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                      <ArrowDownRightIcon className="w-3 h-3 rotate-90" />
                                      <span className="font-medium">{metadata.stats?.inputTokens ?? 0}</span>
                                      <span className="text-muted-foreground">in</span>
                                    </div>
                                    <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
                                  </>
                                )}
                                <div className="flex items-center gap-1">
                                  {(() => {
                                    switch (status) {
                                      case "streaming":
                                        return (
                                          <LoaderCircleIcon className="w-3 h-3 animate-spin text-green-500" />
                                        );
                                      default:
                                        return <BoxIcon className="w-3 h-3 text-gray-500" />;
                                    }
                                  })()}
                                  <span className="font-medium text-gray-700 dark:text-gray-300">{metadata?.model}</span>
                                </div>
                              </div>

                              {/* Collect search results from tool outputs */}
                              {(() => {
                                const searchResults: Array<{title: string, link: string, snippet: string}> = [];
                                message.parts.forEach((part) => {
                                  if (part.type === "tool-search") {
                                    const dyn = part as unknown as { state: string; output?: unknown[] };
                                    if (dyn.state === "output-available" && Array.isArray(dyn.output)) {
                                      searchResults.push(...(dyn.output as Array<{title: string, link: string, snippet: string}>));
                                    }
                                  }
                                });

                                return searchResults.length > 0 ? (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 text-green-700 dark:text-green-300 border border-green-200/50 dark:border-green-800/50 rounded-full transition-all duration-200 hover:shadow-sm">
                                        <GlobeIcon className="w-4 h-4" />
                                        {searchResults.length} search results
                                      </button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                      <DialogHeader>
                                        <DialogTitle>Search Results</DialogTitle>
                                        <DialogDescription>
                                          Sources used to generate this response
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4 mt-4">
                                        {searchResults.map((result, i) => (
                                          <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <div className="flex items-start gap-3">
                                              <div className="flex-shrink-0 mt-1">
                                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                                  <span className="text-white text-xs font-bold">{i + 1}</span>
                                                </div>
                                              </div>
                                              <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline mb-1">
                                                  <a href={result.link} target="_blank" rel="noopener noreferrer" className="line-clamp-1">
                                                    {result.title}
                                                  </a>
                                                </h3>
                                                <div className="flex items-center gap-2 mb-2">
                                                  <span className="text-xs text-green-600 dark:text-green-400 truncate">
                                                    {new URL(result.link).hostname}
                                                  </span>
                                                  <span className="text-xs text-gray-400">•</span>
                                                  <GlobeIcon className="w-3 h-3 text-gray-400" />
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                                                  {result.snippet}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                ) : null;
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
