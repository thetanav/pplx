"use client";

import { useState } from "react";
import { SettingsIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Textarea } from "./ui/textarea";
import ChooseModels from "./settings/models";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<string>("model");

  return (
    <div className="fixed top-0 right-0 p-2 gap-1 flex z-50">
      {/* <ModeToggle /> */}
      <Dialog modal={true} open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline" aria-label="Open settings">
            <SettingsIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[80vw] sm:max-w-4xl lg:max-w-5xl h-[70vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="flex gap-6 h-full overflow-y-auto">
            <nav className="flex-1">
              <div className="space-y-1">
                <Button
                  variant={section === "model" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSection("model")}>
                  Models
                </Button>
                <Button
                  variant={section === "instructions" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSection("instructions")}>
                  Custom Instructions
                </Button>
                <Button
                  variant={section === "about" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSection("about")}>
                  Developer
                </Button>
              </div>
            </nav>

            <div className="flex-3">
              {section === "model" && <ChooseModels />}

              {/* {section === "tools" && (
                <section className="space-y-3">
                  <h3 className="text-base font-semibold">Available tools</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                    <ul className="list-disc ml-4 text-muted-foreground">
                      {tools.map((t) => (
                        <li key={t.name}>
                          <h4 className="text-sm font-semibold">{t.name}</h4>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>
              )} */}

              {section === "instructions" && (
                <section className="space-y-3">
                  <h3 className="text-base font-semibold">
                    Custom instructions
                  </h3>
                  <Textarea placeholder="Enter your custom instructions" />
                </section>
              )}

              {section === "about" && (
                <section className="space-y-2">
                  <h3 className="text-base font-semibold">Developer</h3>
                  <p className="text-sm">
                    Developed by{" "}
                    <a
                      className="hover:underline"
                      href="https://tanavindev.tech"
                      target="_blank"
                      rel="noopener noreferrer">
                      tanav
                    </a>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Thank you for using this app.
                  </p>
                </section>
              )}
            </div>
          </div>

          <DialogFooter>
            <div className="flex w-full items-center justify-end">
              <Button onClick={() => setOpen(false)}>Close</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
