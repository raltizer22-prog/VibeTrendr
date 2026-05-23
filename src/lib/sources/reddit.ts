import type { Signal } from "../types";

type RedditPost = {
  title?: string;
  selftext?: string;
  subreddit?: string;
  ups?: number;
  score?: number;
  num_comments?: number;
  created_utc?: number;
  permalink?: string;
  over_18?: boolean;
  stickied?: boolean;
};

type RedditListing = {
  data?: {
    children?: Array<{
      data?: RedditPost;
    }>;
  };
};

type RedditSourceConfig = {
  subreddit: string;
  category: string;
  velocity: string;
  horizon: string;
};

const REDDIT_SOURCES: RedditSourceConfig[] = [
  {
    subreddit: "MachineLearning",
    category: "AI tooling",
    velocity: "Hot",
    horizon: "Now",
  },
  {
    subreddit: "LocalLLaMA",
    category: "Open source AI",
    velocity: "Rising",
    horizon: "This week",
  },
  {
    subreddit: "indiehackers",
    category: "Startup building",
    velocity: "Rising",
    horizon: "This week",
  },
];

const FALLBACK_SIGNALS: Signal[] = [
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

export async function fetchRedditSignals(): Promise<Signal[]> {
  const liveSignals = await fetchLiveRedditSignals();
  return liveSignals.length > 0 ? liveSignals : FALLBACK_SIGNALS;
}

async function fetchLiveRedditSignals(): Promise<Signal[]> {
  try {
    const results = await Promise.all(
      REDDIT_SOURCES.map(async (source) => {
        const response = await fetch(
          `https://www.reddit.com/r/${encodeURIComponent(source.subreddit)}/hot.json?limit=5`,
          {
            headers: {
              "user-agent": "VibeTrendr/0.1 (+https://github.com/)",
              accept: "application/json",
            },
            cache: "no-store",
          },
        );

        if (!response.ok) {
          return [] as Signal[];
        }

        const payload = (await response.json()) as RedditListing;
        const children = payload.data?.children ?? [];
        return children
          .map((child) => child.data)
          .filter((post): post is RedditPost => Boolean(post?.title))
          .filter((post) => !post.stickied)
          .slice(0, 3)
          .map((post) => toSignal(post, source));
      }),
    );

    return dedupeSignals(results.flat());
  } catch {
    return [];
  }
}

function toSignal(post: RedditPost, source: RedditSourceConfig): Signal {
  const score = Math.max(
    1,
    Math.min(
      100,
      Math.round((post.score ?? post.ups ?? 0) + (post.num_comments ?? 0) / 4),
    ),
  );

  return {
    category: source.category,
    title: post.title?.trim() || "Untitled Reddit discussion",
    description: buildDescription(post),
    velocity: source.velocity,
    horizon: source.horizon,
    source: "Reddit",
    score,
    updatedAt: formatAge(post.created_utc),
    sourceUrl: post.permalink ? `https://www.reddit.com${post.permalink}` : undefined,
  };
}

function buildDescription(post: RedditPost): string {
  const subreddit = post.subreddit ? `r/${post.subreddit}` : "Reddit";
  const commentText =
    typeof post.num_comments === "number"
      ? `${post.num_comments} comment${post.num_comments === 1 ? "" : "s"}`
      : "recent discussion";
  const snippet = cleanSnippet(post.selftext);

  if (snippet) {
    return `${subreddit}: ${snippet}`;
  }

  return `${subreddit} has ${commentText} around this post.`;
}

function cleanSnippet(text?: string): string {
  const normalized = (text ?? "").replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "";
  }

  return normalized.length > 140 ? `${normalized.slice(0, 137)}...` : normalized;
}

function formatAge(createdUtc?: number): string {
  if (!createdUtc || Number.isNaN(createdUtc)) {
    return "Recently";
  }

  const ageMs = Date.now() - createdUtc * 1000;
  if (ageMs <= 0) {
    return "Just now";
  }

  const minutes = Math.floor(ageMs / 60000);
  if (minutes < 60) {
    return `${Math.max(1, minutes)}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function dedupeSignals(signals: Signal[]): Signal[] {
  const seen = new Set<string>();

  return signals.filter((signal) => {
    const key = `${signal.title.toLowerCase()}|${signal.category.toLowerCase()}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
