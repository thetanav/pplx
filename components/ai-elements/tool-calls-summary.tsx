"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { UIMessage } from "ai";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  CircleIcon,
  ClockIcon,
  WrenchIcon,
  XCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "./code-block";

interface ToolCall {
  id: string;
  type: string;
  state:
    | "input-streaming"
    | "input-available"
    | "output-available"
    | "output-error";
  input?: any;
  output?: any;
  errorText?: string;
  messageId: string;
}

interface ToolCallsSummaryProps {
  messages: UIMessage[];
  className?: string;
}

const getStatusBadge = (status: ToolCall["state"]) => {
  const labels = {
    "input-streaming": "Pending",
    "input-available": "Running",
    "output-available": "Completed",
    "output-error": "Error",
  } as const;

  const icons = {
    "input-streaming": <CircleIcon className="size-3" />,
    "input-available": <ClockIcon className="size-3 animate-pulse" />,
    "output-available": <CheckCircleIcon className="size-3 text-green-600" />,
    "output-error": <XCircleIcon className="size-3 text-red-600" />,
  } as const;

  return (
    <Badge className="gap-1 rounded-full text-xs h-5" variant="secondary">
      {icons[status]}
      {labels[status]}
    </Badge>
  );
};

const getToolIcon = (toolType: string) => {
  // You can customize icons based on tool type
  switch (toolType) {
    case "getWeather":
      return "🌤️";
    case "getTime":
      return "🕐";
    default:
      return "🔧";
  }
};

export const ToolCallsSummary = ({
  messages,
  className,
}: ToolCallsSummaryProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Extract all tool calls from messages
  const toolCalls: ToolCall[] = messages.flatMap((message) =>
    message.parts
      .filter((part): part is any => part.type.startsWith("tool-"))
      .map((part, index) => {
        const toolType = part.type.replace("tool-", "");
        return {
          id: `${message.id}-${index}`,
          type: toolType,
          state: (part as any).state?.state || "output-available",
          input: (part as any).state?.input,
          output: (part as any).type?.output,
          errorText: (part as any).type?.errorText,
          messageId: message.id,
        };
      })
  );

  if (toolCalls.length === 0) {
    return null;
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("w-full rounded-md border bg-card", className)}>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between p-3 h-auto hover:bg-accent/50">
          <div className="flex items-center gap-2">
            <WrenchIcon className="size-4 text-muted-foreground" />
            <span className="font-medium text-sm">
              Tool Calls ({toolCalls.length})
            </span>
          </div>
          <ChevronDownIcon className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </Button>
      </CollapsibleTrigger>

      <CollapsibleContent className="px-3 pb-3">
        <ScrollArea className="max-h-96">
          <div className="space-y-3">
            {toolCalls.map((toolCall, index) => (
              <div key={toolCall.id}>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getToolIcon(toolCall.type)}
                    </span>
                    <span className="font-medium text-sm capitalize">
                      {toolCall.type.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    {getStatusBadge(toolCall.state)}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Message {toolCall.messageId.slice(-4)}
                  </span>
                </div>

                {toolCall.input && (
                  <div className="space-y-1">
                    <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Input
                    </h5>
                    <div className="rounded-md bg-muted/50 p-2">
                      <CodeBlock
                        code={JSON.stringify(toolCall.input, null, 2)}
                        language="json"
                        className="text-xs"
                      />
                    </div>
                  </div>
                )}

                {(toolCall.output || toolCall.errorText) && (
                  <div className="space-y-1 mt-2">
                    <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {toolCall.errorText ? "Error" : "Output"}
                    </h5>
                    <div
                      className={cn(
                        "rounded-md p-2 text-xs",
                        toolCall.errorText
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted/50"
                      )}>
                      {toolCall.errorText ? (
                        <div>{toolCall.errorText}</div>
                      ) : toolCall.output ? (
                        (() => {
                          try {
                            return (
                              <CodeBlock
                                code={JSON.stringify(toolCall.output, null, 2)}
                                language="json"
                                className="text-xs"
                              />
                            );
                          } catch (error) {
                            return (
                              <div className="text-xs">
                                {String(toolCall.output)}
                              </div>
                            );
                          }
                        })()
                      ) : null}
                    </div>
                  </div>
                )}

                {index < toolCalls.length - 1 && <Separator className="mt-3" />}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
};
