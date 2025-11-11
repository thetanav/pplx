import { models } from "@/lib/models";
import {
  PromptInput,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputModelSelect,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
  PromptInputModelSelectTrigger,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
  type PromptInputMessage,
} from "./ai-elements/prompt-input";

import Image from "next/image";
import {
  BrainIcon,
  GemIcon,
  ImageIcon,
  MonitorDownIcon,
  PaperclipIcon,
  TelescopeIcon,
  ZapIcon,
} from "lucide-react";
import { ChatStatus } from "ai";
import { type Dispatch, type SetStateAction, useState } from "react";

type AIInputProps = {
  handleSubmit: (message: PromptInputMessage, deepresearch?: boolean) => void;
  setInput: Dispatch<SetStateAction<string>>;
  input: string;
  setModel: Dispatch<SetStateAction<string>>;
  model: string;
  status: ChatStatus;
  stop: () => Promise<void>;
};

export default function AIInput({
  handleSubmit,
  setInput,
  input,
  setModel,
  model,
  status,
  stop,
}: AIInputProps) {
  const [deepresearch, setDeepresearch] = useState(false);

  return (
    <PromptInput
      onSubmit={(message) => {
        handleSubmit(message, deepresearch);
      }}
      globalDrop
      multiple
      accept="image/*"
      className="border-t bg-background/80 backdrop-blur-md border-border/50 shadow-lg">
      <PromptInputBody>
        <PromptInputAttachments>
          {(attachment) => <PromptInputAttachment data={attachment} />}
        </PromptInputAttachments>
        <PromptInputTextarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          placeholder="Ask me anything..."
          className="min-h-[60px] resize-none border-0 bg-transparent px-6 py-4 text-base focus:ring-0 placeholder:text-muted-foreground/60"
        />
      </PromptInputBody>
      <PromptInputToolbar>
        <PromptInputTools>
          <PromptInputActionMenuTrigger title="Add files">
            <PaperclipIcon className="w-4 h-4" />
          </PromptInputActionMenuTrigger>
          <PromptInputModelSelect
            onValueChange={(value) => {
              setModel(value);
            }}
            value={model}>
            <PromptInputModelSelectTrigger className="bg-transparent px-2 py-1 text-xs font-medium border-none shadow-none h-8">
              <span className="truncate max-w-[100px]">
                {models.find(m => m.value === model)?.name || model}
              </span>
            </PromptInputModelSelectTrigger>
            <PromptInputModelSelectContent>
              {models.map((model) => (
                <PromptInputModelSelectItem
                  key={model.value}
                  value={model.value}
                  className="w-full bg-transparent">
                  <Image
                    alt={model.name}
                    src={"/ai-logos" + model.logo}
                    className="fill-primary text-primary"
                    width={20}
                    height={20}
                  />
                  <p className="text-xs w-full">{model.name}</p>
                  {model.reasoning && (
                    <span className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200 p-1 rounded-md flex items-center">
                      <BrainIcon className="w-2 h-2 text-current" />
                    </span>
                  )}
                  {model.fast && (
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 p-1 rounded-md flex items-center">
                      <ZapIcon className="w-2 h-2 text-current" />
                    </span>
                  )}
                  {model.image && (
                    <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 p-1 rounded-md flex items-center">
                      <ImageIcon className="w-2 h-2 text-current" />
                    </span>
                  )}
                  {model.pro && (
                    <span className="bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 p-1 rounded-md flex items-center">
                      <GemIcon className="w-2 h-2 text-current" />
                    </span>
                  )}
                  {model.local && (
                    <span className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 p-1 rounded-md flex items-center">
                      <MonitorDownIcon className="w-2 h-2 text-current" />
                    </span>
                  )}
                </PromptInputModelSelectItem>
              ))}
            </PromptInputModelSelectContent>
          </PromptInputModelSelect>
          <PromptInputButton
            variant={deepresearch ? "default" : "ghost"}
            onClick={() => setDeepresearch(!deepresearch)}
            title="Toggle Deep Research"
            className={deepresearch ? "!bg-accent !text-accent-foreground" : ""}>
            <TelescopeIcon className="w-4 h-4" />
          </PromptInputButton>
        </PromptInputTools>

        <PromptInputSubmit
          disabled={!input.trim() && status !== "streaming"}
          status={status}
          stop={stop}
          className="h-10 w-10 rounded-full p-0 shadow-lg hover:shadow-xl transition-all duration-200"
        />
      </PromptInputToolbar>
    </PromptInput>
  );
}
