import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Auth is enforced in the client AuthProvider + dashboard layout.
 * Cookie-based middleware redirects caused a login ↔ dashboard loop when
 * document/API cookies and localStorage JWT were briefly out of sync.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
