import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  supabaseAnonKey,
  supabaseUrl,
} from '@/lib/supabaseConfig';

/**
 * Auth guard for the staff-only surfaces.
 *
 * This is Next.js 16's `proxy` file (the successor to `middleware.ts`).
 * Next.js 16 runs it on the Node.js runtime, and route segment config is not
 * allowed inside it.
 *
 * The guard covers two things:
 *   - `/trade-desk` — the inquiry ledger, which exposes buyer names,
 *     company names and GSTINs.
 *   - `GET /api/rfq` — the JSON feed of the same rows.
 *
 * `POST /api/rfq` is deliberately NOT guarded: that is the public path
 * anonymous buyers use to submit an inquiry, and the RLS policy for it
 * allows exactly that.
 *
 * The check is deliberately duplicated inside the `/trade-desk` page and the
 * `GET /api/rfq` handler. A matcher typo or a future edit to this file would
 * otherwise be enough to expose buyer data, and the page/handler checks fail
 * closed if this guard is ever bypassed.
 */

/** Where an unauthenticated visitor is sent. */
const LOGIN_PATH = '/login';

/** A cookie the Auth client wants to write back to the browser. */
interface PendingCookie {
  name: string;
  value: string;
  options?: Record<string, unknown>;
}

/**
 * Build a Supabase client bound to *this* request's cookies.
 *
 * The proxy cannot use the `next/headers` `cookies()` API: the proxy runs
 * outside a request work store, so `cookies()` throws there. The request
 * object carries its own cookie jar instead, and that is what the client is
 * bound to.
 *
 * Any refreshed token the Auth client produces is captured in `pending` and
 * written onto the outgoing response, so a session that rolls over during a
 * guarded request stays signed in.
 */
function createRequestScopedClient(
  request: NextRequest,
  pending: PendingCookie[]
) {
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          pending.push(cookie as PendingCookie);
        }
      },
    },
    cookieOptions: {
      ...SESSION_COOKIE_OPTIONS,
      name: SESSION_COOKIE_NAME,
    },
    global: {
      fetch: (input, init = {}) => {
        const headers = new Headers(init.headers);
        headers.set('cache-control', 'no-store');
        return fetch(input, { ...init, headers, cache: 'no-store' });
      },
    },
  });
}

/**
 * Verify the session and decide whether it belongs to a staff member.
 *
 * `getClaims()` validates the access token's signature against the Auth
 * server's signing key and returns the *verified* claims. The staff flag is
 * read from those claims, so it cannot be forged by editing the cookie.
 */
async function isStaffRequest(
  request: NextRequest,
  pending: PendingCookie[]
): Promise<boolean> {
  const supabase = createRequestScopedClient(request, pending);

  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) return false;

  const appMetadata = (data.claims as { app_metadata?: { staff?: unknown } })
    .app_metadata;

  return appMetadata?.staff === true;
}

/**
 * Translate the Auth client's cookie options into the shape
 * `ResponseCookies.set` expects, dropping anything it does not understand.
 */
function toResponseCookieOptions(
  options?: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  if (!options) return result;

  if (typeof options.path === 'string') result.path = options.path;
  if (typeof options.domain === 'string') result.domain = options.domain;
  if (typeof options.maxAge === 'number') result.maxAge = options.maxAge;
  if (typeof options.httpOnly === 'boolean') result.httpOnly = options.httpOnly;
  if (typeof options.secure === 'boolean') result.secure = options.secure;
  if (typeof options.sameSite === 'string') result.sameSite = options.sameSite;

  if (options.expires !== undefined) {
    const expires =
      options.expires instanceof Date
        ? options.expires
        : new Date(String(options.expires));
    if (!Number.isNaN(expires.getTime())) {
      result.expires = expires;
    }
  }

  return result;
}

/** Write any refreshed cookies onto the outgoing response. */
function applyPendingCookies(
  response: NextResponse,
  pending: PendingCookie[]
): NextResponse {
  for (const { name, value, options } of pending) {
    response.cookies.set(name, value, toResponseCookieOptions(options));
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isRfqApi = pathname === '/api/rfq';
  // `/api/rfq` accepts POST from the public RFQ form — only guard the read.
  const isRfqApiRead =
    isRfqApi && (request.method === 'GET' || request.method === 'HEAD');
  const isTradeDesk =
    pathname === '/trade-desk' || pathname.startsWith('/trade-desk/');

  if (!isRfqApiRead && !isTradeDesk) {
    return NextResponse.next();
  }

  const pending: PendingCookie[] = [];

  let staff = false;
  try {
    staff = await isStaffRequest(request, pending);
  } catch (error) {
    // Fail closed: an unexpected error must not unlock the ledger.
    console.error('[proxy] staff check failed:', error);
    staff = false;
  }

  if (!staff) {
    if (isRfqApi) {
      // An API client gets a 401, not a redirect to a login page.
      return applyPendingCookies(
        NextResponse.json({ error: 'Authentication required' }, { status: 401 }),
        pending
      );
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.search = '';
    // Remember where they were headed so login can bounce them back.
    loginUrl.searchParams.set('next', `${pathname}${search}`);

    return applyPendingCookies(NextResponse.redirect(loginUrl), pending);
  }

  return applyPendingCookies(NextResponse.next(), pending);
}

export const config = {
  matcher: ['/trade-desk/:path*', '/api/rfq'],
};
