import { NextResponse, type NextRequest } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookieOptions,
  createAdminSession,
} from '@/lib/adminSession';

/**
 * Sign-in for the admin/staff ERP portals.
 *
 * Credentials come from environment variables, never from source:
 *   - `ADMIN_EMAIL` / `ADMIN_PASSWORD`  grant the `admin` role
 *   - `STAFF_EMAIL` / `STAFF_PASSWORD`  grant the `staff` role (optional)
 *
 * On success a signed, HttpOnly, Secure, SameSite=Lax session cookie is set.
 * On failure we return a generic 401 so we never disclose whether the email or
 * the password was the part that was wrong.
 *
 * Comparison uses a constant-time helper to avoid a timing side-channel.
 */

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

function matchCredentials(
  inputEmail: string,
  inputPassword: string,
  envEmail: string | undefined,
  envPassword: string | undefined
): boolean {
  if (!envEmail || !envPassword) return false;
  return (
    safeEqual(inputEmail, envEmail) && safeEqual(inputPassword, envPassword)
  );
}

export async function POST(request: NextRequest) {
  // A configured secret is mandatory: without it we refuse to mint sessions,
  // so a misconfigured deploy cannot be brute-forced into a working login.
  if (!process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json(
      { error: 'Authentication is not configured.' },
      { status: 503 }
    );
  }

  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid request body.' },
      { status: 400 }
    );
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required.' },
      { status: 400 }
    );
  }

  let role: 'admin' | 'staff' | null = null;

  if (matchCredentials(email, password, process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD)) {
    role = 'admin';
  } else if (
    matchCredentials(email, password, process.env.STAFF_EMAIL, process.env.STAFF_PASSWORD)
  ) {
    role = 'staff';
  }

  if (!role) {
    return NextResponse.json(
      { error: 'Invalid email or password.' },
      { status: 401 }
    );
  }

  const value = createAdminSession(role);
  if (!value) {
    return NextResponse.json(
      { error: 'Authentication is not configured.' },
      { status: 503 }
    );
  }

  const response = NextResponse.json({
    success: true,
    role,
  });

  response.cookies.set(ADMIN_SESSION_COOKIE, value, adminSessionCookieOptions());

  return response;
}
