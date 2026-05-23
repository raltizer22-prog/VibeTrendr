import type { Signal } from "../types";

export async function fetchGitHubSignals(): Promise<Signal[]> {
  // TODO: call GitHub search / trending / repo event data here.
  // This keeps trend logic separate from rendering.
  return [
    {
      category: "Developer tools",
      title: "Local-first workflows are back",
      description:
        "People want faster iteration loops, less cloud nonsense, and more offline control.",
      velocity: "Hot",
      horizon: "Right now",
      source: "GitHub",
      score: 88,
      updatedAt: "15m ago",
    },
  ];
}
