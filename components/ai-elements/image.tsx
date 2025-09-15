import { cn } from "@/lib/utils";
import type { Experimental_GeneratedImage } from "ai";
import NextImage from "next/image";

export type ImageProps = Experimental_GeneratedImage & {
  className?: string;
  alt?: string;
};
export const Image = ({ base64, mediaType, className, alt }: ImageProps) => (
  <NextImage
    alt={alt || ""}
    className={cn("h-auto max-w-full overflow-hidden rounded-md", className)}
    src={`data:${mediaType};base64,${base64}`}
    width={500}
    height={500}
  />
);
