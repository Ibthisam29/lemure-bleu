import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

function checkAuth(request: NextRequest): NextResponse | null {
  const adminPassword = process.env.ADMIN_PASSWORD;

  // No password set — block in production, allow in dev
  if (!adminPassword) {
    if (process.env.NODE_ENV === "production") {
      return new NextResponse("Admin not configured.", { status: 403 });
    }
    return null; // allow in dev
  }

  const auth = request.headers.get("authorization") || "";
  const expected = `Basic ${btoa(`admin:${adminPassword}`)}`;

  if (auth !== expected) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Lemure Bleu Admin", charset="UTF-8"' },
    });
  }
  return null; // authenticated
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect both /admin pages AND /api/admin/* routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const authError = checkAuth(request);
    if (authError) return authError;
  }

  // Rate-limit public form APIs — block missing Content-Type (bot check)
  if (
    pathname.startsWith("/api/vip-register") ||
    pathname.startsWith("/api/appointment") ||
    pathname.startsWith("/api/preorder-interest") ||
    pathname.startsWith("/api/partner-register") ||
    pathname.startsWith("/api/waitlist-register")
  ) {
    const ct = request.headers.get("content-type") || "";
    if (request.method === "POST" && !ct.includes("application/json")) {
      return new NextResponse("Bad Request", { status: 400 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/api/vip-register",
    "/api/appointment",
    "/api/preorder-interest",
    "/api/partner-register",
    "/api/waitlist-register",
  ],
};
