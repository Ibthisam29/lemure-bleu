import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const adminPassword = process.env.ADMIN_PASSWORD;

    // If no password set, skip auth in development only
    if (!adminPassword) {
      if (process.env.NODE_ENV === "production") {
        return new NextResponse("Admin access not configured", { status: 403 });
      }
      return NextResponse.next();
    }

    const auth = request.headers.get("authorization");
    const expected = `Basic ${Buffer.from(`admin:${adminPassword}`).toString("base64")}`;

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
