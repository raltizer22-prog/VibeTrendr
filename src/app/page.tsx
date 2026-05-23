import { getSignals, stats } from "@/lib/signals";
import { fetchRecentSignalSnapshots, getSupabaseEnvStatus } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function formatRefreshedAt(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default async function Home() {
  const [{ signals, refreshedAt }, recentSnapshots, supabaseStatus] = await Promise.all([
    getSignals(),
    fetchRecentSignalSnapshots(6),
    Promise.resolve(getSupabaseEnvStatus()),
  ]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-12">
          <div>
            <div className="text-lg font-semibold tracking-tight">VibeTrendr v2</div>
            <div className="text-xs text-zinc-400">Trend discovery for vibe coders</div>
          </div>
          <nav className="flex items-center gap-6 text-sm text-zinc-300">
            <a className="transition hover:text-white" href="#dashboard">
              Dashboard
            </a>
            <a className="transition hover:text-white" href="#signals">
              Signals
            </a>
            <a className="transition hover:text-white" href="#snapshots">
              Snapshots
            </a>
            <a className="transition hover:text-white" href="#queue">
              Idea queue
            </a>
          </nav>
        </div>
      </header>

      <section id="dashboard" className="mx-auto max-w-6xl px-6 py-10 sm:px-10 lg:px-12">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-400/10 via-white/5 to-transparent p-8 lg:p-10">
          <div className="mb-6 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
            Live signal board
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                Spot trends early, sort the noise, and ship the right thing first.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
                VibeTrendr watches the market, surfaces what’s heating up, and keeps the
                idea queue moving without turning into another bloated dashboard.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <div className="text-2xl font-semibold text-white">{stat.value}</div>
                  <div className="mt-1 text-xs text-zinc-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="signals" className="mx-auto max-w-6xl px-6 py-6 sm:px-10 lg:px-12">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Signals feed</h2>
            <div className="text-sm text-zinc-400">Ranked across live sources</div>
          </div>
          <div className="text-sm text-zinc-400">Last refreshed {formatRefreshedAt(refreshedAt)}</div>
        </div>

        <div className="grid gap-4">
          {signals.map((signal) => (
            <article
              key={signal.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-emerald-400/30 hover:bg-white/[0.07]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="text-sm text-emerald-300">{signal.category}</div>
                  <h3 className="mt-1 text-xl font-semibold">{signal.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">{signal.description}</p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-3 text-xs text-zinc-300">
                  <span className="rounded-full border border-white/10 px-3 py-1">{signal.velocity}</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">{signal.horizon}</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">{signal.source}</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">Score {signal.score}</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">{signal.updatedAt}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="snapshots" className="mx-auto max-w-6xl px-6 py-6 sm:px-10 lg:px-12">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Recent snapshots</h2>
              <p className="mt-1 text-sm text-zinc-400">
                Latest rows from Supabase, shown read-only for quick review.
              </p>
            </div>
            <div className="text-sm text-zinc-400">
              {supabaseStatus.ready ? "Connected" : "Not connected"}
            </div>
          </div>

          {!supabaseStatus.ready ? (
            <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-300">
              Supabase env vars are missing, so the snapshot panel is showing a safe fallback.
            </div>
          ) : recentSnapshots.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-zinc-950/50 px-4 py-3 text-sm text-zinc-300">
              No snapshots yet.
            </div>
          ) : (
            <div className="mt-5 grid gap-3">
              {recentSnapshots.map((snapshot) => (
                <article
                  key={`${snapshot.refreshed_at}-${snapshot.source}-${snapshot.title}`}
                  className="rounded-2xl border border-white/10 bg-zinc-950/60 p-4"
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="text-xs uppercase tracking-[0.2em] text-emerald-300">
                        {snapshot.source}
                      </div>
                      <h3 className="mt-1 text-lg font-semibold text-white">{snapshot.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-zinc-300">{snapshot.description ?? "No description provided."}</p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2 text-xs text-zinc-300">
                      <span className="rounded-full border border-white/10 px-3 py-1">{snapshot.category}</span>
                      <span className="rounded-full border border-white/10 px-3 py-1">Score {snapshot.score}</span>
                      <span className="rounded-full border border-white/10 px-3 py-1">{snapshot.velocity ?? "—"}</span>
                      <span className="rounded-full border border-white/10 px-3 py-1">{snapshot.horizon ?? "—"}</span>
                      <span className="rounded-full border border-white/10 px-3 py-1">{formatRefreshedAt(snapshot.refreshed_at)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="queue" className="mx-auto max-w-6xl px-6 py-10 sm:px-10 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-2xl font-semibold">Idea queue</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
              Signals should turn into buildable ideas. This is where the shortlist lives.
            </p>
            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-300">
                Build an AI trend brief generator
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-300">
                Add source scoring and confidence weights
              </div>
              <div className="rounded-2xl border border-white/10 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-300">
                Save ideas to Supabase later
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6">
            <h2 className="text-2xl font-semibold">Next move</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-300">
              Connect real data sources, score them, then let users turn a strong signal into a project idea.
            </p>
            <a
              href="#signals"
              className="mt-6 inline-flex rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300"
            >
              Review signals
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
