import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookieName, isValidSessionToken } from "@/lib/session";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(getSessionCookieName())?.value;

  if (!isValidSessionToken(token)) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
