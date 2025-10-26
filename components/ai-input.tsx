import { models } from "@/lib/models";
import {
  PromptInput,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
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
  ZapIcon,
} from "lucide-react";
import { ChatStatus } from "ai";
import { type Dispatch, type SetStateAction } from "react";

type AIInputProps = {
  handleSubmit: (message: PromptInputMessage) => void;
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
  return (
    <PromptInput
      onSubmit={(message) => {
        handleSubmit(message);
      }}
      globalDrop
      multiple
      accept="image/*">
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
            <PromptInputModelSelectTrigger>
              <PromptInputModelSelectValue />
            </PromptInputModelSelectTrigger>
            <PromptInputModelSelectContent>
              {models.map((model) => (
                <PromptInputModelSelectItem
                  key={model.value}
                  value={model.value}>
                  <Image
                    alt={model.name}
                    src={"/ai-logos" + model.logo}
                    width={20}
                    height={20}
                  />
                  <p className="font-bold">{model.name}</p>
                  {model.reasoning && (
                    <span className="bg-green-100 text-green-800 p-1 rounded-md flex items-center">
                      <BrainIcon className="w-4 h-4 text-current" />
                    </span>
                  )}
                  {model.fast && (
                    <span className="bg-indigo-100 text-indigo-800 p-1 rounded-md flex items-center">
                      <ZapIcon className="w-4 h-4 text-current" />
                    </span>
                  )}
                  {model.image && (
                    <span className="bg-blue-100 text-blue-800 p-1 rounded-md flex items-center">
                      <ImageIcon className="w-4 h-4 text-current" />
                    </span>
                  )}
                  {model.pro && (
                    <span className="bg-orange-100 text-orange-800 p-1 rounded-md flex items-center">
                      <GemIcon className="w-4 h-4 text-current" />
                    </span>
                  )}
                  {model.local && (
                    <span className="bg-yellow-100 text-yellow-800 p-1 rounded-md flex items-center">
                      <MonitorDownIcon className="w-4 h-4 text-current" />
                    </span>
                  )}
                </PromptInputModelSelectItem>
              ))}
            </PromptInputModelSelectContent>
          </PromptInputModelSelect>
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
