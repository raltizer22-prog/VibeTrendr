export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-20 sm:px-10 lg:px-12">
        <div className="mb-6 inline-flex w-fit rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
          VibeTrendr v2
        </div>

        <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
          Find trends early. Build faster. Ship before the room catches up.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
          VibeTrendr scans the signal, filters the noise, and helps you spot
          what’s worth building next.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <div className="text-sm text-zinc-400">Mode</div>
            <div className="mt-1 text-base font-medium">Trend discovery</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <div className="text-sm text-zinc-400">Stack</div>
            <div className="mt-1 text-base font-medium">Next.js + Vercel</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <div className="text-sm text-zinc-400">Status</div>
            <div className="mt-1 text-base font-medium text-emerald-300">Deploy ready</div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 text-sm text-zinc-400">
          <span className="rounded-full border border-white/10 px-4 py-2">AI idea generation</span>
          <span className="rounded-full border border-white/10 px-4 py-2">Trend signals</span>
          <span className="rounded-full border border-white/10 px-4 py-2">Launch planning</span>
          <span className="rounded-full border border-white/10 px-4 py-2">Fast iteration</span>
        </div>
      </section>
    </main>
  );
}
