"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { WrenchIcon, ChevronDownIcon } from "lucide-react";
import type { ComponentProps } from "react";
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Response } from "./response";
import Shimmer from "./shimmer";

type ToolCallContextValue = {
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const ToolCallContext = createContext<ToolCallContextValue | null>(null);

const useToolCall = () => {
  const context = useContext(ToolCallContext);
  if (!context) {
    throw new Error("ToolCall components must be used within ToolCall");
  }
  return context;
};

export type ToolCallProps = ComponentProps<typeof Collapsible> & {
  isStreaming?: boolean;
  toolType: string;
  toolState:
    | "input-streaming"
    | "input-available"
    | "output-available"
    | "output-error";
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const AUTO_CLOSE_DELAY = 1000;

const getToolMessage = (
  toolType: string,
  toolState: string,
  isStreaming: boolean
) => {
  const toolName = toolType.replace(/([A-Z])/g, " $1").trim();

  if (isStreaming) {
    return <Shimmer text={`Using ${toolName}...`} />;
  }

  switch (toolState) {
    case "input-streaming":
      return <p>Preparing {toolName}...</p>;
    case "input-available":
      return <p>Running {toolName}...</p>;
    case "output-available":
      return <p>Completed {toolName}</p>;
    case "output-error":
      return <p>{toolName} failed</p>;
    default:
      return <p>Used {toolName}</p>;
  }
};

export const ToolCall = memo(
  ({
    className,
    isStreaming = false,
    toolType,
    toolState,
    open,
    defaultOpen = true,
    onOpenChange,
    children,
    ...props
  }: ToolCallProps) => {
    const [isOpen, setIsOpen] = useControllableState({
      prop: open,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    });

    const [hasAutoClosed, setHasAutoClosed] = useState(false);

    // Auto-open when streaming starts, auto-close when streaming ends (once only)
    useEffect(() => {
      if (defaultOpen && !isStreaming && isOpen && !hasAutoClosed) {
        // Add a small delay before closing to allow user to see the content
        const timer = setTimeout(() => {
          setIsOpen(false);
          setHasAutoClosed(true);
        }, AUTO_CLOSE_DELAY);

        return () => clearTimeout(timer);
      }
    }, [isStreaming, isOpen, defaultOpen, setIsOpen, hasAutoClosed]);

    const handleOpenChange = (newOpen: boolean) => {
      setIsOpen(newOpen);
    };

    return (
      <ToolCallContext.Provider value={{ isStreaming, isOpen, setIsOpen }}>
        <Collapsible
          className={cn("not-prose mb-4", className)}
          onOpenChange={handleOpenChange}
          open={isOpen}
          {...props}>
          {children}
        </Collapsible>
      </ToolCallContext.Provider>
    );
  }
);

export type ToolCallTriggerProps = ComponentProps<typeof CollapsibleTrigger>;

export const ToolCallTrigger = memo(
  ({ className, children, ...props }: ToolCallTriggerProps) => {
    const { isStreaming } = useToolCall();

    return (
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground",
          className
        )}
        {...props}>
        {children}
      </CollapsibleTrigger>
    );
  }
);

export type ToolCallContentProps = ComponentProps<typeof CollapsibleContent> & {
  toolType: string;
  toolState: string;
  input?: any;
  output?: any;
  errorText?: string;
};

export const ToolCallContent = memo(
  ({
    className,
    toolType,
    toolState,
    input,
    output,
    errorText,
    ...props
  }: ToolCallContentProps) => {
    const { isStreaming } = useToolCall();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const el = scrollRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight; // scroll to bottom when content grows
      }
    }, [input, output, errorText]);

    const renderContent = () => {
      if (isStreaming) {
        return null; // Don't show content while streaming
      }

      return (
        <div className="space-y-2 mt-2">
          {input && (
            <div className="text-xs">
              <span className="font-medium text-muted-foreground">Input:</span>
              <pre className="mt-1 p-2 bg-muted/50 rounded text-xs overflow-x-auto">
                {JSON.stringify(input, null, 2)}
              </pre>
            </div>
          )}

          {(output || errorText) && (
            <div className="text-xs">
              <span className="font-medium text-muted-foreground">
                {errorText ? "Error:" : "Output:"}
              </span>
              <div
                className={cn(
                  "mt-1 p-2 rounded text-xs overflow-x-auto",
                  errorText
                    ? "bg-destructive/10 text-destructive"
                    : "bg-muted/50"
                )}>
                {errorText ? (
                  <div>{errorText}</div>
                ) : (
                  <pre>{JSON.stringify(output, null, 2)}</pre>
                )}
              </div>
            </div>
          )}
        </div>
      );
    };

    return (
      <CollapsibleContent
        className={cn(
          "text-sm relative",
          "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-muted-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
          className
        )}
        {...props}>
        <div
          ref={scrollRef}
          className="grid gap-2 relative z-0 pb-3 max-h-48 overflow-y-auto">
          {renderContent()}
        </div>
      </CollapsibleContent>
    );
  }
);

// Combined component for easy usage
export type CompactToolCallProps = {
  toolType: string;
  toolState:
    | "input-streaming"
    | "input-available"
    | "output-available"
    | "output-error";
  input?: any;
  output?: any;
  errorText?: string;
  isStreaming?: boolean;
  className?: string;
};

export const CompactToolCall = memo(
  ({
    toolType,
    toolState,
    input,
    output,
    errorText,
    isStreaming = false,
    className,
  }: CompactToolCallProps) => {
    return (
      <ToolCall
        toolType={toolType}
        toolState={toolState}
        isStreaming={isStreaming}
        className={className}>
        <ToolCallTrigger>
          <WrenchIcon className="size-4 text-primary" />
          {getToolMessage(toolType, toolState, isStreaming)}
          <ChevronDownIcon className="size-4" />
        </ToolCallTrigger>
        <ToolCallContent
          toolType={toolType}
          toolState={toolState}
          input={input}
          output={output}
          errorText={errorText}
        />
      </ToolCall>
    );
  }
);

ToolCall.displayName = "ToolCall";
ToolCallTrigger.displayName = "ToolCallTrigger";
ToolCallContent.displayName = "ToolCallContent";
CompactToolCall.displayName = "CompactToolCall";
