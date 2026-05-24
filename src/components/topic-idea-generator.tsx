"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  generateNicheTrendStrip,
  type GeneratedIdea,
} from "@/lib/idea-generator";

type TopicIdeaResponse = {
  ok: boolean;
  ideas?: GeneratedIdea[];
  error?: string;
};

type SavedIdea = GeneratedIdea & {
  savedAt: string;
  topic: string;
  audience: string;
  style: string;
};

const DEFAULT_TOPIC = "fitness";
const DEFAULT_AUDIENCE = "solo founders and creators";
const DEFAULT_STYLE = "buildable";
const SAVED_IDEAS_KEY = "vibetrendr.saved-ideas.v1";

function normalizeKey(value: string) {
  return value.trim().toLowerCase();
}

function ideaKey(idea: GeneratedIdea) {
  return normalizeKey(`${idea.name}|${idea.targetUser}|${idea.pitch}`);
}

function IdeaCard({
  idea,
  saved,
  refining,
  onSave,
  onRefine,
}: {
  idea: GeneratedIdea;
  saved: boolean;
  refining: boolean;
  onSave: (idea: GeneratedIdea) => void;
  onRefine: (idea: GeneratedIdea) => void;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4 transition hover:border-white/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-white">{idea.name}</div>
          <p className="mt-2 text-sm leading-6 text-zinc-300">{idea.pitch}</p>
        </div>
        <button
          type="button"
          onClick={() => onSave(idea)}
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition ${
            saved
              ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
              : "border-white/10 bg-white/5 text-zinc-200 hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300"
          }`}
        >
          {saved ? "Saved" : "Save"}
        </button>
      </div>

      <div className="mt-4 space-y-3 text-sm text-zinc-300">
        <div>
          <span className="text-zinc-500">Target:</span> {idea.targetUser}
        </div>
        <div>
          <span className="text-zinc-500">Why now:</span> {idea.whyNow}
        </div>
        <div>
          <span className="text-zinc-500">Stack:</span> {idea.stack}
        </div>
        <div>
          <span className="text-zinc-500">Launch angle:</span> {idea.launchAngle}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">MVP</div>
        <ul className="space-y-1 text-sm text-zinc-300">
          {idea.mvp.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onRefine(idea)}
          disabled={refining}
          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-200 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {refining ? "Refining..." : "Refine"}
        </button>
      </div>
    </article>
  );
}

export function TopicIdeaGenerator() {
  const [topic, setTopic] = useState(DEFAULT_TOPIC);
  const [audience, setAudience] = useState(DEFAULT_AUDIENCE);
  const [style, setStyle] = useState(DEFAULT_STYLE);
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<SavedIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [refiningName, setRefiningName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [helperText, setHelperText] = useState("Try a niche like fitness, trading, or creator tools.");
  const [hydrated, setHydrated] = useState(false);
  const [lastUsedSeed, setLastUsedSeed] = useState<{ topic: string; audience: string; style: string } | null>(null);

  const hasResults = ideas.length > 0;
  const nicheStrip = useMemo(() => generateNicheTrendStrip({ topic, audience, style }), [topic, audience, style]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SAVED_IDEAS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as SavedIdea[];
        if (Array.isArray(parsed)) {
          setSavedIdeas(parsed.filter((item) => item && typeof item.name === "string"));
        }
      }
    } catch {
      // Ignore malformed localStorage payloads.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      window.localStorage.setItem(SAVED_IDEAS_KEY, JSON.stringify(savedIdeas));
    } catch {
      // Ignore storage quota / private mode issues.
    }
  }, [hydrated, savedIdeas]);

  async function requestIdeas(mode: "topic" | "refine") {
    setLoading(true);
    setError(null);

    try {
      const payload =
        mode === "topic"
          ? {
              mode: "topic",
              topic: topic.trim(),
              audience: audience.trim(),
              style: style.trim(),
            }
          : {
              mode: "refine",
              idea: ideas[0],
              topic: topic.trim(),
              audience: audience.trim(),
              style: style.trim(),
            };

      const response = await fetch("/api/generated-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as TopicIdeaResponse;
      if (!response.ok || !data.ok || !data.ideas) {
        throw new Error(data.error || "Failed to generate ideas.");
      }

      setIdeas(data.ideas);
      setLastUsedSeed({ topic: topic.trim(), audience: audience.trim(), style: style.trim() });
      setHelperText(mode === "refine" ? "Refined the current idea into tighter variants." : `Generated for ${topic.trim() || "your topic"}.`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to generate ideas.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!topic.trim()) {
      setError("Enter a topic to generate ideas.");
      return;
    }

    await requestIdeas("topic");
  }

  async function handleRegenerate() {
    if (!topic.trim()) {
      setError("Enter a topic to generate ideas.");
      return;
    }

    await requestIdeas("topic");
  }

  async function handleRefine(idea: GeneratedIdea) {
    setRefiningName(idea.name);
    setError(null);

    try {
      const response = await fetch("/api/generated-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "refine",
          idea,
          topic: topic.trim(),
          audience: audience.trim(),
          style: style.trim(),
        }),
      });

      const data = (await response.json()) as TopicIdeaResponse;
      if (!response.ok || !data.ok || !data.ideas) {
        throw new Error(data.error || "Failed to refine idea.");
      }

      setIdeas(data.ideas);
      setLastUsedSeed({ topic: topic.trim(), audience: audience.trim(), style: style.trim() });
      setHelperText(`Refined ${idea.name} into tighter variants.`);
    } catch (refineError) {
      setError(refineError instanceof Error ? refineError.message : "Failed to refine idea.");
    } finally {
      setRefiningName(null);
    }
  }

  function handleSave(idea: GeneratedIdea) {
    setSavedIdeas((current) => {
      const key = ideaKey(idea);
      const exists = current.some((item) => ideaKey(item) === key);
      if (exists) {
        return current.filter((item) => ideaKey(item) !== key);
      }

      return [
        {
          ...idea,
          savedAt: new Date().toISOString(),
          topic: topic.trim(),
          audience: audience.trim(),
          style: style.trim(),
        },
        ...current,
      ];
    });
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">Vibe code helper</div>
          <h2 className="mt-1 text-2xl font-semibold">Turn a topic into build ideas</h2>
          <p className="mt-1 text-sm text-zinc-400">{helperText}</p>
        </div>
        <div className="text-sm text-zinc-400">Example topic: {DEFAULT_TOPIC}</div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {nicheStrip.map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-white/10 bg-zinc-950/60 px-3 py-1 text-xs text-zinc-300"
          >
            {chip}
          </span>
        ))}
      </div>

      <form className="mt-5 grid gap-3 md:grid-cols-[1.1fr_1fr_0.8fr_auto_auto]" onSubmit={handleSubmit}>
        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">Topic</span>
          <input
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-emerald-400/40"
            placeholder="Fitness, trading, creator tools"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">Audience</span>
          <input
            value={audience}
            onChange={(event) => setAudience(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-emerald-400/40"
            placeholder="Who is this for?"
          />
        </label>

        <label className="space-y-2">
          <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">Style</span>
          <input
            value={style}
            onChange={(event) => setStyle(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-zinc-950/70 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-emerald-400/40"
            placeholder="buildable, premium, playful"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        <button
          type="button"
          onClick={handleRegenerate}
          disabled={loading}
          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-emerald-400/30 hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Regenerate
        </button>
      </form>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {ideas.length > 0
          ? ideas.map((idea) => (
              <IdeaCard
                key={idea.name}
                idea={idea}
                saved={savedIdeas.some((saved) => ideaKey(saved) === ideaKey(idea))}
                refining={refiningName === idea.name}
                onSave={handleSave}
                onRefine={handleRefine}
              />
            ))
          : null}
      </div>

      {!hasResults ? (
        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-300">
          Hit generate to see three scoped ideas from the API.
        </div>
      ) : null}

      <div className="mt-6 rounded-3xl border border-white/10 bg-zinc-950/40 p-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">Saved ideas</div>
            <h3 className="mt-1 text-lg font-semibold text-white">Local shortlist</h3>
          </div>
          <div className="text-sm text-zinc-400">{hydrated ? `${savedIdeas.length} saved` : "Loading..."}</div>
        </div>

        {savedIdeas.length > 0 ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {savedIdeas.map((idea) => (
              <article key={`${ideaKey(idea)}-${idea.savedAt}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-white">{idea.name}</div>
                    <div className="mt-1 text-xs text-zinc-500">
                      Saved for {idea.topic || "your topic"} · {idea.savedAt}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSave(idea)}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-200 transition hover:border-red-400/30 hover:bg-red-400/10 hover:text-red-200"
                  >
                    Remove
                  </button>
                </div>
                <p className="mt-3 text-sm leading-6 text-zinc-300">{idea.pitch}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-300">
            Save strong ideas here to keep a local idea queue across refreshes.
          </div>
        )}
      </div>

      {lastUsedSeed ? (
        <div className="mt-4 text-xs text-zinc-500">
          Last run: {lastUsedSeed.topic || "your topic"} · {lastUsedSeed.audience || "your audience"} · {lastUsedSeed.style || "your style"}
        </div>
      ) : null}
    </div>
  );
}
