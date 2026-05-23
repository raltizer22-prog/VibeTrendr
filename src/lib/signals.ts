export type Signal = {
  category: string;
  title: string;
  description: string;
  velocity: string;
  horizon: string;
  source: string;
  score: number;
  updatedAt: string;
};

export const signals: Signal[] = [
  {
    category: "AI tooling",
    title: "Agent memory overlays are getting hot",
    description:
      "Builders keep asking for persistent context across sessions without hand-holding every prompt.",
    velocity: "High",
    horizon: "Now",
    source: "Reddit + product chatter",
    score: 92,
    updatedAt: "2m ago",
  },
  {
    category: "Creator economy",
    title: "Tiny launch products are outperforming bloated suites",
    description:
      "Small, opinionated tools are winning because they ship faster and feel easier to buy.",
    velocity: "Rising",
    horizon: "This week",
    source: "Product Hunt + X",
    score: 84,
    updatedAt: "8m ago",
  },
  {
    category: "Developer tools",
    title: "Local-first workflows are back",
    description:
      "People want faster iteration loops, less cloud nonsense, and more offline control.",
    velocity: "Hot",
    horizon: "Right now",
    source: "GitHub + community posts",
    score: 88,
    updatedAt: "15m ago",
  },
  {
    category: "Trend signal",
    title: "Vibe coding is turning into a category",
    description:
      "The phrase is showing up everywhere. That usually means a product layer is forming.",
    velocity: "Very high",
    horizon: "Today",
    source: "Twitter / X",
    score: 95,
    updatedAt: "31m ago",
  },
];

export const stats = [
  { label: "Trending now", value: "42" },
  { label: "Ideas queued", value: "18" },
  { label: "High-confidence signals", value: "9" },
];
