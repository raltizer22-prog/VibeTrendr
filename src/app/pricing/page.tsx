import Link from "next/link";
import { UnlockAccessButton } from "@/components/unlock-access-button";
import { isPaidUser } from "@/lib/access";

const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/28E4gy3LAfUPd2h3hB14406";

export const metadata = {
  title: "Pricing | VibeTrendr",
  description: "Unlock the paid trend intelligence workspace.",
};

const plans = [
  {
    name: "Preview",
    price: "$0",
    points: ["Public landing page", "Product overview", "Access redirect"],
  },
  {
    name: "Paid access",
    price: "$19/mo",
    points: ["Full /app workspace", "Live signal board", "Idea generator and queue"],
    featured: true,
  },
];

export default async function PricingPage({
  searchParams,
}: {
  searchParams?: Promise<{ next?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const isPaid = await isPaidUser();
  const nextPath = isPaid ? "/app" : resolvedSearchParams?.next?.startsWith("/") ? resolvedSearchParams.next : "/app";
  const appHref = isPaid ? "/app" : "/pricing";

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10 lg:px-12">
          <div>
            <div className="text-lg font-semibold tracking-tight">VibeTrendr</div>
            <div className="text-xs text-zinc-400">Pricing and access</div>
          </div>
          <nav className="flex items-center gap-6 text-sm text-zinc-300">
            <Link className="transition hover:text-white" href="/">
              Landing
            </Link>
            <Link className="transition hover:text-white" href={appHref}>
              App
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-12 lg:py-24">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
            Access
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
            Get the full trend intelligence workspace.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            The public site shows the value. The full workspace lives behind /app and unlocks the live signals,
            topic generator, snapshots, and save/refine/regenerate flow.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-3xl border p-6 ${
                plan.featured ? "border-emerald-400/30 bg-emerald-400/10" : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
                  <div className="mt-1 text-3xl font-semibold text-emerald-300">{plan.price}</div>
                </div>
                {plan.featured ? (
                  <span className="rounded-full border border-emerald-400/30 bg-zinc-950/40 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-300">
                    Recommended
                  </span>
                ) : null}
              </div>

              <ul className="mt-5 space-y-3 text-sm text-zinc-300">
                {plan.points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold">Ready to continue?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-300">
            Go straight to checkout, then unlock the full paid experience.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={STRIPE_PAYMENT_LINK}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300"
            >
              Continue to checkout
            </a>
            <UnlockAccessButton nextPath={nextPath} />
          </div>
        </div>
      </section>
    </main>
  );
}
