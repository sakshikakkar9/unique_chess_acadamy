import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE = 'admin_session';
const LOGIN_PAGE = '/admin/login';
const DASHBOARD_PAGE = '/admin/dashboard';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE)?.value;

  const isLoginPage = pathname === LOGIN_PAGE;
  const isAdminRoute = pathname.startsWith('/admin');

  // Authenticated user visiting login page → send to dashboard
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL(DASHBOARD_PAGE, request.url));
  }

  // Unauthenticated user visiting any admin route → send to login
  if (isAdminRoute && !isLoginPage && !session) {
    const loginUrl = new URL(LOGIN_PAGE, request.url);
    loginUrl.searchParams.set('from', pathname); // preserve intended destination
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
