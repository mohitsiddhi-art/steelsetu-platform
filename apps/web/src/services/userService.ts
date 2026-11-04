import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { Database, Json } from '@/types/supabase';
import {
  PortalInquiry,
  SavedSearch,
  SupportTicket,
  UserProfile,
  WishlistItem,
} from '@/types/platform';

/**
 * User-portal data access.
 *
 * Everything here reads or writes a table that is scoped to the signed-in
 * user by RLS — `user_profiles`, `wishlist`, `saved_searches`, `inquiries` and
 * `support_tickets`. Those policies resolve the owner through
 * `user_profiles.user_id = auth.uid()`, so the anon key is never used to
 * bypass anything: the server client sends the signed-in user's own JWT, and
 * the database decides which rows that JWT may touch.
 *
 * The one thing this module cannot do is create the profile row, because the
 * row is created as part of the sign-up itself (see `portalAuthActions.ts`).
 */

type ProfileRow = Database['public']['Tables']['user_profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['user_profiles']['Update'];
type WishlistRow = Database['public']['Tables']['wishlist']['Row'];
type SearchRow = Database['public']['Tables']['saved_searches']['Row'];
type InquiryRow = Database['public']['Tables']['inquiries']['Row'];
type TicketRow = Database['public']['Tables']['support_tickets']['Row'];

const str = (v: string | null | undefined): string | undefined =>
  v === null || v === undefined || v === '' ? undefined : v;

/** Map a `user_profiles` row onto the app's `UserProfile` shape. */
function toProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    userId: row.user_id,
    firstName: row.first_name,
    lastName: str(row.last_name),
    email: str(row.email),
    role: row.role === 'seller' ? 'seller' : 'buyer',
    phone: str(row.phone),
    company: str(row.company),
    companyType: str(row.company_type),
    gstin: str(row.gstin),
    city: str(row.city),
    avatarUrl: str(row.avatar_url),
    locale: row.locale || 'en',
    createdAt: row.created_at,
  };
}

function toWishlist(row: WishlistRow): WishlistItem {
  return {
    id: row.id,
    userId: row.user_id,
    productId: row.product_id,
    createdAt: row.created_at,
  };
}

function toSavedSearch(row: SearchRow): SavedSearch {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    query: (row.query ?? {}) as Record<string, unknown>,
    alertFrequency:
      row.alert_frequency === 'daily' || row.alert_frequency === 'weekly'
        ? row.alert_frequency
        : 'none',
    createdAt: row.created_at,
  };
}

function toInquiry(row: InquiryRow): PortalInquiry {
  return {
    id: row.id,
    referenceId: row.reference_id,
    productName: str(row.product_name),
    buyerName: row.buyer_name,
    companyName: str(row.company_name),
    quantityTons:
      row.quantity_tons === null ? undefined : Number(row.quantity_tons),
    message: str(row.message),
    status:
      row.status === 'quoted' || row.status === 'closed'
        ? row.status
        : 'submitted',
    createdAt: row.created_at,
  };
}

function toTicket(row: TicketRow): SupportTicket {
  return {
    id: row.id,
    ticketRef: row.ticket_ref,
    subject: row.subject,
    category: row.category,
    priority:
      row.priority === 'low' || row.priority === 'high' || row.priority === 'urgent'
        ? row.priority
        : 'normal',
    status:
      row.status === 'in_progress' ||
      row.status === 'resolved' ||
      row.status === 'closed'
        ? row.status
        : 'open',
    message: row.message,
    createdAt: row.created_at,
  };
}

// ===========================================================================
// Profile
// ===========================================================================

/**
 * The signed-in user's profile, or `null` when nobody is signed in.
 *
 * Returns `null` rather than throwing on a bad session: an expired or
 * tampered session is an ordinary "not signed in" case, not a server error.
 */
export async function getCurrentProfile(): Promise<UserProfile | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;

  const userId = data.claims.sub;
  const email = typeof data.claims.email === 'string' ? data.claims.email : null;

  const { data: rows, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (profileError) {
    console.error('[userService] getCurrentProfile failed:', profileError.message);
    return null;
  }

  if (!rows) {
    // The account exists in Auth but has no profile row yet — this happens for
    // accounts created before the portal shipped, and for staff accounts
    // provisioned directly in `auth.users`. Rather than showing an empty
    // dashboard, seed a minimal profile from the verified token's claims.
    return await createProfileForUser(userId, email, 'buyer');
  }

  return toProfile(rows);
}

/**
 * Create the profile row for a freshly signed-up user.
 *
 * The `user_id` is the `auth.users.id`; the returned `id` is the uuid that
 * every child table points at. Both are needed: `user_profiles.id` is the
 * foreign key target for wishlists, inquiries and tickets, while
 * `user_profiles.user_id` is what the RLS policies compare against
 * `auth.uid()`.
 */
export async function createProfileForUser(
  userId: string,
  email: string | null,
  role: 'buyer' | 'seller',
  extra?: { firstName?: string; lastName?: string }
): Promise<UserProfile | null> {
  const supabase = await createSupabaseServerClient();

  const defaultFirstName = email ? email.split('@')[0] : 'Steel Trader';
  const formattedName = defaultFirstName.charAt(0).toUpperCase() + defaultFirstName.slice(1);

  const { data, error } = await supabase
    .from('user_profiles')
    .insert({
      user_id: userId,
      first_name: extra?.firstName || formattedName,
      last_name: extra?.lastName ?? null,
      email,
      role,
      locale: 'en',
    })
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('[userService] createProfileForUser failed:', error.message);
    return null;
  }

  return data ? toProfile(data) : null;
}

/**
 * Update the signed-in user's profile.
 *
 * Only the fields a user is allowed to change are written — `user_id` and
 * `id` are never part of the update, so a tampered payload cannot re-point a
 * profile at a different auth account.
 */
export async function updateProfile(
  profileId: string,
  patch: Partial<
    Pick<
      UserProfile,
      'firstName' | 'lastName' | 'phone' | 'company' | 'companyType' | 'gstin' | 'city' | 'locale'
    >
  >
): Promise<UserProfile | null> {
  const supabase = await createSupabaseServerClient();

  const row: ProfileUpdate = { updated_at: new Date().toISOString() };
  if (patch.firstName !== undefined) row.first_name = patch.firstName;
  if (patch.lastName !== undefined) row.last_name = patch.lastName;
  if (patch.phone !== undefined) row.phone = patch.phone;
  if (patch.company !== undefined) row.company = patch.company;
  if (patch.companyType !== undefined) row.company_type = patch.companyType;
  if (patch.gstin !== undefined) row.gstin = patch.gstin;
  if (patch.city !== undefined) row.city = patch.city;
  if (patch.locale !== undefined) row.locale = patch.locale;

  const { data, error } = await supabase
    .from('user_profiles')
    .update(row)
    .eq('id', profileId)
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('[userService] updateProfile failed:', error.message);
    return null;
  }

  return data ? toProfile(data) : null;
}

// ===========================================================================
// Wishlist
// ===========================================================================

/** Every saved product on the signed-in user's wishlist, newest first. */
export async function getWishlist(): Promise<WishlistItem[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('wishlist')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[userService] getWishlist failed:', error.message);
    return [];
  }

  return (data ?? []).map(toWishlist);
}

/** Add a product to the wishlist. Re-adding the same product is a no-op. */
export async function addToWishlist(
  profileId: string,
  productId: string
): Promise<boolean> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('wishlist')
    .insert({ user_id: profileId, product_id: productId });

  if (error) {
    // A duplicate key is a successful outcome, not a failure.
    if (error.code === '23505') return true;
    console.error('[userService] addToWishlist failed:', error.message);
    return false;
  }

  return true;
}

/** Remove a product from the wishlist. */
export async function removeFromWishlist(
  profileId: string,
  productId: string
): Promise<boolean> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', profileId)
    .eq('product_id', productId);

  if (error) {
    console.error('[userService] removeFromWishlist failed:', error.message);
    return false;
  }

  return true;
}

// ===========================================================================
// Saved searches
// ===========================================================================

/** Every saved search, newest first. */
export async function getSavedSearches(): Promise<SavedSearch[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('saved_searches')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[userService] getSavedSearches failed:', error.message);
    return [];
  }

  return (data ?? []).map(toSavedSearch);
}

/** Save a search with an optional price-alert frequency. */
export async function createSavedSearch(
  profileId: string,
  name: string,
  query: Record<string, Json | undefined>,
  alertFrequency: 'none' | 'daily' | 'weekly' = 'none'
): Promise<SavedSearch | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('saved_searches')
    .insert({
      user_id: profileId,
      name,
      query,
      alert_frequency: alertFrequency,
    })
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('[userService] createSavedSearch failed:', error.message);
    return null;
  }

  return data ? toSavedSearch(data) : null;
}

/** Delete a saved search. */
export async function deleteSavedSearch(
  profileId: string,
  searchId: string
): Promise<boolean> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('saved_searches')
    .delete()
    .eq('id', searchId)
    .eq('user_id', profileId);

  if (error) {
    console.error('[userService] deleteSavedSearch failed:', error.message);
    return false;
  }

  return true;
}

// ===========================================================================
// Inquiries
// ===========================================================================

/** Every inquiry raised by the signed-in user, newest first. */
export async function getInquiries(): Promise<PortalInquiry[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[userService] getInquiries failed:', error.message);
    return [];
  }

  return (data ?? []).map(toInquiry);
}

/**
 * Raise an inquiry from the portal.
 *
 * The reference id is generated here rather than by the database so the buyer
 * sees a human-quotable code the moment the row is created, and the unique
 * constraint on `reference_id` still protects against a collision.
 */
export async function createInquiry(
  profileId: string,
  input: {
    buyerName: string;
    companyName?: string;
    phone?: string;
    email?: string;
    productId?: string;
    productName?: string;
    quantityTons?: number;
    message?: string;
  }
): Promise<PortalInquiry | null> {
  const supabase = await createSupabaseServerClient();

  const referenceId = buildReferenceId('SS');

  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      reference_id: referenceId,
      user_id: profileId,
      buyer_name: input.buyerName,
      company_name: input.companyName ?? null,
      phone: input.phone ?? null,
      email: input.email ?? null,
      product_id: input.productId ?? null,
      product_name: input.productName ?? null,
      quantity_tons: input.quantityTons ?? null,
      message: input.message ?? null,
      status: 'submitted',
    })
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('[userService] createInquiry failed:', error.message);
    return null;
  }

  return data ? toInquiry(data) : null;
}

// ===========================================================================
// Support tickets
// ===========================================================================

/** Every support ticket raised by the signed-in user, newest first. */
export async function getSupportTickets(): Promise<SupportTicket[]> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('support_tickets')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[userService] getSupportTickets failed:', error.message);
    return [];
  }

  return (data ?? []).map(toTicket);
}

/** Raise a support ticket. */
export async function createSupportTicket(
  profileId: string,
  input: {
    subject: string;
    message: string;
    category?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
  }
): Promise<SupportTicket | null> {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from('support_tickets')
    .insert({
      ticket_ref: buildReferenceId('TK'),
      user_id: profileId,
      subject: input.subject,
      category: input.category ?? 'general',
      priority: input.priority ?? 'normal',
      status: 'open',
      message: input.message,
    })
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('[userService] createSupportTicket failed:', error.message);
    return null;
  }

  return data ? toTicket(data) : null;
}

// ===========================================================================
// Reference codes
// ===========================================================================

/**
 * Build a short, human-quotable reference like `SS-7K2M9`.
 *
 * The character set excludes `0/O` and `1/I/L` — these codes get read aloud
 * over the phone and typed into spreadsheets by hand, so the ambiguous
 * characters are a real source of errors.
 */
export function buildReferenceId(prefix: string): string {
  const alphabet = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  let body = '';
  for (let i = 0; i < 5; i += 1) {
    body += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${prefix}-${body}`;
}
