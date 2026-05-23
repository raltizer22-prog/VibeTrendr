import type { Signal } from "../types";

type GitHubRepo = {
  name?: string;
  full_name?: string;
  description?: string | null;
  html_url?: string;
  language?: string | null;
  stargazers_count?: number;
  forks_count?: number;
  open_issues_count?: number;
  pushed_at?: string | null;
  created_at?: string | null;
};

type GitHubSearchResponse = {
  items?: GitHubRepo[];
};

type GitHubSearchConfig = {
  query: string;
  category: string;
  velocity: string;
  horizon: string;
};

const GITHUB_SEARCHES: GitHubSearchConfig[] = [
  {
    query: '"ai agent" in:name,description,readme stars:>500',
    category: "AI tooling",
    velocity: "Hot",
    horizon: "Now",
  },
  {
    query: '"local first" in:name,description,readme stars:>100',
    category: "Developer tools",
    velocity: "Rising",
    horizon: "This week",
  },
  {
    query: '"open source" in:name,description,readme stars:>250',
    category: "Open source software",
    velocity: "Rising",
    horizon: "This week",
  },
];

const FALLBACK_SIGNALS: Signal[] = [
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
  {
    category: "AI tooling",
    title: "Small agent frameworks are pulling developer attention",
    description:
      "Repo activity keeps clustering around compact, composable agent stacks rather than giant monoliths.",
    velocity: "Rising",
    horizon: "This week",
    source: "GitHub",
    score: 82,
    updatedAt: "1h ago",
  },
];

export async function fetchGitHubSignals(): Promise<Signal[]> {
  const liveSignals = await fetchLiveGitHubSignals();
  return liveSignals.length > 0 ? liveSignals : FALLBACK_SIGNALS;
}

async function fetchLiveGitHubSignals(): Promise<Signal[]> {
  try {
    const results = await Promise.all(
      GITHUB_SEARCHES.map(async (search) => {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${encodeURIComponent(search.query)}&sort=stars&order=desc&per_page=3`,
          {
            headers: {
              accept: "application/vnd.github+json",
              "user-agent": "VibeTrendr/0.1 (+https://github.com/)",
              "x-github-api-version": "2022-11-28",
            },
            cache: "no-store",
          },
        );

        if (!response.ok) {
          return [] as Signal[];
        }

        const payload = (await response.json()) as GitHubSearchResponse;
        return (payload.items ?? [])
          .filter((repo): repo is GitHubRepo => Boolean(repo?.name))
          .slice(0, 3)
          .map((repo) => toSignal(repo, search));
      }),
    );

    return dedupeSignals(results.flat());
  } catch {
    return [];
  }
}

function toSignal(repo: GitHubRepo, search: GitHubSearchConfig): Signal {
  const stars = repo.stargazers_count ?? 0;
  const forks = repo.forks_count ?? 0;
  const issues = repo.open_issues_count ?? 0;
  const score = Math.max(1, Math.min(100, Math.round(stars / 120 + forks / 40 + issues / 25)));

  return {
    category: search.category,
    title: repo.full_name?.trim() || repo.name?.trim() || "Untitled repository",
    description: buildDescription(repo),
    velocity: search.velocity,
    horizon: search.horizon,
    source: "GitHub",
    score,
    updatedAt: formatAge(repo.pushed_at ?? repo.created_at),
    sourceUrl: repo.html_url,
  };
}

function buildDescription(repo: GitHubRepo): string {
  const language = repo.language ? `${repo.language} repo` : "Repository";
  const stars = typeof repo.stargazers_count === "number" ? `${repo.stargazers_count} stars` : "gaining traction";
  const forks = typeof repo.forks_count === "number" ? `${repo.forks_count} forks` : "active forks";
  const description = cleanSnippet(repo.description);

  if (description) {
    return `${language}: ${description}`;
  }

  return `${language} with ${stars} and ${forks}.`;
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
