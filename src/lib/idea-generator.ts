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

export type TopicSeed = {
  topic: string;
  audience?: string;
  style?: string;
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

export type RefineSeed = {
  idea: GeneratedIdea;
  topic?: string;
  audience?: string;
  style?: string;
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

function dedupeStrings(values: string[]) {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}

export function extractSubject(value: string, fallback: string) {
  const raw = value.split(/[\/\-|:]/).map((part) => part.trim()).filter(Boolean)[0] ?? fallback;
  return toTitleCase(raw.replace(/[^a-zA-Z0-9 ]/g, " ").trim() || fallback);
}

function pickThemeFromSignal(seed: IdeaSeed): Theme {
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

function pickThemeFromTopic(seed: TopicSeed): Theme {
  const topic = normalize(seed.topic);
  const audience = normalize(seed.audience ?? "");
  const style = normalize(seed.style ?? "");

  if (topic.includes("fitness") || topic.includes("health") || audience.includes("fitness")) {
    return {
      label: "fitness",
      noun: "Fitness",
      stack: "Next.js, Supabase, Stripe",
      targetUser: "fitness creators, coaches, and solo founders",
      launchAngle: "Make it feel like a sharp niche tool, not a generic wellness app.",
      mvp: [
        "Workout streak tracking",
        "Plan generator for a specific goal",
        "Progress dashboard with shareable wins",
      ],
    };
  }

  if (topic.includes("trading") || topic.includes("crypto") || audience.includes("trader")) {
    return {
      label: "trading",
      noun: "Trade",
      stack: "Next.js, Supabase, Trading APIs",
      targetUser: "traders and crypto watchers",
      launchAngle: "Focus on signal clarity and speed, not a bloated trading suite.",
      mvp: [
        "Watchlist with alerts",
        "Signal summary feed",
        "Entry/exit note generator",
      ],
    };
  }

  if (topic.includes("creator") || topic.includes("content") || topic.includes("marketing") || audience.includes("creator")) {
    return {
      label: "creator",
      noun: "Create",
      stack: "Next.js, Supabase, OpenAI",
      targetUser: "solo creators and growth marketers",
      launchAngle: "Make it feel like a fast content system that turns ideas into output.",
      mvp: [
        "Content idea generator",
        "Hook and angle builder",
        "Publishing queue and reminder board",
      ],
    };
  }

  if (topic.includes("ai") || style.includes("ai")) {
    return {
      label: "ai",
      noun: "AI",
      stack: "Next.js, Supabase, OpenAI",
      targetUser: "AI builders and product teams",
      launchAngle: "Turn the topic into a useful build brief instead of vague hype.",
      mvp: [
        "Problem → solution generator",
        "Prompt-to-MVP planner",
        "Weekly niche opportunity tracker",
      ],
    };
  }

  return {
    label: topic || "idea",
    noun: extractSubject(seed.topic, "Idea"),
    stack: "Next.js, Supabase, Vercel",
    targetUser: audience || "solo builders",
    launchAngle: "Make the build narrow, obvious, and shippable fast.",
    mvp: [
      `Problem tracker for ${topic || "the niche"}`,
      `Idea generator for ${topic || "the niche"}`,
      `Simple queue for the best concepts`,
    ],
  };
}

function buildWhyNowFromSignal(seed: IdeaSeed) {
  const freshness = seed.freshnessCue ? seed.freshnessCue.replace(/^Fresh\s*·\s*/i, "") : null;
  const related = seed.relatedCount > 1 ? `${seed.relatedCount} related signals` : "one high-signal item";
  const freshnessPart = freshness ? `fresh enough to move now (${freshness})` : "already ranking high right now";

  return `The signal is ${freshnessPart} and clustered around ${related}.`;
}

function buildWhyNowFromTopic(seed: TopicSeed) {
  const topic = seed.topic.trim();
  return `${topic} is a good build lane because people are already searching for focused tools there and the niche is easy to ship small.`;
}

function buildPitch(theme: Theme, seed: IdeaSeed, focus: string) {
  const subject = extractSubject(seed.title, theme.noun);

  if (theme.label === "launch") {
    return `${subject} launch companion that turns a hot product into a sharper launch brief, positioning, and MVP scope.`;
  }

  if (theme.label === "community") {
    return `${subject} problem scanner that turns community chatter into a clean product brief, target user, and MVP scope.`;
  }

  if (theme.label === "builder") {
    return `${subject} builder tool that turns a trending repo or dev signal into a weekend-sized product people can ship.`;
  }

  if (theme.label === "ai") {
    return `${subject} copilot that turns an AI signal into a concrete product idea with scope, angle, and launch plan.`;
  }

  return `${subject} ${focus} product that turns a live signal into a buildable idea with clear scope and launch angle.`;
}

function buildName(theme: Theme, seed: IdeaSeed, suffix: string) {
  const subject = extractSubject(seed.title, theme.noun);
  return `${subject} ${suffix}`;
}

function buildIdeaFromSignal(theme: Theme, seed: IdeaSeed, suffix: string, focus: string): GeneratedIdea {
  return {
    name: buildName(theme, seed, suffix),
    pitch: buildPitch(theme, seed, focus),
    targetUser: theme.targetUser,
    whyNow: buildWhyNowFromSignal(seed),
    mvp: [...theme.mvp],
    stack: theme.stack,
    launchAngle: theme.launchAngle,
  };
}

function buildIdeaFromTopic(theme: Theme, seed: TopicSeed, suffix: string, focus: string): GeneratedIdea {
  const noun = extractSubject(seed.topic, theme.noun);
  const audience = seed.audience?.trim() || theme.targetUser;

  return {
    name: `${noun} ${suffix}`,
    pitch: `${noun} ${focus} product that helps ${audience} ship a focused build faster.`,
    targetUser: audience,
    whyNow: buildWhyNowFromTopic(seed),
    mvp: [...theme.mvp],
    stack: theme.stack,
    launchAngle: theme.launchAngle,
  };
}

function buildRefinedWhyNow(idea: GeneratedIdea) {
  return `Refined from ${idea.name} to make the positioning tighter and the MVP easier to ship.`;
}

function buildRefinedMvp(idea: GeneratedIdea, focus: string) {
  const trimmed = idea.mvp.slice(0, 2);
  const extras = [`One-screen ${focus} flow`, `Shareable ${focus} summary`];

  return dedupeStrings([...trimmed, ...extras]).slice(0, 3);
}

function buildRefinedIdea(base: GeneratedIdea, suffix: string, focus: string, targetUser: string, style?: string): GeneratedIdea {
  const subject = extractSubject(base.name, "Idea");
  const refinedStyle = style?.trim() ? ` for a ${style.trim()} angle` : "";

  return {
    name: `${subject} ${suffix}`,
    pitch: `${subject} refined ${focus} product for ${targetUser}${refinedStyle}.`,
    targetUser,
    whyNow: buildRefinedWhyNow(base),
    mvp: buildRefinedMvp(base, focus),
    stack: base.stack,
    launchAngle: base.launchAngle,
  };
}

export function generateIdeaVariants(seed: IdeaSeed): GeneratedIdea[] {
  const theme = pickThemeFromSignal(seed);

  return [
    buildIdeaFromSignal(theme, seed, "MVP", "weekend MVP"),
    buildIdeaFromSignal(theme, seed, "Pro", "solo SaaS"),
    buildIdeaFromSignal(theme, seed, "Studio", "content engine"),
  ];
}

export function generateTopicIdeaVariants(seed: TopicSeed): GeneratedIdea[] {
  const theme = pickThemeFromTopic(seed);

  return [
    buildIdeaFromTopic(theme, seed, "MVP", "weekend MVP"),
    buildIdeaFromTopic(theme, seed, "Pro", "solo SaaS"),
    buildIdeaFromTopic(theme, seed, "Studio", "content engine"),
  ];
}

export function generateRefinedIdeaVariants(seed: RefineSeed): GeneratedIdea[] {
  const targetUser = seed.audience?.trim() || seed.idea.targetUser;
  const style = seed.style?.trim();
  const subject = extractSubject(seed.topic || seed.idea.name, "Idea");

  return [
    buildRefinedIdea({ ...seed.idea, name: `${subject} Focus` }, "Focus", "narrow use case", targetUser, style),
    buildRefinedIdea({ ...seed.idea, name: `${subject} Sprint` }, "Sprint", "weekend sprint", targetUser, style),
    buildRefinedIdea({ ...seed.idea, name: `${subject} Niche` }, "Niche", "high-signal niche", targetUser, style),
  ];
}

export function generateNicheTrendStrip(seed: { topic: string; audience?: string; style?: string }) {
  const topic = normalize(seed.topic);
  const audience = normalize(seed.audience ?? "");
  const style = normalize(seed.style ?? "");
  const subject = extractSubject(seed.topic, "idea");

  const chips = [
    `${subject} micro-tools`,
    `${subject} trend watch`,
    `${subject} workflow automations`,
    `${subject} launch brief`,
  ];

  if (topic.includes("ai") || style.includes("ai")) {
    chips.push("AI copilots", "prompt-to-MVP", "agent workflows");
  }

  if (topic.includes("fitness") || audience.includes("coach") || audience.includes("fitness")) {
    chips.push("training streaks", "coach dashboards", "progress wins");
  }

  if (topic.includes("creator") || topic.includes("content") || audience.includes("creator")) {
    chips.push("hook generators", "content queues", "post repurposing");
  }

  if (topic.includes("trading") || topic.includes("crypto") || audience.includes("trader")) {
    chips.push("signal alerts", "watchlists", "entry notes");
  }

  if (style.includes("premium") || style.includes("pro")) {
    chips.push("premium niche workflows");
  }

  return dedupeStrings(chips).slice(0, 6);
}
