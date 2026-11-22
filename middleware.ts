import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_FILE = /\.[a-zA-Z0-9]+$/;

function detectLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookie && isLocale(cookie)) return cookie;
  const header = request.headers.get("accept-language") ?? "";
  return header.toLowerCase().startsWith("en") ? "en" : "ar";
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const { response, user, configured } = await updateSession(request);
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    const isLogin = pathname === "/admin/login";
    const isSetup = pathname === "/admin/setup";
    if (!configured) return response;
    if (user && (isLogin || isSetup)) {
      // setup page itself will redirect to /admin if already owner/claimed; allow reachability
      // but prefer redirecting logged-in users away from login
      if (isLogin) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin";
        return NextResponse.redirect(url);
      }
      return response;
    }
    if (!user && !isLogin && !isSetup) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    return response;
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/")[1];
  if (isLocale(firstSegment)) return NextResponse.next();

  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)", "/admin/:path*"],
};