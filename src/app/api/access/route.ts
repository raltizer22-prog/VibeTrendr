import { NextResponse } from "next/server";

const PAID_COOKIE = "vibetrendr_paid";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(PAID_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: THIRTY_DAYS,
  });

  return response;
}
