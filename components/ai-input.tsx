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
  PromptInputModelSelectValue,
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
      className="bg-accent/20">
      <PromptInputBody>
        <PromptInputAttachments>
          {(attachment) => <PromptInputAttachment data={attachment} />}
        </PromptInputAttachments>
        <PromptInputTextarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
      </PromptInputBody>
      <PromptInputToolbar>
        <PromptInputTools>
          <PromptInputActionMenuTrigger />
          <PromptInputModelSelect
            onValueChange={(value) => {
              setModel(value);
            }}
            value={model}>
            <PromptInputModelSelectTrigger className="bg-transparent">
              <PromptInputModelSelectValue className="bg-transparent" />
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
            title="Toggle Deep Research">
            <TelescopeIcon className="w-4 h-4" />
          </PromptInputButton>
        </PromptInputTools>

        <PromptInputSubmit
          disabled={!input && !status}
          status={status}
          stop={stop}
        />
      </PromptInputToolbar>
    </PromptInput>
  );
}
