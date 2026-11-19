import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Cookie-based admin/staff session for the ERP portals.
 *
 * The cookie value is a compact, signed payload:
 *   `<role>.<expiry>.<hmac-sha256>`
 * where the HMAC is computed over `<role>.<expiry>` with `ADMIN_SESSION_SECRET`.
 *
 * Because the payload is signed, a visitor who edits the cookie cannot forge
 * a role or extend the expiry — both fail signature verification. We verify
 * with `timingSafeEqual` so a length/timing oracle is not available.
 */

export const ADMIN_SESSION_COOKIE = 'steelsetu_admin_session';

const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

/**
 * Compute the expected signature for a `<role>.<expiry>` payload.
 * The secret is required — we fail closed (return null) when it is absent.
 */
function signPayload(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function constantTimeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/**
 * Mint a session cookie value for a role, valid until `ttlMs` from now.
 * Returns `null` when no secret is configured — callers must treat that as
 * "authentication unavailable" and fail closed rather than open.
 */
export function createAdminSession(role: 'admin' | 'staff'): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;

  const expiry = Date.now() + SESSION_TTL_MS;
  const payload = `${role}.${expiry}`;
  return `${payload}.${signPayload(payload, secret)}`;
}

/**
 * Parse and verify a session cookie value.
 * Returns the role when the signature is valid and the session is unexpired,
 * otherwise `null`.
 */
export function verifyAdminSession(
  cookie: string | undefined,
): 'admin' | 'staff' | null {
  if (!cookie) return null;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;

  const [role, expiryRaw, sig] = cookie.split('.');
  if (role !== 'admin' && role !== 'staff') return null;

  const expiry = Number(expiryRaw);
  if (!Number.isFinite(expiry)) return null;

  const payload = `${role}.${expiryRaw}`;
  const expected = signPayload(payload, secret);

  // Same-length inputs (both base64url hmac-sha256) so timingSafeEqual is safe.
  if (!constantTimeEqual(sig ?? '', expected)) return null;

  if (Date.now() > expiry) return null;

  return role;
}

/**
 * The expected cookie options. `Secure` is always on (the site is served over
 * HTTPS on Vercel); `SameSite=Lax` blocks cross-site subresource CSRF while
 * still allowing top-level navigations.
 */
export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  };
}
