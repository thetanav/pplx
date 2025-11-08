"use client";

import { cn } from "@/lib/utils";
import { memo, forwardRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

type ResponseProps = {
  children?: React.ReactNode;
  className?: string;
};

export const Response = memo(
  forwardRef<HTMLDivElement, ResponseProps>(({ className, children }, ref) => (
    <div
      ref={ref}
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}>
      {typeof children === "string" ? (
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}>
          {children}
        </ReactMarkdown>
      ) : (
        children
      )}
    </div>
  )),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
