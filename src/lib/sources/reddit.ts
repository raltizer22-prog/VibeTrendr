import type { Signal } from "../types";

export async function fetchRedditSignals(): Promise<Signal[]> {
  // TODO: call Reddit API or RSS feeds here.
  // Keep this module the single place that knows Reddit-shaped data.
  return [
    {
      category: "AI tooling",
      title: "Agent memory overlays are getting hot",
      description:
        "Builders keep asking for persistent context across sessions without hand-holding every prompt.",
      velocity: "High",
      horizon: "Now",
      source: "Reddit",
      score: 92,
      updatedAt: "2m ago",
    },
  ];
}
