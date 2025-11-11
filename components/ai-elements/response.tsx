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
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 prose prose-sm max-w-none",
        // Enhanced typography
        "prose-headings:font-medium prose-headings:text-foreground",
        "prose-p:text-foreground prose-p:leading-relaxed",
        "prose-strong:text-foreground prose-strong:font-medium",
        "prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono",
        "prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg",
        "prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground prose-blockquote:font-normal",
        "prose-ul:text-foreground prose-ol:text-foreground",
        "prose-li:text-foreground prose-li:leading-relaxed",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-hr:border-border",
        className
      )}>
      {typeof children === "string" ? (
        <ReactMarkdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
          components={{
            // Custom components for better rendering
            p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
            h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 mt-6 first:mt-0">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-5 first:mt-0">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-semibold mb-2 mt-4 first:mt-0">{children}</h3>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
            li: ({ children }) => <li className="text-foreground">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                {children}
              </blockquote>
            ),
            code: ({ children, className }) => {
              const isInline = !className?.includes('language-');
              return isInline ? (
                <code className="bg-muted text-foreground px-1.5 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              ) : (
                <code className={className}>{children}</code>
              );
            },
          }}>
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
