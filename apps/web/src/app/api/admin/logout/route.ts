import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE } from '@/lib/adminSession';

/**
 * Sign-out for the admin/staff ERP portals.
 *
 * Clears the session cookie by setting it with an empty value and a zero
 * (negative) maxAge so the browser drops it. Idempotent and safe to call when
 * no session exists.
 */
export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
