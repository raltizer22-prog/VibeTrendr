import Link from "next/link";
import { isPaidUser } from "@/lib/access";

export const metadata = {
  title: "VibeTrendr | Trend discovery for vibe coders",
  description: "Find what to build next with live trend signals and a topic-driven vibe code helper.",
};

const highlights = [
  "See which niches are heating up before they get crowded",
  "Turn live signals into buildable ideas fast",
  "Keep the paid workspace focused on high-signal work",
];

const features = [
  {
    title: "Trend intelligence",
    body: "Live signals and freshness cues show what’s gaining traction now.",
  },
  {
    title: "Idea generation",
    body: "Turn a niche into scoped, buildable product ideas in minutes.",
  },
  {
    title: "Paid access",
    body: "A lightweight gate keeps the full workspace behind the pricing flow.",
  },
];

export default async function Home() {
  const isPaid = await isPaidUser();
  const appHref = isPaid ? "/app" : "/pricing";

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-12">
          <div>
            <div className="text-lg font-semibold tracking-tight">VibeTrendr v2</div>
            <div className="text-xs text-zinc-400">Trend discovery for vibe coders</div>
          </div>
          <nav className="flex items-center gap-6 text-sm text-zinc-300">
            <Link className="transition hover:text-white" href="/pricing">
              Pricing
            </Link>
            <Link className="transition hover:text-white" href={appHref}>
              {isPaid ? "App" : "View pricing"}
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-12 lg:py-24">
        <div>
          <div className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
            Idea engine for vibe coders
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Know what to build next before the niche gets crowded.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            VibeTrendr watches live signals, turns them into ideas, and helps people decide what’s actually worth
            building next.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-zinc-200">
            {highlights.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300"
            >
              View pricing
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">Core value</div>
          <div className="mt-4 space-y-4">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4">
                <h2 className="text-base font-semibold text-white">{feature.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
