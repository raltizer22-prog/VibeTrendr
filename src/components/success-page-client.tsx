"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function resolveNextPath(value: string) {
  if (value.startsWith("/")) {
    return value;
  }

  return "/app";
}

export function SuccessPageClient({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const resolvedNextPath = resolveNextPath(nextPath);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function unlockAndRedirect() {
      try {
        const response = await fetch("/api/access", { method: "POST" });
        if (!response.ok) {
          throw new Error("Unable to confirm access right now.");
        }

        if (cancelled) {
          return;
        }

        setStatus("ready");
        router.replace(resolvedNextPath);
        router.refresh();
      } catch (unlockError) {
        if (cancelled) {
          return;
        }

        setStatus("error");
        setError(unlockError instanceof Error ? unlockError.message : "Unable to confirm access right now.");
      }
    }

    void unlockAndRedirect();

    return () => {
      cancelled = true;
    };
  }, [resolvedNextPath, router]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-50">
      <section className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center sm:px-10">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10">
          <div className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-300">
            Payment complete
          </div>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">Unlocking your workspace…</h1>
          <p className="mt-4 text-sm leading-6 text-zinc-300 sm:text-base">
            We’re setting your access and sending you back into VibeTrendr.
          </p>

          {status === "error" ? (
            <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-left text-sm text-red-200">
              <p>{error ?? "Something went wrong."}</p>
              <p className="mt-2 text-red-100/80">Hit the button below and we’ll take you in manually.</p>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-white/10 bg-zinc-950/40 p-4 text-left text-sm text-zinc-300">
              {status === "ready" ? "Access confirmed. Redirecting now." : "Just a sec — confirming access now."}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={resolvedNextPath}
              className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300"
            >
              Go to app
            </Link>
            <Link href="/pricing" className="text-sm text-zinc-300 transition hover:text-white">
              Back to pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
