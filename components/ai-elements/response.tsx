"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, memo, forwardRef } from "react";
import { Streamdown } from "streamdown";

type ResponseProps = ComponentProps<typeof Streamdown>;

export const Response = memo(
  forwardRef<HTMLDivElement, ResponseProps>(({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}>
      <Streamdown {...props} />
    </div>
  )),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
