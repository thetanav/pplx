import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { models } from "@/lib/models";
import { Input } from "../ui/input";
// immediate persistence: no debounce

const LS_MODEL_KEY = "settings:model";

export default function ChooseModels() {
  const [selectedModel, setSelectedModel] = useState<string>(
    models[0]?.value ?? ""
  );
  const [ollamaEnabled, setOllamaEnabled] = useState<boolean>(false);
  const [ollamaModelName, setOllamaModelName] = useState<string>("");
  const [ollamaModelId, setOllamaModelId] = useState<string>("");
  const [ollamaStatus, setOllamaStatus] = useState<string | null>(null);
  const [openRouterKey, setOpenRouterKey] = useState<string>("");
  const [geminiKey, setGeminiKey] = useState<string>("");
  const [anthropicKey, setAnthropicKey] = useState<string>("");
  const [serpKey, setSerpKey] = useState<string>("");

  useEffect(() => {
    try {
      const storedModel = localStorage.getItem(LS_MODEL_KEY);
      if (storedModel) setSelectedModel(storedModel);

      const oEnabled = localStorage.getItem("settings:ollama:enabled");
      const oName = localStorage.getItem("settings:ollama:name");
      const oId = localStorage.getItem("settings:ollama:id");
      const openKey = localStorage.getItem("settings:openrouter:key");
      const gemKey = localStorage.getItem("settings:gemini:key");
      const anthKey = localStorage.getItem("settings:anthropic:key");
      const serp = localStorage.getItem("settings:serpapi:key");

      if (oEnabled) setOllamaEnabled(oEnabled === "1");
      if (oName) setOllamaModelName(oName);
      if (oId) setOllamaModelId(oId);
      if (openKey) setOpenRouterKey(openKey);
      if (gemKey) setGeminiKey(gemKey);
      if (anthKey) setAnthropicKey(anthKey);
      if (serp) setSerpKey(serp);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      if (selectedModel) localStorage.setItem(LS_MODEL_KEY, selectedModel);
    } catch {}
  }, [selectedModel]);

  // persist ollama settings immediately when state changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "settings:ollama:enabled",
        ollamaEnabled ? "1" : "0"
      );
    } catch {}
  }, [ollamaEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem("settings:ollama:name", ollamaModelName);
    } catch {}
  }, [ollamaModelName]);

  useEffect(() => {
    try {
      localStorage.setItem("settings:ollama:id", ollamaModelId);
    } catch {}
  }, [ollamaModelId]);

  async function checkOllama() {
    setOllamaStatus("checking");
    try {
      const res = await fetch("http://127.0.0.1:11434/", {
        cache: "no-store",
      });
      if (res.ok) {
        setOllamaStatus("ok");
      } else {
        setOllamaStatus("unreachable");
      }
    } catch (e) {
      setOllamaStatus("unreachable");
    }
  }

  // persist API keys immediately when they change
  useEffect(() => {
    try {
      localStorage.setItem("settings:openrouter:key", openRouterKey);
    } catch {}
  }, [openRouterKey]);

  useEffect(() => {
    try {
      localStorage.setItem("settings:gemini:key", geminiKey);
    } catch {}
  }, [geminiKey]);

  useEffect(() => {
    try {
      localStorage.setItem("settings:anthropic:key", anthropicKey);
    } catch {}
  }, [anthropicKey]);

  useEffect(() => {
    try {
      localStorage.setItem("settings:serpapi:key", serpKey);
    } catch {}
  }, [serpKey]);

  return (
    <section className="space-y-3">
      <h3 className="text-base font-semibold">Model</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="model-select">Default model</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger id="model-select" className="w-full">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {models.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  <div className="flex items-center gap-2">
                    <span>{m.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center justify-between">
            <Label>Use local Ollama</Label>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={checkOllama}>
                Check
              </Button>
              <Switch
                checked={ollamaEnabled}
                onCheckedChange={(v) => setOllamaEnabled(Boolean(v))}
                aria-label="Enable Ollama models"
              />
            </div>
          </div>

          <Input
            placeholder="model name"
            value={ollamaModelName}
            onChange={(e) => setOllamaModelName(e.target.value)}
          />

          <Input
            placeholder="model id"
            value={ollamaModelId}
            onChange={(e) => setOllamaModelId(e.target.value)}
          />

          {ollamaStatus === "checking" && (
            <p className="text-xs text-muted-foreground">Checking Ollama...</p>
          )}
          {ollamaStatus === "ok" && (
            <p className="text-xs text-success">Ollama reachable</p>
          )}
          {ollamaStatus === "unreachable" && (
            <p className="text-xs text-destructive">Ollama not reachable</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="model-select">Openrouter key</Label>
          <Input
            id="openkey"
            placeholder="api key"
            value={openRouterKey}
            onChange={(e) => setOpenRouterKey(e.target.value)}
          />
          <Label htmlFor="gemnkey">Gemini key</Label>
          <Input
            id="gemnkey"
            placeholder="api key"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
          />
          <Label htmlFor="anthkey">Anthropic key</Label>
          <Input
            id="anthkey"
            placeholder="api key"
            value={anthropicKey}
            onChange={(e) => setAnthropicKey(e.target.value)}
          />
          <Label htmlFor="serpkey">SerpAPI key</Label>
          <Input
            id="serpkey"
            placeholder="api key"
            value={serpKey}
            onChange={(e) => setSerpKey(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}
