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
          <a
            href="#signals"
            className="rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300"
          >
            View signals
          </a>
          <a
            href="#plan"
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-zinc-50 transition hover:bg-white/5"
          >
            See the plan
          </a>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
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

      <section id="signals" className="border-t border-white/10 bg-zinc-900/60 px-6 py-20 sm:px-10 lg:px-12">
        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Signal 01</div>
            <h2 className="mt-2 text-xl font-semibold">What people are asking for</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Capture emerging requests before they become boring features.
            </p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Signal 02</div>
            <h2 className="mt-2 text-xl font-semibold">Where attention is moving</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Watch tools, niches, and communities that are starting to accelerate.
            </p>
          </article>
          <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm text-zinc-400">Signal 03</div>
            <h2 className="mt-2 text-xl font-semibold">What to build next</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Turn noisy trend data into a clean build queue.
            </p>
          </article>
        </div>
      </section>

      <section id="plan" className="px-6 py-20 sm:px-10 lg:px-12">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold">Launch plan</h2>
          <p className="mt-3 max-w-2xl text-zinc-300">
            Keep the first release focused: find trends, shortlist ideas, and
            move fast from signal to shipping.
          </p>
        </div>
      </section>
    </main>
  );
}
