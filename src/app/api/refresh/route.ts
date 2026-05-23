import { NextResponse } from "next/server";
import { getSupabaseEnvStatus } from "../../../lib/supabase";
import { refreshSignals } from "../../../lib/signals";

export async function POST() {
  const cachedSignals = await refreshSignals();
  const supabaseStatus = getSupabaseEnvStatus();

  return NextResponse.json({
    ok: true,
    refreshedAt: cachedSignals.refreshedAt,
    count: cachedSignals.signals.length,
    supabaseReady: supabaseStatus.ready,
    missingEnv: supabaseStatus.missing,
  });
}
