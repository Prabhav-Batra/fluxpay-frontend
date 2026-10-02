import { NextResponse, type NextRequest } from 'next/server';

const SESSION_COOKIE = 'SESSION';

/**
 * Returns the login URL for a protected path when there is no session cookie, else null.
 * This is only a fast first gate; the AuthGuard confirms the session with `/auth/me`.
 */
export function loginRedirectFor(pathname: string, search: string, hasSession: boolean) {
  if (hasSession) return null;
  return `/login?next=${encodeURIComponent(pathname + search)}`;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const target = loginRedirectFor(pathname, search, request.cookies.has(SESSION_COOKIE));
  return target ? NextResponse.redirect(new URL(target, request.url)) : NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*', '/admin/:path*'] };
