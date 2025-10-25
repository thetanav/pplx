import { Settings2Icon } from "lucide-react";
import { ModeToggle } from "./theme_toggle";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="bg-background border shadow fixed top-4 right-4 flex rounded-lg z-50 items-center">
      <ModeToggle />
      <Button variant={"ghost"} size={"icon"} asChild>
        <Link href="/settings">
          <Settings2Icon className="w-4 h-4" />
        </Link>
      </Button>
      <img
        src="https://avatar.vercel.sh/tanav"
        className="w-6 h-6 rounded-full m-1"
      />
    </div>
  );
}
