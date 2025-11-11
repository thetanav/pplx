import {
  Settings2Icon,
  DownloadIcon,
  Trash2Icon,
} from "lucide-react";
import { ModeToggle } from "./theme_toggle";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";

interface NavbarProps {
  onDownload?: () => void;
  onClearMessages?: () => void;
  hasMessages?: boolean;
}

export default function Navbar({
  onDownload,
  onClearMessages,
  hasMessages,
}: NavbarProps) {
  const { data: session } = useSession();
  return (
    <TooltipProvider>
      <nav className="fixed top-6 right-6 z-50">
        <div className="bg-card/80 backdrop-blur-md border shadow-lg flex rounded-xl items-center p-2 ring-1 ring-border/50">
          <ModeToggle />
          {!session ? (
            <Button variant={"default"} size="sm" asChild>
              <Link href="/signin">Sign in</Link>
            </Button>
          ) : (
            <div className="flex items-center">
              {hasMessages && onDownload && (
                <Tooltip>
                  <TooltipTrigger asChild>
                     <Button
                       variant={"ghost"}
                       size={"icon"}
                       onClick={onDownload}>
                      <DownloadIcon className="w-4 h-4" suppressHydrationWarning={true} />
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
                     <Button
                       variant={"ghost"}
                       size={"icon"}
                       onClick={onClearMessages}>
                      <Trash2Icon className="w-4 h-4" suppressHydrationWarning={true} />
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
                       <Settings2Icon className="w-4 h-4" suppressHydrationWarning={true} />
                     </Link>
                   </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Settings</p>
                </TooltipContent>
              </Tooltip>
              <Image
                src={
                  session.user?.image ||
                  `https://avatar.vercel.sh/${session.user?.name}`
                }
                alt="User avatar"
                width={24}
                height={24}
                className="w-6 h-6 rounded-full m-1"
              />
            </div>
          )}
        </div>
      </nav>
    </TooltipProvider>
  );
}
