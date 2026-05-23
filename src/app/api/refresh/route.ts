import { NextResponse } from "next/server";
import { refreshSignals } from "../../../lib/signals";

export async function POST() {
  const cachedSignals = await refreshSignals();

  return NextResponse.json({
    ok: true,
    refreshedAt: cachedSignals.refreshedAt,
    count: cachedSignals.signals.length,
  });
}
