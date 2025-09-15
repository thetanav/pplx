"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, GlobeIcon } from "lucide-react";
import type { ComponentProps } from "react";

export type SourcesProps = ComponentProps<typeof Collapsible> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const Sources = ({ className, ...props }: SourcesProps) => (
  <Collapsible className={cn("not-prose my-2", className)} {...props} />
);

export type SourcesTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  count: number;
};

export const SourcesTrigger = ({
  className,
  count,
  children,
  ...props
}: SourcesTriggerProps) => (
  <CollapsibleTrigger
    className={cn(
      "flex w-full items-center gap-2 text-muted-foreground text-sm transition-colors hover:text-foreground",
      className
    )}
    {...props}>
    {children ?? (
      <>
        <GlobeIcon className="size-4 text-primary" />
        <p className="font-medium">Used {count} sources</p>
        <ChevronDownIcon className="size-4 transition-transform data-[state=open]:rotate-180 data-[state=closed]:rotate-0" />
      </>
    )}
  </CollapsibleTrigger>
);

export type SourcesContentProps = ComponentProps<typeof CollapsibleContent>;

export const SourcesContent = ({
  className,
  ...props
}: SourcesContentProps) => (
  <CollapsibleContent
    className={cn(
      "mt-3 grid gap-2 text-sm text-muted-foreground",
      "data-[state=closed]:fade-out-0 data-[state=closed]:blur-xl data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 data-[state=open]:blur-none outline-none data-[state=closed]:animate-in data-[state=open]:animate-in transition-all",
      className
    )}
    {...props}
  />
);

export type SourceProps = ComponentProps<"a"> & { title: string };

export const Source = ({ href, title, children, ...props }: SourceProps) => (
  <a
    className="flex items-center gap-2 transition-colors hover:text-primary"
    href={href}
    rel="noreferrer"
    target="_blank"
    {...props}>
    {children ?? (
      <>
        <img
          src={`https://www.google.com/s2/favicons?domain=${
            new URL(href!).hostname
          }&sz=64`}
          alt="favicon"
          width={16}
          height={16}
        />
        <span className="block font-medium text-xs">{title}</span>
      </>
    )}
  </a>
);
