import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Simplified middleware that runs at the edge.
 * Does NOT verify sessions (which requires crypto).
 * Session verification happens at the API/page layer.
 */

const PUBLIC_ROUTES = ["/", "/auth/error", "/auth/login", "/auth/signup", "/projects"];
const PROTECTED_PREFIXES = ["/student", "/company", "/reviewer", "/admin", "/dashboard"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get("next-auth.session-token") ||
                        req.cookies.get("__Secure-next-auth.session-token");

  // Public routes — always accessible
  if (PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Onboarding — allow any authenticated user
  if (pathname.startsWith("/onboarding")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Protected routes — require session, detailed checks happen server-side
  if (PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    if (!sessionCookie) {
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(new URL(`/?callbackUrl=${callbackUrl}`, req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)",
  ],
};
