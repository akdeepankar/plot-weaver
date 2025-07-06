/**
 * @file tambo.ts
 * @description Central configuration file for Tambo components and tools
 *
 * This file serves as the central place to register your Tambo components and tools.
 * It exports arrays that will be used by the TamboProvider.
 *
 * Read more about Tambo at https://tambo.co/docs
 */

import Firecrawl, { firecrawlSchema } from "@/components/firecrawl";
import { DataCard, dataCardSchema } from "@/components/ui/card-data";
import { FormComponent, formSchema } from "@/components/ui/form";
import { Graph, graphSchema } from "@/components/ui/graph";
import type { TamboComponent } from "@tambo-ai/react";
import { TamboTool } from "@tambo-ai/react";

import Tavily, { tavilySchema } from "@/components/tavily";
import Podcast, { podcastSchema } from "@/components/podcast";
import MyWords, { myWordsSchema } from '@/components/ui/my-words';

/**
 * tools
 *
 * This array contains all the Tambo tools that are registered for use within the application.
 * Each tool is defined with its name, description, and expected props. The tools
 * can be controlled by AI to dynamically fetch data based on user interactions.
 */

export const tools: TamboTool[] = [
  // Set the MCP tools https://localhost:3000/mcp-config
  // Add non MCP tools here
];

/**
 * components
 *
 * This array contains all the Tambo components that are registered for use within the application.
 * Each component is defined with its name, description, and expected props. The components
 * can be controlled by AI to dynamically render UI elements based on user interactions.
 */
export const components: TamboComponent[] = [
  {
    name: "Graph",
    description:
      "Use this when you want to display a chart. It supports bar, line, and pie charts. When you see data generally use this component.",
    component: Graph,
    propsSchema: graphSchema,
  },
  {
    name: "DataCards",
    description:
      "Use this when you want to display a list of information (>2 elements) that user might want to select from. Not anything that is a list or has links. ",
    component: DataCard,
    propsSchema: dataCardSchema,
  },
  {
    name: "Form",
    description:
      "Use this when you want to display a form. It supports text, number, select, textarea, radio, checkbox, slider, and yes-no fields. When you see a form use this component.",
    component: FormComponent,
    propsSchema: formSchema,
  },
  {
    name: "firecrawl",
    description:
      "A form to enter a url and scrape a website using firecrawl and return the results",
    component: Firecrawl,
    propsSchema: firecrawlSchema,
  },
  {
    name: "tavily",
    description:
      "A form to enter a url and extract content from a website using Tavily and return FLASHCARDS.",
    component: Tavily,
    propsSchema: tavilySchema,
  },
  {
    name: "podcast",
    description:
      "A form to enter a url and generate a Audiobooks using OpenAI and ElevenLabs.",
    component: Podcast,
    propsSchema: podcastSchema,
  },
  {
    name: "MyWords",
    description: "Displays a list of words the user has looked up, along with their meanings, language, and date. Allows deleting entries.",
    component: MyWords,
    propsSchema: myWordsSchema,
  },
  // Add more components here
];
