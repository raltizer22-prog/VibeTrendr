import type { Signal } from "./types";
import { revalidateTag, unstable_cache } from "next/cache";
import { fetchGitHubSignals } from "./sources/github";
import { fetchProductHuntSignals } from "./sources/product-hunt";
import { fetchRedditSignals } from "./sources/reddit";

const SOURCE_WEIGHTS: Record<string, number> = {
  Reddit: 1.08,
  GitHub: 1.06,
  "Product Hunt": 1.04,
};
const SIGNALS_CACHE_TAG = "vibetrendr-signals";
const SIGNALS_CACHE_TTL_SECONDS = 300;

export type CachedSignals = {
  signals: Signal[];
  refreshedAt: string;
};

export async function getSignals(): Promise<CachedSignals> {
  return getCachedSignals();
}

export async function refreshSignals(): Promise<CachedSignals> {
  revalidateTag(SIGNALS_CACHE_TAG);
  return getLiveSignals();
}

export function rankSignals(signals: Signal[]): Signal[] {
  return [...signals].sort((a, b) => {
    const aScore = computeRankScore(a);
    const bScore = computeRankScore(b);

    if (bScore !== aScore) {
      return bScore - aScore;
    }

    if (b.score !== a.score) {
      return b.score - a.score;
    }

    const aWeight = SOURCE_WEIGHTS[a.source] ?? 1;
    const bWeight = SOURCE_WEIGHTS[b.source] ?? 1;
    if (bWeight !== aWeight) {
      return bWeight - aWeight;
    }

    if (a.updatedAt !== b.updatedAt) {
      return a.updatedAt.localeCompare(b.updatedAt);
    }

    return a.title.localeCompare(b.title);
  });
}

function computeRankScore(signal: Signal): number {
  const sourceWeight = SOURCE_WEIGHTS[signal.source] ?? 1;
  return signal.score * sourceWeight + getRecencyWeight(signal.updatedAt);
}

async function getLiveSignals(): Promise<CachedSignals> {
  const [redditSignals, productHuntSignals, githubSignals] = await Promise.all([
    fetchRedditSignals(),
    fetchProductHuntSignals(),
    fetchGitHubSignals(),
  ]);

  return {
    signals: rankSignals([...redditSignals, ...productHuntSignals, ...githubSignals]),
    refreshedAt: new Date().toISOString(),
  };
}

const getCachedSignals = unstable_cache(getLiveSignals, [SIGNALS_CACHE_TAG], {
  revalidate: SIGNALS_CACHE_TTL_SECONDS,
  tags: [SIGNALS_CACHE_TAG],
});

function getRecencyWeight(updatedAt: string): number {
  const minutes = parseRelativeMinutes(updatedAt);
  if (minutes === null) {
    return 0;
  }

  if (minutes <= 5) {
    return 4.5;
  }

  if (minutes <= 15) {
    return 3.5;
  }

  if (minutes <= 60) {
    return 2.5;
  }

  if (minutes <= 240) {
    return 1.5;
  }

  if (minutes <= 1440) {
    return 0.75;
  }

  return 0.25;
}

function parseRelativeMinutes(value: string): number | null {
  const normalized = value.trim().toLowerCase();

  if (normalized === "just now" || normalized === "recently") {
    return 0;
  }

  const match = normalized.match(/^(\d+)(m|h|d) ago$/);
  if (!match) {
    return null;
  }

  const amount = Number(match[1]);
  if (!Number.isFinite(amount)) {
    return null;
  }

  switch (match[2]) {
    case "m":
      return amount;
    case "h":
      return amount * 60;
    case "d":
      return amount * 1440;
    default:
      return null;
  }
}

export const stats = [
  { label: "Trending now", value: "42" },
  { label: "Ideas queued", value: "18" },
  { label: "High-confidence signals", value: "9" },
];
