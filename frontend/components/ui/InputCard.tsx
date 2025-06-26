"use client";

import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools,
} from "./KuboInput";
import { GlobeIcon, MicIcon, PlusIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface InputCardProps {
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
  handleGenerate: () => void;
  status: "submitted" | "streaming" | "ready" | "error";
  disabled: boolean;
}

export default function InputCard({
  prompt,
  setPrompt,
  handleGenerate,
  status,
  disabled,
}: InputCardProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleGenerate();
  };

  return (
    <AIInput
      className="border border-neutral-700 text-neutral-400 overflow-y-auto"
      onSubmit={handleSubmit}
    >
      <AIInputTextarea
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      />
      <AIInputToolbar>
        <AIInputTools>
          <AIInputButton className="cursor-pointer dark:hover:bg-neutral-800 hover:bg-neutral-200">
            <PlusIcon size={16} />
          </AIInputButton>
          <AIInputButton className="cursor-pointer dark:hover:bg-neutral-800 hover:bg-neutral-200">
            <MicIcon size={16} />
          </AIInputButton>
          <AIInputButton className="cursor-pointer dark:hover:bg-neutral-800 hover:bg-neutral-200">
            <GlobeIcon size={16} />
            <span>Search</span>
          </AIInputButton>
        </AIInputTools>
        <AIInputSubmit
          onClick={handleGenerate}
          className="cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-800"
          disabled={disabled || !prompt.trim()}
          status={status}
        />
      </AIInputToolbar>
    </AIInput>
  );
}
