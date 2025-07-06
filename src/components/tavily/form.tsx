"use client";

import { useState } from "react";

export interface TavilyExtractResponse {
  content: string;
  metadata?: Record<string, any>;
}

export default function TavilyForm({
  onExtract,
}: {
  onExtract: (data: TavilyExtractResponse) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("https://en.wikipedia.org/wiki/Golden_Gate_Bridge");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/tavily", {
        method: "POST",
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      console.log("Tavily API response:", data);
      if (response.ok) {
        onExtract(data);
      } else {
        window.alert(
          `Extraction failed:\n\n${data?.error?.message || "No content returned or unknown error"}`
        );
      }
    } catch (err) {
      window.alert("Extraction failed: Network error");
    }
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row gap-4 w-full"
    >
      <input
        type="text"
        placeholder="URL"
        required
        className="border border-gray-300 rounded-md p-2 flex-1"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading}
        className={`$${isLoading ? "cursor-progress opacity-50" : ""} bg-primary text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary/80 transition-colors`}
      >
        {isLoading ? <span>Flashing...</span> : <span>Flash</span>}
      </button>
    </form>
  );
} 