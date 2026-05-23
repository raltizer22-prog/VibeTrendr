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

const SIGNAL_SNAPSHOTS_SELECT =
  "refreshed_at,source,title,category,description,velocity,horizon,score,source_url";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  return { url, serviceRoleKey };
}

function buildSupabaseHeaders(serviceRoleKey: string) {
  return {
    apikey: serviceRoleKey,
    authorization: `Bearer ${serviceRoleKey}`,
    "content-type": "application/json",
  };
}

function clampLimit(value: number, fallback = 6) {
  if (!Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return Math.min(Math.floor(value), 20);
}

function createSnapshotSelect(limit: number) {
  return `${SIGNAL_SNAPSHOTS_SELECT}&order=refreshed_at.desc&limit=${limit}`;
}

export async function fetchRecentSignalSnapshots(limit = 6): Promise<SignalSnapshotRow[]> {
  const { url, serviceRoleKey } = getSupabaseConfig();

  if (!url || !serviceRoleKey) {
    return [];
  }

  const safeLimit = clampLimit(limit);

  try {
    const response = await fetch(
      `${url.replace(/\/$/, "")}/rest/v1/signal_snapshots?select=${encodeURIComponent(
        createSnapshotSelect(safeLimit),
      )}`,
      {
        method: "GET",
        headers: buildSupabaseHeaders(serviceRoleKey),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as unknown;
    if (!Array.isArray(data)) {
      return [];
    }

    return data.filter(isSignalSnapshotRow);
  } catch {
    return [];
  }
}

export async function persistSignalSnapshots(signals: Signal[], refreshedAt: string): Promise<void> {
  const { url, serviceRoleKey } = getSupabaseConfig();

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
        ...buildSupabaseHeaders(serviceRoleKey),
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

function isSignalSnapshotRow(value: unknown): value is SignalSnapshotRow {
  if (!value || typeof value !== "object") {
    return false;
  }

  const row = value as Record<string, unknown>;

  return (
    typeof row.refreshed_at === "string" &&
    typeof row.source === "string" &&
    typeof row.title === "string" &&
    typeof row.category === "string" &&
    typeof row.score === "number"
  );
}
