"use client";

import { useState } from "react";
import PodcastForm, { PodcastResponse } from "./form";
import PodcastResult from "./result";
import { z } from "zod";

export const podcastSchema = z.object({});

export default function Podcast() {
  const [podcastResult, setPodcastResult] = useState<PodcastResponse | null>(null);

  return (
    <div>
      {podcastResult ? (
        <PodcastResult result={podcastResult} onDismiss={() => setPodcastResult(null)} />
      ) : (
        <PodcastForm onGenerate={setPodcastResult} />
      )}
    </div>
  );
} 