"use client";

import { useState } from "react";

export interface PodcastResponse {
  script: string;
  audioUrl: string;
}

export default function PodcastForm({
  onGenerate,
}: {
  onGenerate: (data: PodcastResponse) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [voiceId, setVoiceId] = useState("Xb7hH8MSUJpSbSDYk0k2"); // Default to Alice

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/podcast", {
        method: "POST",
        body: JSON.stringify({ url, voiceId }),
      });
      const data = await response.json();
      if (response.ok && data.script && data.audioUrl) {
        onGenerate(data);
      } else {
        window.alert(
          `Audiobook generation failed:\n\n${data?.error?.message || "No script or audio returned or unknown error"}`
        );
      }
    } catch (err) {
      window.alert("Audiobook generation failed: Network error");
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <input
          type="text"
          placeholder="Source URL"
          required
          className="border border-gray-300 rounded-md p-2 flex-1"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading}
        />
        <select
          className="border border-gray-300 rounded-md p-2"
          value={voiceId}
          onChange={(e) => setVoiceId(e.target.value)}
          disabled={isLoading}
        >
          <option value="Xb7hH8MSUJpSbSDYk0k2">Alice</option>
          <option value="4cfxIUtpykx5W1T4ApyL">Mona</option>
          <option value="56AoDkrOh6qfVPDXZ7Pt">Cassidy</option>
        </select>
      </div>
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className={`$${isLoading ? "cursor-progress opacity-50" : ""} bg-primary text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary/80 transition-colors w-full md:w-auto`}
        >
          {isLoading ? <span>Generating...</span> : <span>Generate Audiobook</span>}
        </button>
      </div>
    </form>
  );
} 