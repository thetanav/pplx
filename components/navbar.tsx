import { LoaderCircle, LoaderCircleIcon, Settings2Icon } from "lucide-react";
import { ModeToggle } from "./theme_toggle";
import { Button } from "./ui/button";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  return (
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
          <Button variant={"ghost"} size={"icon"} asChild>
            <Link href="/settings">
              <Settings2Icon className="w-4 h-4" />
            </Link>
          </Button>
          <img
            src={
              session.user?.image ||
              `https://avatar.vercel.sh/${session.user?.name}`
            }
            className="w-6 h-6 rounded-full m-1"
          />
        </div>
      )}
    </div>
  );
}
