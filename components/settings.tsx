"use client";

import { useEffect, useMemo, useState } from "react";
import {
  InfoIcon,
  PlusIcon,
  TrashIcon,
  Settings2Icon,
  SettingsIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { ModeToggle } from "./theme_toggle";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { models } from "@/lib/models";
import { tools } from "@/lib/tools";
import { Textarea } from "./ui/textarea";

type McpServer = {
  name: string;
  url: string;
  active?: boolean;
};

const LS_MODEL_KEY = "settings:model";
const LS_MCP_KEY = "settings:mcpServers";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(
    models[0]?.value ?? ""
  );
  const [mcpServers, setMcpServers] = useState<McpServer[]>([]);
  const [newServerName, setNewServerName] = useState("");
  const [newServerUrl, setNewServerUrl] = useState("");
  const [section, setSection] = useState<string>("model");

  useEffect(() => {
    try {
      const storedModel = localStorage.getItem(LS_MODEL_KEY);
      if (storedModel) setSelectedModel(storedModel);
      const storedServers = localStorage.getItem(LS_MCP_KEY);
      if (storedServers) setMcpServers(JSON.parse(storedServers));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (selectedModel) localStorage.setItem(LS_MODEL_KEY, selectedModel);
    } catch {}
  }, [selectedModel]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_MCP_KEY, JSON.stringify(mcpServers));
    } catch {}
  }, [mcpServers]);

  const activeServerIndex = useMemo(
    () => mcpServers.findIndex((s) => s.active),
    [mcpServers]
  );

  const addServer = () => {
    if (!newServerUrl.trim()) return;
    const server: McpServer = {
      name: newServerName.trim() || new URL(newServerUrl).host,
      url: newServerUrl.trim(),
      active: mcpServers.length === 0, // first becomes active by default
    };
    setMcpServers((prev) => [...prev, server]);
    setNewServerName("");
    setNewServerUrl("");
  };

  const removeServer = (index: number) => {
    setMcpServers((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      // ensure one active remains if any
      if (next.length > 0 && !next.some((s) => s.active)) next[0].active = true;
      return next;
    });
  };

  const setActiveServer = (index: number) => {
    setMcpServers((prev) =>
      prev.map((s, i) => ({ ...s, active: i === index }))
    );
  };

  return (
    <div className="fixed top-0 right-0 p-2 gap-1 flex z-50">
      <ModeToggle />
      <Dialog modal={true} open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="outline" aria-label="Open settings">
            <SettingsIcon />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[80vw] sm:max-w-4xl lg:max-w-5xl h-[60vh] flex flex-col">
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
                  variant={section === "mcp" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSection("mcp")}>
                  MCP Servers
                </Button>
                <Button
                  variant={section === "tools" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSection("tools")}>
                  Available Tools
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
              {section === "model" && (
                <section className="space-y-3">
                  <h3 className="text-base font-semibold">Model</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                    <div className="space-y-2">
                      <Label htmlFor="model-select">Default model</Label>
                      <Select
                        value={selectedModel}
                        onValueChange={setSelectedModel}>
                        <SelectTrigger id="model-select" className="w-full">
                          <SelectValue placeholder="Select a model" />
                        </SelectTrigger>
                        <SelectContent>
                          {models.map((m) => (
                            <SelectItem key={m.value} value={m.value}>
                              <div className="flex items-center gap-2">
                                <m.icon className="size-4" />
                                <span>{m.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>
              )}

              {section === "mcp" && (
                <section className="space-y-3">
                  <h3 className="text-base font-semibold">MCP Servers</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-2 sm:col-span-1">
                      <Label htmlFor="mcp-name">Name (optional)</Label>
                      <Input
                        id="mcp-name"
                        placeholder="My MCP"
                        value={newServerName}
                        onChange={(e) => setNewServerName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="mcp-url">Gateway SSE URL</Label>
                      <Input
                        id="mcp-url"
                        placeholder="https://localhost:8811/sse"
                        value={newServerUrl}
                        onChange={(e) => setNewServerUrl(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addServer} disabled={!newServerUrl.trim()}>
                      <PlusIcon className="mr-1" /> Add server
                    </Button>
                  </div>

                  <div className="mt-4 space-y-2">
                    {mcpServers.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No MCP servers added yet.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {mcpServers.map((s, i) => (
                          <div
                            key={`${s.url}-${i}`}
                            className="flex items-center justify-between gap-3 rounded-md border p-3">
                            <div className="min-w-0">
                              <p className="font-medium truncate">
                                {s.name || new URL(s.url).host}
                              </p>
                              <p className="text-sm text-muted-foreground truncate">
                                {s.url}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Button
                                variant={s.active ? "default" : "outline"}
                                onClick={() => setActiveServer(i)}>
                                {s.active ? "Active" : "Set active"}
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => removeServer(i)}>
                                <TrashIcon className="mr-1" /> Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              )}

              {section === "tools" && (
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
              )}

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
