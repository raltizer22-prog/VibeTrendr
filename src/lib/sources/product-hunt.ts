import type { Signal } from "../types";

export async function fetchProductHuntSignals(): Promise<Signal[]> {
  // TODO: call Product Hunt API here.
  // Keep the API shape isolated so the UI never depends on vendor payloads.
  return [
    {
      category: "Creator economy",
      title: "Tiny launch products are outperforming bloated suites",
      description:
        "Small, opinionated tools are winning because they ship faster and feel easier to buy.",
      velocity: "Rising",
      horizon: "This week",
      source: "Product Hunt",
      score: 84,
      updatedAt: "8m ago",
    },
  ];
}
