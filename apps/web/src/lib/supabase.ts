import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

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

const supabaseUrl = normaliseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

/**
 * Browser-safe Supabase client.
 *
 * This is the *anonymous* client: it sends the publishable anon key as the
 * bearer token, so PostgREST evaluates every query as the `anon` role. That
 * is the right client for the public catalogue (`products` has a public
 * SELECT policy) and for public RFQ submissions (`rfq_inquiries` has a
 * public INSERT policy) — but it cannot read `rfq_inquiries`, whose SELECT
 * policy is staff-only. Staff reads go through `createSupabaseServerClient()`
 * in `./supabaseServer`, which binds the signed-in user's token instead.
 *
 * No service-role key is ever exposed to the client bundle.
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);

/**
 * Server-side Supabase client.
 *
 * Identical credentials, but every request is marked `no-store` so Next.js
 * never serves a stale catalogue from the full-route cache. Prices and stock
 * change with the market, so a cached response would be actively misleading.
 */
export const supabaseServer: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    global: {
      fetch: (input, init = {}) => {
        const headers = new Headers(init.headers);
        headers.set('cache-control', 'no-store');
        return fetch(input, { ...init, headers, cache: 'no-store' });
      },
    },
  }
);
