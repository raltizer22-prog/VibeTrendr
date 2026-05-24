"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { GeneratedIdea } from "@/lib/idea-generator";

type TopicIdeaResponse = {
  ok: boolean;
  ideas?: GeneratedIdea[];
  error?: string;
};

const DEFAULT_TOPIC = "fitness";
const DEFAULT_AUDIENCE = "solo founders and creators";
const DEFAULT_STYLE = "buildable";

function IdeaCard({ idea }: { idea: GeneratedIdea }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
      <div className="text-lg font-semibold text-white">{idea.name}</div>
      <p className="mt-2 text-sm leading-6 text-zinc-300">{idea.pitch}</p>

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
    </article>
  );
}

export function TopicIdeaGenerator() {
  const [topic, setTopic] = useState(DEFAULT_TOPIC);
  const [audience, setAudience] = useState(DEFAULT_AUDIENCE);
  const [style, setStyle] = useState(DEFAULT_STYLE);
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasResults = ideas.length > 0;
  const helperText = useMemo(() => {
    if (hasResults) return `Generated for ${topic.trim() || "your topic"}.`;
    return "Try a niche like fitness, trading, or creator tools.";
  }, [hasResults, topic]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTopic = topic.trim();

    if (!trimmedTopic) {
      setError("Enter a topic to generate ideas.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generated-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "topic",
          topic: trimmedTopic,
          audience: audience.trim(),
          style: style.trim(),
        }),
      });

      const data = (await response.json()) as TopicIdeaResponse;
      if (!response.ok || !data.ok || !data.ideas) {
        throw new Error(data.error || "Failed to generate ideas.");
      }

      setIdeas(data.ideas);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to generate ideas.");
    } finally {
      setLoading(false);
    }
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

      <form className="mt-5 grid gap-3 md:grid-cols-[1.1fr_1fr_0.8fr_auto]" onSubmit={handleSubmit}>
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
      </form>

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        {ideas.length > 0 ? ideas.map((idea) => <IdeaCard key={idea.name} idea={idea} />) : null}
      </div>

      {!hasResults ? (
        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-300">
          Hit generate to see three scoped ideas from the API.
        </div>
      ) : null}
    </div>
  );
}
