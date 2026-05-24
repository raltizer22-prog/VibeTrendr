import { NextRequest, NextResponse } from "next/server";

const PAID_COOKIE = "vibetrendr_paid";
const CREATOR_TOKEN = "AJp5wiGlpI6rhFHQ3t0FSdzclsXqvbR-ztXikG75spw";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

function resolveNextPath(value: string | null) {
  return value && value.startsWith("/") ? value : "/app";
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  if (token !== CREATOR_TOKEN) {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  const nextPath = resolveNextPath(request.nextUrl.searchParams.get("next"));
  const response = NextResponse.redirect(new URL(nextPath, request.url));

  response.cookies.set(PAID_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: THIRTY_DAYS,
  });

  return response;
}
