"use client";

import { useState } from "react";
import TavilyForm, { TavilyExtractResponse } from "./form";
import TavilyResult from "./result";
import { z } from "zod";

export const tavilySchema = z.object({});

export default function Tavily() {
  const [extractResult, setExtractResult] = useState<TavilyExtractResponse | null>(null);
  const [colorful, setColorful] = useState(true);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={colorful}
            onChange={() => setColorful((c) => !c)}
            className="accent-primary"
          />
          <span className="text-sm">Colorful flashcards</span>
        </label>
      </div>
      {extractResult ? (
        <TavilyResult result={extractResult} onDismiss={() => setExtractResult(null)} colorful={colorful} />
      ) : (
        <TavilyForm onExtract={setExtractResult} />
      )}
    </div>
  );
} 