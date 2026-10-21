'use client';

import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  supabaseAnonKey,
  supabaseUrl,
} from './supabaseConfig';

/**
 * Browser-side Supabase client.
 *
 * Used by the staff sign-in form. `createBrowserClient` throws when it runs
 * outside a browser runtime, so this module is marked `'use client'` — that
 * keeps the server from ever evaluating `createBrowserClient` at import time.
 *
 * The session is persisted in a cookie (not `localStorage`) so the server
 * components and the route guard can read the same session. The cookie name
 * and options come from `./supabaseConfig` and are shared with the server
 * client, which is what makes a browser sign-in visible to the server.
 */
export const supabaseBrowser = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
  cookieOptions: {
    ...SESSION_COOKIE_OPTIONS,
    name: SESSION_COOKIE_NAME,
  },
});
