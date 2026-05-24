"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UnlockAccessButton({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUnlock() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/access", { method: "POST" });
      if (!response.ok) {
        throw new Error("Unable to unlock access right now.");
      }

      router.push(nextPath || "/app");
      router.refresh();
    } catch (unlockError) {
      setError(unlockError instanceof Error ? unlockError.message : "Unable to unlock access right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleUnlock}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? "Unlocking..." : "Unlock paid access"}
      </button>
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </div>
  );
}
