import { supabaseServer } from '@/lib/supabase';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { Database } from '@/types/supabase';

/**
 * Trade desk inquiry data access.
 *
 * Inquiries live in the flat `rfq_inquiries` table (see
 * packages/database/migrations/README.md).
 *
 * The table has two policies, and they pull in opposite directions:
 *   - INSERT is allowed for `public`, so an anonymous buyer can submit an
 *     inquiry with nothing but the anon key.
 *   - SELECT is allowed only for staff (`auth.jwt() -> 'app_metadata' ->
 *     'staff'`), so the ledger cannot be read by an anonymous visitor.
 *
 * That asymmetry is the whole point, and it dictates the shape of the two
 * functions below:
 *
 *   - `getAllRfqs` must use a **session-bound** client. The plain anon client
 *     would arrive at PostgREST as the `anon` role and be refused by the
 *     staff-only SELECT policy, silently returning an empty ledger.
 *
 *   - `addRfq` must **not** ask for the inserted row back. A `.select()` turns
 *     the insert into `INSERT ... RETURNING`, which PostgREST serves under
 *     SELECT privilege — and the anon role has no SELECT policy on this
 *     table, so the insert would fail with an RLS error even though the
 *     insert itself is permitted. The caller already knows every field it
 *     wrote, so the stored record is echoed back from the request.
 *
 * `product_id` is a FK to `products(id)` ON DELETE SET NULL, so a deleted
 * product leaves the inquiry intact with a null product reference.
 */

export type RfqStatus = 'PENDING' | 'ALLOCATED' | 'REJECTED';

export interface StoredRFQ {
  referenceId: string;
  buyerName: string;
  companyName: string;
  gstNumber: string;
  tons: number;
  productId: string | null;
  productName: string | null;
  pincode: string;
  customSpecs: string | null;
  status: RfqStatus;
  timestamp: string;
  /** Where the request came from — `web` or `portal`. */
  source?: string;
  /** The signed-in buyer's `auth.users.id`, when the request came from the portal. */
  userId?: string | null;
}

/** Row shape as returned by the typed Supabase client. */
type RfqDbRow = Database['public']['Tables']['rfq_inquiries']['Row'];

function toRfq(row: RfqDbRow): StoredRFQ {
  return {
    referenceId: row.reference_id,
    buyerName: row.buyer_name,
    companyName: row.company_name,
    gstNumber: row.gst_number,
    tons: Number(row.tons) || 0,
    productId: row.product_id,
    productName: row.product_name,
    pincode: row.delivery_pincode,
    customSpecs: row.custom_specs,
    status: row.status as RfqStatus,
    timestamp: row.created_at ?? new Date().toISOString(),
    source: row.source ?? undefined,
    userId: row.user_id,
  };
}

/**
 * Every inquiry, newest first.
 *
 * Uses a session-bound client so PostgREST evaluates the query as the
 * signed-in `authenticated` role. Only a staff session clears the SELECT
 * policy, so this returns an empty list for anyone else — the caller is
 * expected to have checked the session already.
 */
export async function getAllRfqs(): Promise<StoredRFQ[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('rfq_inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    console.error('[rfqService] getAllRfqs failed:', error.message);
    return [];
  }

  return (data ?? []).map(toRfq);
}

/**
 * Persist a new inquiry.
 *
 * Public path — the anon key is enough, because the INSERT policy allows
 * `public`. No `.select()` is used on purpose; see the note at the top of
 * this file for why asking for the row back would break the insert.
 *
 * The optional `userId` is the signed-in buyer's `auth.users.id`. It is
 * never read from the request body: the caller resolves it from the
 * verified session claims and passes it in, so a caller cannot file a
 * request against somebody else's account. When it is present the row is
 * written with `source: 'portal'` and the owner-scoped SELECT policy
 * (migration 004) makes it visible in that buyer's "My RFQs".
 *
 * Returns the stored record so the caller can confirm what was logged.
 */
export async function addRfq(
  item: Omit<StoredRFQ, 'timestamp' | 'source' | 'userId'> & {
    timestamp?: string;
    source?: 'web' | 'portal';
    userId?: string | null;
  }
): Promise<StoredRFQ | null> {
  const timestamp = item.timestamp ?? new Date().toISOString();
  const source = item.userId ? 'portal' : (item.source ?? 'web');

  // The legacy payload — every column that existed before migration 004.
  const legacyRow = {
    reference_id: item.referenceId,
    buyer_name: item.buyerName,
    company_name: item.companyName,
    gst_number: item.gstNumber,
    product_id: item.productId,
    product_name: item.productName,
    tons: item.tons,
    delivery_pincode: item.pincode,
    custom_specs: item.customSpecs ?? null,
    status: item.status,
    created_at: timestamp,
  };

  // The owner-scoped payload. It is only accepted once migration 004 has
  // added the two columns.
  const ownerRow = {
    ...legacyRow,
    source,
    user_id: item.userId ?? null,
  };

  let { error } = await supabaseServer.from('rfq_inquiries').insert(ownerRow as any);

  // Migration 004 may not have been applied to the live database yet. The
  // public RFQ form must keep working regardless, so fall back to the
  // legacy payload — the request is still logged, it just cannot be linked
  // to a buyer account until the migration lands.
  if (error && isMissingOwnershipColumn(error)) {
    console.warn(
      '[rfqService] addRfq: owner columns unavailable, retrying without ownership'
    );
    const retry = await supabaseServer.from('rfq_inquiries').insert(legacyRow as any);
    error = retry.error;
  }

  if (error) {
    console.error('[rfqService] addRfq failed:', error.message);
    return null;
  }

  return {
    referenceId: item.referenceId,
    buyerName: item.buyerName,
    companyName: item.companyName,
    gstNumber: item.gstNumber,
    tons: item.tons,
    productId: item.productId,
    productName: item.productName,
    pincode: item.pincode,
    customSpecs: item.customSpecs ?? null,
    status: item.status,
    timestamp,
    source,
    userId: item.userId ?? null,
  };
}

/**
 * True when the insert failed because the ownership columns do not exist yet.
 *
 * Two different failures mean the same thing, and both have to be caught:
 *
 *   - Postgres raises `42703` (undefined_column) for a missing column, and
 *     PostgREST surfaces that code when the request reaches the database.
 *   - PostgREST validates the payload against its **schema cache** before
 *     the request ever reaches Postgres, and rejects an unknown column with
 *     `PGRST204` — "Could not find the 'source' column of 'rfq_inquiries' in
 *     the schema cache". This is the error that actually comes back while
 *     migration 004 is still pending, because the cache is populated from
 *     the live table definition and does not know about the new columns.
 *
 * Matching on the message as well as the code keeps the public RFQ form
 * working in both worlds.
 */
function isMissingOwnershipColumn(error: {
  code?: string;
  message?: string;
  details?: string;
}): boolean {
  if (error.code === '42703' || error.code === 'PGRST204') return true;

  const text = `${error.message ?? ''} ${error.details ?? ''}`;
  return (
    /column .*(user_id|source) .* does not exist/i.test(text) ||
    /could not find the '(user_id|source)' column/i.test(text)
  );
}

/**
 * The signed-in buyer's own requests, newest first.
 *
 * Migration 004 adds an owner-scoped SELECT policy
 * (`USING (user_id = auth.uid())`), so a session-bound client can read back
 * exactly the rows it owns and nothing else. The staff policy is OR'd with
 * it, so a staff session still sees everything — which is why this query
 * filters explicitly on `user_id` rather than relying on the policy alone.
 *
 * Returns an empty list when the buyer has raised nothing, and also when
 * migration 004 has not been applied yet (the column would not exist, so
 * the query errors and is swallowed here rather than crashing the page).
 */
export async function getMyRfqs(): Promise<StoredRFQ[]> {
  const supabase = await createSupabaseServerClient();

  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;
  if (!userId) return [];

  const { data, error } = await supabase
    .from('rfq_inquiries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    // The portal ownership columns are introduced by migration 004. Until the
    // user approves that additive migration, a buyer simply has no linked RFQ
    // history to show — it is an expected compatibility state, not a runtime
    // failure worth surfacing in the browser console.
    if (isMissingOwnershipColumn(error)) return [];

    console.error('[rfqService] getMyRfqs failed:', error.message);
    return [];
  }

  return (data ?? []).map(toRfq);
}
