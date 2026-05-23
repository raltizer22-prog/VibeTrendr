import { NextResponse } from "next/server";
import { refreshSignals } from "../../../lib/signals";

export async function POST() {
  const signals = await refreshSignals();

  return NextResponse.json({
    ok: true,
    refreshedAt: new Date().toISOString(),
    count: signals.length,
  });
}
