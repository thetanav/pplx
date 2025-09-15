"use client";

import { InfoIcon } from "lucide-react";
import { Button } from "./ui/button";
import { ModeToggle } from "./theme_toggle";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Menu() {
  return (
    <div className="fixed top-0 right-0 p-2 gap-1 flex z-50">
      <Dialog modal>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline">
            <InfoIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Developer</DialogTitle>
          <div>
            Developed by{" "}
            <a className="hover:underline" href="https://tanavindev.tech">
              tanav
            </a>
          </div>
        </DialogContent>
      </Dialog>
      <ModeToggle />
    </div>
  );
}
