import { NextRequest, NextResponse } from "next/server";

// Lightweight edge check: only lets requests with a session cookie through to
// /admin. This is NOT the real authorization boundary — every admin page and
// every admin API route independently calls requireAdmin() on the server
// (Node runtime) to verify the JWT and confirm role === "ADMIN" before doing
// anything. This middleware just avoids an unnecessary render for obviously
// logged-out visitors.
export function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin") && req.nextUrl.pathname !== "/admin/login";
  if (!isAdminRoute) return NextResponse.next();

  const hasSession = req.cookies.has("kids_store_session");
  if (!hasSession) {
    const loginUrl = new URL("/admin/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
