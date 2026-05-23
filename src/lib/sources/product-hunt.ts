import type { Signal } from "../types";

type ProductHuntPost = {
  name?: string;
  tagline?: string | null;
  description?: string | null;
  votesCount?: number;
  commentsCount?: number;
  featuredAt?: string | null;
  createdAt?: string | null;
  url?: string | null;
  topics?: {
    edges?: Array<{
      node?: {
        name?: string | null;
      } | null;
    }>;
  };
};

type ProductHuntResponse = {
  data?: {
    posts?: {
      edges?: Array<{
        node?: ProductHuntPost | null;
      }>;
    };
  };
  errors?: Array<{
    message?: string;
  }>;
};

type ProductHuntSearchConfig = {
  category: string;
  velocity: string;
  horizon: string;
  topic: string;
};

const PRODUCT_HUNT_SEARCHES: ProductHuntSearchConfig[] = [
  {
    category: "Creator economy",
    velocity: "Rising",
    horizon: "This week",
    topic: "creator economy",
  },
  {
    category: "AI products",
    velocity: "Hot",
    horizon: "Now",
    topic: "artificial intelligence",
  },
  {
    category: "Developer tools",
    velocity: "Rising",
    horizon: "This week",
    topic: "developer tools",
  },
];

const FALLBACK_SIGNALS: Signal[] = [
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
  {
    category: "AI products",
    title: "Focused AI apps are beating broad platform pitches",
    description:
      "Founders are seeing better response when they solve one obvious job instead of everything at once.",
    velocity: "Hot",
    horizon: "Now",
    source: "Product Hunt",
    score: 81,
    updatedAt: "28m ago",
  },
];

const PRODUCT_HUNT_ENDPOINT = "https://api.producthunt.com/v2/api/graphql";

export async function fetchProductHuntSignals(): Promise<Signal[]> {
  const liveSignals = await fetchLiveProductHuntSignals();
  return liveSignals.length > 0 ? liveSignals : FALLBACK_SIGNALS;
}

async function fetchLiveProductHuntSignals(): Promise<Signal[]> {
  const token = getProductHuntToken();
  if (!token) {
    return [];
  }

  try {
    const results = await Promise.all(
      PRODUCT_HUNT_SEARCHES.map(async (search) => {
        const response = await fetch(PRODUCT_HUNT_ENDPOINT, {
          method: "POST",
          headers: {
            authorization: `Bearer ${token}`,
            "content-type": "application/json",
            accept: "application/json",
            "user-agent": "VibeTrendr/0.1 (+https://github.com/)",
          },
          cache: "no-store",
          body: JSON.stringify({
            query: `
              query ProductHuntSignals($topic: String!, $first: Int!) {
                posts(first: $first, order: RANKING, topic: $topic) {
                  edges {
                    node {
                      name
                      tagline
                      description
                      votesCount
                      commentsCount
                      featuredAt
                      createdAt
                      url
                      topics {
                        edges {
                          node {
                            name
                          }
                        }
                      }
                    }
                  }
                }
              }
            `,
            variables: {
              topic: search.topic,
              first: 3,
            },
          }),
        });

        if (!response.ok) {
          return [] as Signal[];
        }

        const payload = (await response.json()) as ProductHuntResponse;
        if (payload.errors?.length) {
          return [] as Signal[];
        }

        const edges = payload.data?.posts?.edges ?? [];
        return edges
          .map((edge) => edge.node)
          .filter((post): post is ProductHuntPost => Boolean(post?.name))
          .slice(0, 3)
          .map((post) => toSignal(post, search));
      }),
    );

    return dedupeSignals(results.flat());
  } catch {
    return [];
  }
}

function toSignal(post: ProductHuntPost, search: ProductHuntSearchConfig): Signal {
  const votes = post.votesCount ?? 0;
  const comments = post.commentsCount ?? 0;
  const score = Math.max(1, Math.min(100, Math.round(votes + comments / 5)));

  return {
    category: search.category,
    title: post.name?.trim() || "Untitled Product Hunt launch",
    description: buildDescription(post),
    velocity: search.velocity,
    horizon: search.horizon,
    source: "Product Hunt",
    score,
    updatedAt: formatAge(post.featuredAt ?? post.createdAt),
    sourceUrl: post.url ?? undefined,
  };
}

function buildDescription(post: ProductHuntPost): string {
  const topic = firstTopic(post);
  const launchText =
    typeof post.votesCount === "number"
      ? `${post.votesCount} upvotes`
      : "gathering momentum";
  const commentsText =
    typeof post.commentsCount === "number"
      ? `${post.commentsCount} comment${post.commentsCount === 1 ? "" : "s"}`
      : "community discussion";
  const description = cleanSnippet(post.tagline ?? post.description);

  if (description) {
    return topic ? `${topic}: ${description}` : description;
  }

  return topic
    ? `${topic} with ${launchText} and ${commentsText}.`
    : `Launch with ${launchText} and ${commentsText}.`;
}

function firstTopic(post: ProductHuntPost): string {
  const topic = post.topics?.edges?.map((edge) => edge.node?.name?.trim()).find(Boolean);
  return topic || "";
}

function cleanSnippet(text?: string | null): string {
  const normalized = (text ?? "").replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "";
  }

  return normalized.length > 140 ? `${normalized.slice(0, 137)}...` : normalized;
}

function formatAge(timestamp?: string | null): string {
  if (!timestamp) {
    return "Recently";
  }

  const parsed = Date.parse(timestamp);
  if (Number.isNaN(parsed)) {
    return "Recently";
  }

  const ageMs = Date.now() - parsed;
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

function getProductHuntToken(): string | undefined {
  return process.env.PRODUCT_HUNT_TOKEN ?? process.env.PRODUCTHUNT_TOKEN;
}
