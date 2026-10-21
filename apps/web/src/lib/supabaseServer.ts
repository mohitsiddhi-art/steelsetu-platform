import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  supabaseAnonKey,
  supabaseUrl,
} from './supabaseConfig';

/**
 * A Supabase client bound to the current request's cookies.
 *
 * Always call this inside a Server Component, Server Action or Route Handler
 * and never cache the result — the client is tied to one request's cookie jar,
 * and sharing it across requests would leak one user's session into another's.
 *
 * The `getAll` / `setAll` pair is mandatory: `getAll` reads the incoming
 * session, and `setAll` writes refreshed tokens back so a session that was
 * silently rolling over does not get dropped.
 *
 * The client sends the signed-in user's access token as the `Authorization`
 * bearer, so PostgREST evaluates the request as the `authenticated` role and
 * the `rfq_inquiries` RLS policies apply. That is why the trade desk can read
 * the inquiry ledger with the anon key alone — no service-role key is involved
 * anywhere in this file.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // `cookies()` is read-only outside a Server Action / Route Handler.
          // Swallowing this keeps a read-only render working; the session
          // simply isn't refreshed on that path, which is safe — the next
          // action, route handler or proxy pass will do it.
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
