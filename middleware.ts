import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  CRAWL_NOINDEX_VALUE,
  isRscFlightRequest,
} from "@/lib/crawl";
import { constantTimeEqual } from "@/lib/crypto-safe";

/**
 * SEO FIX: Redirect homepage pagination URLs (e.g. `/?page=4`) to `/`.
 *
 * The homepage no longer uses pagination, but Google still crawls stale
 * `/?page=N` URLs from an older version of the site (HomeFeaturedGamesSection).
 * This caused "Alternate page with proper canonical tag" warnings in
 * Google Search Console. A 301 redirect tells Google these URLs are
 * permanently gone and consolidates crawl signals on the canonical `/`.
 */
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (pathname === "/" && searchParams.has("page")) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("page");
    url.search = url.searchParams.toString()
      ? `?${url.searchParams.toString()}`
      : "";
    return NextResponse.redirect(url, 301);
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const secret = process.env.ADMIN_ANALYTICS_SECRET;
    const cookieVal = request.cookies.get("admin_analytics_auth")?.value ?? "";
    if (!secret || !constantTimeEqual(cookieVal, secret)) {
      const login = request.nextUrl.clone();
      login.pathname = "/admin/login";
      login.searchParams.set("next", pathname);
      return NextResponse.redirect(login);
    }
  }

  const response = NextResponse.next();

  // SEO: RSC flight payloads are not HTML documents — mark non-indexable so
  // Google spends less crawl budget on `?_rsc=` / `RSC: 1` framework requests.
  if (
    isRscFlightRequest(request) ||
    pathname.startsWith("/api/")
  ) {
    response.headers.set("X-Robots-Tag", CRAWL_NOINDEX_VALUE);
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/admin",
    "/admin/:path*",
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|images/|apple-icon|icon).*)",
  ],
};
