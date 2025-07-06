"use client";
import { useEffect, useState } from "react";

interface WordMeaning {
  word: string;
  meaning: string;
  language: string;
  timestamp: number;
}

function MyWords() {
  const [words, setWords] = useState<WordMeaning[]>([]);
  const [expandedWords, setExpandedWords] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window !== "undefined") {
      const data = localStorage.getItem("wordMeanings");
      if (data) {
        setWords(JSON.parse(data));
      }
    }
  }, []);

  const handleDelete = (index: number) => {
    const updated = [...words];
    updated.splice(index, 1);
    setWords(updated);
    localStorage.setItem("wordMeanings", JSON.stringify(updated));
  };

  const toggleExpanded = (wordKey: string) => {
    setExpandedWords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(wordKey)) {
        newSet.delete(wordKey);
      } else {
        newSet.add(wordKey);
      }
      return newSet;
    });
  };

  if (words.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-center">No saved words yet.</div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold mb-4 text-blue-700">My Words</h2>
      <div className="space-y-3">
        {words.map((entry, idx) => {
          const wordKey = `${entry.word}-${entry.language}-${entry.timestamp}`;
          const isExpanded = expandedWords.has(wordKey);
          
          return (
            <div
              key={wordKey}
              className="bg-white border border-gray-200 rounded-lg shadow-sm p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="font-semibold text-lg text-blue-800">{entry.word}</div>
                  <div className="text-xs text-gray-400">
                    {entry.language.toUpperCase()} &middot; {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleExpanded(wordKey)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs font-medium"
                  >
                    {isExpanded ? "Hide" : "Show"} Meaning
                  </button>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-gray-700 text-sm">{entry.meaning}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const myWordsSchema = {
  type: "object" as const,
  properties: {},
  required: [],
};

export default MyWords; 