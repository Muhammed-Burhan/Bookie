import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_REQUIRED = ['/rating', '/suggestions', '/profile/me'];
const ADMIN_REQUIRED = ['/admin'];
const GUEST_ONLY = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'];

function getToken(request: NextRequest): string | null {
  // Zustand persist stores JSON in localStorage — not accessible in middleware.
  // We mirror the token in a cookie (set by the auth store) for SSR/middleware reads.
  return request.cookies.get('bookie-token')?.value ?? null;
}

function getRole(request: NextRequest): string | null {
  return request.cookies.get('bookie-role')?.value ?? null;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = getToken(request);
  const role = getRole(request);

  // Redirect authenticated users away from guest-only pages
  if (GUEST_ONLY.some((p) => pathname.startsWith(p)) && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users away from auth-required pages
  if (AUTH_REQUIRED.some((p) => pathname.startsWith(p)) && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect non-admins away from admin pages
  if (ADMIN_REQUIRED.some((p) => pathname.startsWith(p))) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/rating/:path*',
    '/suggestions',
    '/profile/me',
    '/admin/:path*',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
  ],
};
