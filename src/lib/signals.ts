import type { Signal } from "./types";
import { fetchGitHubSignals } from "./sources/github";
import { fetchProductHuntSignals } from "./sources/product-hunt";
import { fetchRedditSignals } from "./sources/reddit";

export async function getSignals(): Promise<Signal[]> {
  const [redditSignals, productHuntSignals, githubSignals] = await Promise.all([
    fetchRedditSignals(),
    fetchProductHuntSignals(),
    fetchGitHubSignals(),
  ]);

  return [...redditSignals, ...productHuntSignals, ...githubSignals].sort(
    (a, b) => b.score - a.score,
  );
}

export const stats = [
  { label: "Trending now", value: "42" },
  { label: "Ideas queued", value: "18" },
  { label: "High-confidence signals", value: "9" },
];
