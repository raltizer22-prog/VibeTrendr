export type IdeaSeed = {
  title: string;
  description: string;
  category: string;
  source: string;
  score: number;
  velocity: string;
  horizon: string;
  relatedCount: number;
  freshnessCue: string | null;
};

export type GeneratedIdea = {
  name: string;
  pitch: string;
  targetUser: string;
  whyNow: string;
  mvp: string[];
  stack: string;
  launchAngle: string;
};

type Theme = {
  label: string;
  noun: string;
  stack: string;
  targetUser: string;
  launchAngle: string;
  mvp: [string, string, string];
};

const DEFAULT_THEME: Theme = {
  label: "trend",
  noun: "Signal",
  stack: "Next.js, Supabase, Vercel",
  targetUser: "solo builders",
  launchAngle: "Launch with a clean before/after demo and a single sharp use case.",
  mvp: [
    "Trend feed with freshness scoring",
    "One-click idea generation",
    "Saved idea queue for later",
  ],
};

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function toTitleCase(value: string) {
  return value
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function pickTheme(seed: IdeaSeed): Theme {
  const source = normalize(seed.source);
  const category = normalize(seed.category);
  const text = normalize(`${seed.title} ${seed.description}`);

  if (source.includes("product hunt") || text.includes("launch")) {
    return {
      label: "launch",
      noun: "Launch",
      stack: "Next.js, Supabase, PostHog",
      targetUser: "founders shipping on Product Hunt",
      launchAngle: "Show the speed gap: trend spotted → idea generated → MVP scoped.",
      mvp: [
        "Launch replay dashboard",
        "Idea generator from trending products",
        "Shareable launch brief",
      ],
    };
  }

  if (source.includes("reddit") || text.includes("pain") || text.includes("community")) {
    return {
      label: "community",
      noun: "Scout",
      stack: "Next.js, Supabase, OpenAI",
      targetUser: "builders who want to turn community pain into products",
      launchAngle: "Lean into pain-point discovery and clear problem/solution framing.",
      mvp: [
        "Community pain scanner",
        "Auto-generated problem briefs",
        "Saved ideas by subreddit or topic",
      ],
    };
  }

  if (source.includes("github") || category.includes("developer") || text.includes("repo") || text.includes("tool")) {
    return {
      label: "builder",
      noun: "Builder",
      stack: "Next.js, Supabase, GitHub API",
      targetUser: "indie developers and tool builders",
      launchAngle: "Sell the project as a faster way to spot devtool gaps before they are crowded.",
      mvp: [
        "Repo trend radar",
        "Auto-scoped weekend MVPs",
        "Source links and freshness badges",
      ],
    };
  }

  if (text.includes("ai") || category.includes("ai")) {
    return {
      label: "ai",
      noun: "Copilot",
      stack: "Next.js, Supabase, OpenAI",
      targetUser: "AI builders and product teams",
      launchAngle: "Position it as the fastest way to turn AI hype into a concrete build plan.",
      mvp: [
        "AI trend detector",
        "Idea generator with MVP scope",
        "Weekly AI opportunity digest",
      ],
    };
  }

  return DEFAULT_THEME;
}

function buildWhyNow(seed: IdeaSeed) {
  const freshness = seed.freshnessCue ? seed.freshnessCue.replace(/^Fresh\s*·\s*/i, "") : null;
  const related = seed.relatedCount > 1 ? `${seed.relatedCount} related signals` : "one high-signal item";
  const freshnessPart = freshness ? `fresh enough to move now (${freshness})` : "already ranking high right now";

  return `The signal is ${freshnessPart} and clustered around ${related}.`;
}

function buildPitch(theme: Theme, seed: IdeaSeed, focus: string) {
  const subject = seed.title.split(/[\/\-|:]/).map((part) => part.trim()).filter(Boolean)[0] ?? theme.noun;
  const prefix = toTitleCase(subject.replace(/[^a-zA-Z0-9 ]/g, " ").trim() || theme.noun);

  if (theme.label === "launch") {
    return `${prefix} launch companion that turns a hot product into a sharper launch brief, positioning, and MVP scope.`;
  }

  if (theme.label === "community") {
    return `${prefix} problem scanner that turns community chatter into a clean product brief, target user, and MVP scope.`;
  }

  if (theme.label === "builder") {
    return `${prefix} builder tool that turns a trending repo or dev signal into a weekend-sized product people can ship.`;
  }

  if (theme.label === "ai") {
    return `${prefix} copilot that turns an AI signal into a concrete product idea with scope, angle, and launch plan.`;
  }

  return `${prefix} ${focus} product that turns a live signal into a buildable idea with clear scope and launch angle.`;
}

function buildName(theme: Theme, seed: IdeaSeed, suffix: string) {
  const subject = seed.title.split(/[\/\-|:]/).map((part) => part.trim()).filter(Boolean)[0] ?? theme.noun;
  const cleanSubject = toTitleCase(subject.replace(/[^a-zA-Z0-9 ]/g, " ").trim() || theme.noun);
  return `${cleanSubject} ${suffix}`;
}

function buildIdea(theme: Theme, seed: IdeaSeed, suffix: string, focus: string): GeneratedIdea {
  return {
    name: buildName(theme, seed, suffix),
    pitch: buildPitch(theme, seed, focus),
    targetUser: theme.targetUser,
    whyNow: buildWhyNow(seed),
    mvp: [...theme.mvp],
    stack: theme.stack,
    launchAngle: theme.launchAngle,
  };
}

export function generateIdeaVariants(seed: IdeaSeed): GeneratedIdea[] {
  const theme = pickTheme(seed);

  return [
    buildIdea(theme, seed, "MVP", "weekend MVP"),
    buildIdea(theme, seed, "Pro", "solo SaaS"),
    buildIdea(theme, seed, "Studio", "content engine"),
  ];
}
