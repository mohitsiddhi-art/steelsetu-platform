import type { CookieOptions } from '@supabase/ssr';

/**
 * Shared Supabase configuration and the session-cookie contract.
 *
 * This module deliberately has **no** `'use client'` directive and imports
 * nothing from `next/headers`, so it can be pulled into the browser bundle and
 * the server bundle alike. Keeping the cookie name and options in one place is
 * what makes the browser client and the server client agree on where the
 * session lives — if they disagreed, a sign-in would succeed in the browser
 * and then be invisible to the server, and every protected route would look
 * logged out.
 */

/**
 * Normalise the configured Supabase project URL.
 *
 * supabase-js appends `/rest/v1` itself, so a URL that already carries that
 * suffix produces a doubled path (`/rest/v1//rest/v1/products`) and PostgREST
 * rejects it with "Invalid path specified in request URL". The value has also
 * been seen wrapped in quotes in `.env.local`, so strip those too.
 */
function normaliseUrl(raw: string): string {
  let url = (raw ?? '').trim().replace(/^["']|["']$/g, '');
  url = url.replace(/\/rest\/v1\/?$/i, '');
  return url.replace(/\/+$/, '');
}

export const supabaseUrl = normaliseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || '');

export const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

/**
 * The name of the cookie the session lives in.
 *
 * It is set explicitly on both clients so the name does not depend on the
 * configured project URL — supabase-js would otherwise derive it from the
 * hostname (`sb-<project-ref>-auth-token`), which silently forks the session
 * if the URL is ever configured with a different spelling.
 */
export const SESSION_COOKIE_NAME = 'steelsetu-auth-token';

/**
 * Cookie options for the auth session.
 *
 * `httpOnly` is `false` on purpose, and it is not a shortcut. The session is
 * written by the *browser* during sign-in, and the only API a browser has for
 * writing a cookie is `document.cookie` — and the cookie spec requires
 * browsers to **ignore** any cookie that carries the `HttpOnly` attribute when
 * it is set from script. Setting `httpOnly: true` here would mean the sign-in
 * silently never persists at all.
 *
 * The session's security therefore does not rest on the cookie being opaque:
 * the server never trusts the cookie's *contents*. It verifies the access
 * token's signature with `getClaims()` and reads the staff flag from the
 * signed claims, and every read of the inquiry ledger is additionally gated
 * by an RLS policy that checks the same signed claim. A stolen cookie grants
 * exactly the access the victim had, and no more.
 *
 * `sameSite: 'lax'` keeps the session out of cross-site POSTs while still
 * allowing normal top-level navigation.
 *
 * Note that `@supabase/ssr` overrides `maxAge` with its own default when it
 * writes the cookie, so the effective lifetime of the *cookie* is longer than
 * this value. The effective lifetime of the *session* is not: the access token
 * inside it expires on the Auth server's schedule, and both the proxy and the
 * page guard verify that expiry on every request.
 */
export const SESSION_COOKIE_OPTIONS: CookieOptions = {
  path: '/',
  sameSite: 'lax',
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24,
};
