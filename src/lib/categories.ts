// Category metadata and power consumption estimates
// Sources: Estimates based on published datacenter power data and AI workload analyses
// These are per-user-minute average server-side power consumption estimates

import type { CategoryInfo, AICategory } from "./types";

export const AI_CATEGORIES: Record<AICategory, CategoryInfo> = {
  chatbots: {
    id: "chatbots",
    label: "AI Chatbots",
    icon: "MessageSquare",
    description: "ChatGPT, Claude, Gemini, and similar conversational AI tools",
    avgWattsPerMinute: 0.05, // ~3W per query, ~1 query/min average
  },
  ai_search: {
    id: "ai_search",
    label: "AI Search",
    icon: "Search",
    description: "AI powered search engines like Perplexity, Google AI Overview, Bing Copilot",
    avgWattsPerMinute: 0.04, // Slightly lower than chat, shorter interactions
  },
  ai_image_gen: {
    id: "ai_image_gen",
    label: "Image Generation",
    icon: "Image",
    description: "DALL·E, Midjourney, Stable Diffusion, and other image generators",
    avgWattsPerMinute: 0.12, // GPU intensive, but infrequent generation
  },
  ai_video_gen: {
    id: "ai_video_gen",
    label: "Video Generation",
    icon: "Video",
    description: "Sora, Runway, Pika, and other AI video tools",
    avgWattsPerMinute: 0.25, // Very GPU intensive
  },
  ai_writing: {
    id: "ai_writing",
    label: "AI Writing Assistants",
    icon: "PenTool",
    description: "Grammarly AI, Jasper, Notion AI, and other writing tools",
    avgWattsPerMinute: 0.03, // Lighter workloads, incremental suggestions
  },
};

export const CATEGORY_ORDER: AICategory[] = [
  "chatbots",
  "ai_search",
  "ai_image_gen",
  "ai_video_gen",
  "ai_writing",
];

export const CATEGORY_COLORS: Record<AICategory, string> = {
  chatbots: "hsl(152, 68%, 40%)",
  ai_search: "hsl(217, 80%, 56%)",
  ai_image_gen: "hsl(262, 68%, 56%)",
  ai_video_gen: "hsl(350, 72%, 56%)",
  ai_writing: "hsl(38, 92%, 56%)",
};
