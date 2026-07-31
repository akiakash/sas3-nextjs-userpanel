import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const LOGIN_PATH = "/login";
const SESSION_COOKIE = "sas3_customer_session";

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname === LOGIN_PATH || pathname === "/register") return true;
  if (pathname.startsWith("/portfolio/")) return true;
  return false;
}

function isProtectedPath(pathname: string): boolean {
  if (pathname.startsWith("/dashboard")) return true;
  if (pathname === "/vehicles/auction" || pathname.startsWith("/vehicles/auction/")) {
    return true;
  }
  return false;
}

function isAuthenticated(request: NextRequest): boolean {
  return Boolean(request.cookies.get(SESSION_COOKIE)?.value);
}

function safeFromPath(pathname: string): string {
  if (!pathname.startsWith("/") || pathname.startsWith("//")) return "/dashboard";
  return pathname;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = isAuthenticated(request);

  if (pathname === LOGIN_PATH || pathname === "/register") {
    if (authed) {
      const from = request.nextUrl.searchParams.get("from");
      const target =
        from && from.startsWith("/") && !from.startsWith("//") ? from : "/dashboard";
      return NextResponse.redirect(new URL(target, request.url));
    }
    return NextResponse.next();
  }

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  if (isProtectedPath(pathname) && !authed) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("from", safeFromPath(pathname));
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
