"use client";

import { Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRef, useState } from "react";
import Link from "next/link";

export const PromptInput = () => {
  const [prompt, setPrompt] = useState<string>('');
  const generateButtonRef = useRef<HTMLButtonElement>(null);
  const promptInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex justify-center items-center gap-3 w-4/5">
      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your Imagination here..."
        className="flex-grow placeholder:font-semibold"
        ref={promptInputRef}
      />
      <Link href={`/workspace?prompt=${prompt}`}>
        <Button
          className="flex justify-between items-center gap-1"
          ref={generateButtonRef}
        >
          <Sparkles/>
          <span>Generate</span>
        </Button>
      </Link>
    </div>
  )
};