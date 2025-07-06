"use client";
import type { PodcastResponse } from "./form";

export default function PodcastResult({
  result,
  onDismiss,
}: {
  result: PodcastResponse;
  onDismiss: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <button
          className="text-sm text-gray-500 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 hover:text-gray-700 cursor-pointer"
          onClick={onDismiss}
        >
          &larr; Generate again
        </button>
      </div>
      <div className="text-sm bg-gray-50 rounded-lg p-4 border border-gray-200 flex flex-col gap-4">
        <div>
          <span className="font-bold">Audiobook Script:</span>
          <div className="whitespace-pre-wrap break-words mt-1">{result.script}</div>
        </div>
        <div>
          <span className="font-bold">Audiobook Audio:</span>
          <audio controls src={result.audioUrl} className="w-full mt-2">
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </div>
  );
} 