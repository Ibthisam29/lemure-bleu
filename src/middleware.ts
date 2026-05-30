import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      if (process.env.NODE_ENV === "production") {
        return new NextResponse("Admin access not configured. Set ADMIN_PASSWORD env var.", { status: 403 });
      }
      return NextResponse.next();
    }

    const auth = request.headers.get("authorization");
    const credentials = `admin:${adminPassword}`;
    const encoded = btoa(credentials);
    const expected = `Basic ${encoded}`;

    if (auth !== expected) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Lemure Blue Admin", charset="UTF-8"',
        },
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
