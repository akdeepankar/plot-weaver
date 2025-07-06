"use client";
import type { TavilyExtractResponse } from "./form";
import React, { useState } from "react";

function parseFlashcards(flashcards: any): Array<{ front: string; back: string }> {
  if (Array.isArray(flashcards)) {
    // If it's a single wrapper card, extract from its back
    if (
      flashcards.length === 1 &&
      flashcards[0].front &&
      flashcards[0].front.toLowerCase().includes("flashcards") &&
      typeof flashcards[0].back === "string"
    ) {
      // Try to extract JSON array from the back property
      const match = flashcards[0].back.match(/```json([\s\S]*?)```/);
      let jsonString = match ? match[1] : flashcards[0].back;
      try {
        const parsed = JSON.parse(jsonString);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        const arrMatch = jsonString.match(/\[[\s\S]*\]/);
        if (arrMatch) {
          try {
            const parsed = JSON.parse(arrMatch[0]);
            if (Array.isArray(parsed)) return parsed;
          } catch {}
        }
      }
    }
    return flashcards;
  }
  if (typeof flashcards === "string") {
    // Try to extract JSON from the string (e.g., if it's in a markdown code block)
    const match = flashcards.match(/```json([\s\S]*?)```/);
    let jsonString = match ? match[1] : flashcards;
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fallback: try to find the first JSON array in the string
      const arrMatch = jsonString.match(/\[[\s\S]*\]/);
      if (arrMatch) {
        try {
          const parsed = JSON.parse(arrMatch[0]);
          if (Array.isArray(parsed)) return parsed;
        } catch {}
      }
    }
  }
  return [];
}

export default function TavilyResult({
  result,
  onDismiss,
  colorful = true,
}: {
  result: TavilyExtractResponse & { flashcards?: Array<{ front: string; back: string }> | string };
  onDismiss: () => void;
  colorful?: boolean;
}) {
  const flashcardsArr = parseFlashcards(result.flashcards);
  const [flipped, setFlipped] = useState<number | null>(null);

  const cardColors = colorful
    ? [
        "bg-gradient-to-br from-pink-100 to-pink-300",
        "bg-gradient-to-br from-blue-100 to-blue-300",
        "bg-gradient-to-br from-green-100 to-green-300",
        "bg-gradient-to-br from-yellow-100 to-yellow-300",
        "bg-gradient-to-br from-purple-100 to-purple-300",
        "bg-gradient-to-br from-orange-100 to-orange-300",
        "bg-gradient-to-br from-teal-100 to-teal-300",
      ]
    : ["bg-gray-100"];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <button
          className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 hover:text-gray-700 cursor-pointer"
          onClick={onDismiss}
        >
          &larr; Extract again
        </button>
      </div>
      <div className="text-sm bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col gap-2 h-[300px] overflow-y-auto">
        {flashcardsArr.length > 0 ? (
          <div className="mt-4">
            <span className="font-bold">Flashcards:</span>
            <div className="flex gap-6 mt-2 overflow-x-auto pb-2" style={{ WebkitOverflowScrolling: "touch" }}>
              {flashcardsArr.map((fc, idx) => {
                const color = cardColors[idx % cardColors.length];
                return (
                  <div
                    key={idx}
                    className={`w-64 h-40 perspective cursor-pointer flex-shrink-0`}
                    onClick={() => setFlipped(flipped === idx ? null : idx)}
                  >
                    <div
                      className={`relative w-full h-full transition-transform duration-500 transform ${flipped === idx ? "rotate-y-180" : ""}`}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div
                        className={`absolute w-full h-full flex items-center justify-center text-center ${color} text-gray-900 border rounded-xl shadow-lg p-4 backface-hidden select-none text-base font-medium`}
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        {fc.front}
                      </div>
                      <div
                        className={`absolute w-full h-full flex items-center justify-center text-center bg-white text-gray-900 border rounded-xl shadow-lg p-4 backface-hidden select-none text-base font-medium`}
                        style={{
                          transform: "rotateY(180deg)",
                          backfaceVisibility: "hidden",
                        }}
                      >
                        {fc.back}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="italic text-muted-foreground">No flashcards found.</div>
        )}
      </div>
    </div>
  );
} 