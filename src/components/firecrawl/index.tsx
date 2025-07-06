"use client";

import { useState } from "react";
import Section from "@/components/common/section";
import FirecrawlForm from "./form";
import FirecrawlResult from "./result";
import type { ScrapeResponse } from "@mendable/firecrawl-js";
import { z } from "zod";

export const firecrawlSchema = z.object({});

export default function Firecrawl() {
  const [scrapeResult, setScrapeResult] = useState<ScrapeResponse | null>(null);

  return (
    <Section title={<span data-lingo-skip>Firecrawl</span>}>
      {scrapeResult ? (
        <FirecrawlResult
          result={scrapeResult}
          onDismiss={() => setScrapeResult(null)}
        />
      ) : (
        <FirecrawlForm onScrape={setScrapeResult} />
      )}
    </Section>
  );
}