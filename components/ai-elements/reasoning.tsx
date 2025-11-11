"use client";

import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
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

type ReasoningContextValue = {
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  duration: number;
};

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

const useReasoning = () => {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error("Reasoning components must be used within Reasoning");
  }
  return context;
};

export type ReasoningProps = ComponentProps<typeof Collapsible> & {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
};

const AUTO_CLOSE_DELAY = 1000;
const MS_IN_S = 1000;

export const Reasoning = memo(
  ({
    className,
    isStreaming = false,
    open,
    defaultOpen = false,
    onOpenChange,
    duration: durationProp,
    children,
    ...props
  }: ReasoningProps) => {
    const [isOpen, setIsOpen] = useControllableState({
      prop: open,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    });
    const [duration, setDuration] = useControllableState({
      prop: durationProp,
      defaultProp: 0,
    });

    const [hasAutoClosed, setHasAutoClosed] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);

    useEffect(() => {
      if (isStreaming) {
        if (startTime === null) {
          setStartTime(Date.now());
        }
      } else if (startTime !== null) {
        setDuration(Math.ceil((Date.now() - startTime) / MS_IN_S));
        setStartTime(null);
      }
    }, [isStreaming, startTime, setDuration]);

    useEffect(() => {
      if (defaultOpen && !isStreaming && isOpen && !hasAutoClosed) {
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

    // Only render if streaming (thinking) or if it has been opened manually
    if (!isStreaming && !isOpen) {
      return null;
    }

    return (
      <ReasoningContext.Provider
        value={{ isStreaming, isOpen, setIsOpen, duration }}>
        <Collapsible
          className={cn("not-prose", className)}
          onOpenChange={handleOpenChange}
          open={isOpen}
          {...props}>
          {children}
        </Collapsible>
      </ReasoningContext.Provider>
    );
  }
);

export type ReasoningTriggerProps = ComponentProps<typeof CollapsibleTrigger>;

export const ReasoningTrigger = memo(
  ({ className, children, ...props }: ReasoningTriggerProps) => {
    const { isStreaming } = useReasoning();

    // Beautiful shimmer effect without text when thinking
    const triggerContent = children ?? (isStreaming ? (
      <div className="flex items-center justify-center">
        <div className="relative w-48 h-12 overflow-hidden rounded-2xl bg-gradient-to-r from-primary/5 via-primary/15 to-primary/5 shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/25 to-transparent rounded-2xl shimmer-thinking"></div>
        </div>
      </div>
    ) : null);

    if (!triggerContent) {
      return null;
    }

    return (
      <CollapsibleTrigger
        className={cn(
          "flex w-full items-center justify-center py-8",
          className
        )}
        {...props}>
        {triggerContent}
      </CollapsibleTrigger>
    );
  }
);

export type ReasoningContentProps = ComponentProps<
  typeof CollapsibleContent
> & {
  children: string;
};

export const ReasoningContent = memo(
  ({ className, children, ...props }: ReasoningContentProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const el = scrollRef.current;
      if (el) {
        el.scrollTop = el.scrollHeight; // scroll to bottom when content grows
      }
    }, [children]);

    return (
      <CollapsibleContent
        className={cn(
          "mt-4 text-sm relative",
          "data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 text-muted-foreground outline-none data-[state=closed]:animate-out data-[state=open]:animate-in",
          className
        )}
        {...props}>
        <Response
          ref={scrollRef}
          className="grid gap-2 relative z-0 pb-3 max-h-48 overflow-y-auto">
          {children}
        </Response>
      </CollapsibleContent>
    );
  }
);

Reasoning.displayName = "Reasoning";
ReasoningTrigger.displayName = "ReasoningTrigger";
ReasoningContent.displayName = "ReasoningContent";
