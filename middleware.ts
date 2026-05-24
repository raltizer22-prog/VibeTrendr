import { NextRequest, NextResponse } from "next/server";

const PAID_COOKIE = "vibetrendr_paid";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const paidAccess = request.cookies.get(PAID_COOKIE)?.value === "1";

  if (pathname === "/app" || pathname.startsWith("/app/")) {
    if (paidAccess) {
      return NextResponse.next();
    }

    const redirectUrl = new URL("/pricing", request.url);
    redirectUrl.searchParams.set("next", pathname + request.nextUrl.search);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app", "/app/:path*"],
};
