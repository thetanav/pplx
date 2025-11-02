import { LoaderCircle, LoaderCircleIcon, Settings2Icon, DownloadIcon, Trash2Icon } from "lucide-react";
import { ModeToggle } from "./theme_toggle";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

interface NavbarProps {
  onDownload?: () => void;
  onClearMessages?: () => void;
  hasMessages?: boolean;
}

export default function Navbar({ onDownload, onClearMessages, hasMessages }: NavbarProps) {
  const { data: session, isPending } = useSession();
  return (
    <TooltipProvider>
      <div className="bg-background border shadow fixed top-4 right-4 flex rounded-lg z-50 items-center p-1">
        <ModeToggle />
        {isPending ? (
          <LoaderCircleIcon className="w-4 h-4 animate-spin" />
        ) : !session ? (
          <Button variant={"default"} asChild>
            <Link href="/signin">Sign in</Link>
          </Button>
        ) : (
          <div className="flex items-center">
            {hasMessages && onDownload && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={"ghost"} size={"icon"} onClick={onDownload}>
                    <DownloadIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download chat as Markdown</p>
                </TooltipContent>
              </Tooltip>
            )}
            {hasMessages && onClearMessages && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={"ghost"} size={"icon"} onClick={onClearMessages}>
                    <Trash2Icon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear all messages</p>
                </TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant={"ghost"} size={"icon"} asChild>
                  <Link href="/settings">
                    <Settings2Icon className="w-4 h-4" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
            <img
              src={
                session.user?.image ||
                `https://avatar.vercel.sh/${session.user?.name}`
              }
              alt="User avatar"
              className="w-6 h-6 rounded-full m-1"
            />
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
