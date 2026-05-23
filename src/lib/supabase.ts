import type { Signal } from "./types";

export type SignalSnapshotRow = {
  refreshed_at: string;
  source: string;
  title: string;
  category: string;
  description: string | null;
  velocity: string | null;
  horizon: string | null;
  score: number;
  source_url: string | null;
};

export async function persistSignalSnapshots(signals: Signal[], refreshedAt: string): Promise<void> {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey || signals.length === 0) {
    return;
  }

  const rows: SignalSnapshotRow[] = signals.map((signal) => ({
    refreshed_at: refreshedAt,
    source: signal.source,
    title: signal.title,
    category: signal.category,
    description: signal.description || null,
    velocity: signal.velocity || null,
    horizon: signal.horizon || null,
    score: signal.score,
    source_url: signal.sourceUrl ?? null,
  }));

  try {
    await fetch(`${url.replace(/\/$/, "")}/rest/v1/signal_snapshots`, {
      method: "POST",
      headers: {
        apikey: serviceRoleKey,
        authorization: `Bearer ${serviceRoleKey}`,
        "content-type": "application/json",
        prefer: "return=minimal",
      },
      body: JSON.stringify(rows),
    });
  } catch {
    return;
  }
}

export function getSupabaseEnvStatus(): { ready: boolean; missing: string[] } {
  const missing: string[] = [];

  if (!process.env.SUPABASE_URL?.trim()) {
    missing.push("SUPABASE_URL");
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    missing.push("SUPABASE_SERVICE_ROLE_KEY");
  }

  return { ready: missing.length === 0, missing };
}
