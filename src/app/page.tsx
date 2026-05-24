import Link from "next/link";

export const metadata = {
  title: "VibeTrendr | Trend discovery for vibe coders",
  description: "Public landing page for VibeTrendr v2.",
};

const highlights = [
  "Scan live signals before they get crowded",
  "Turn strong trends into buildable ideas",
  "Keep the paid dashboard focused on what matters",
];

const features = [
  {
    title: "Public preview",
    body: "A clean landing page that explains the product without exposing the paid dashboard.",
  },
  {
    title: "Paid dashboard",
    body: "The existing dashboard stays behind /app and remains the full product experience.",
  },
  {
    title: "Simple access gate",
    body: "A cookie-based gate routes visitors to pricing until access has been unlocked.",
  },
];

export default function Home() {
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
            <Link className="transition hover:text-white" href="/app">
              App
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-12 lg:py-24">
        <div>
          <div className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
            Public landing page
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Spot trends early, then move into the paid dashboard when you’re ready.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            VibeTrendr watches live signals, turns them into ideas, and keeps the locked app focused on the
            high-signal work.
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
            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-100 transition hover:border-emerald-400/30 hover:bg-emerald-400/10"
            >
              Open app
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">What’s inside</div>
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
