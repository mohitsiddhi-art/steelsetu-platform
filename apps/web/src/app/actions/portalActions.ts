'use server';

import { revalidatePath } from 'next/cache';
import {
  addToWishlist,
  createInquiry,
  createSavedSearch,
  createSupportTicket,
  deleteSavedSearch,
  getCurrentProfile,
  removeFromWishlist,
  updateProfile,
} from '@/services/userService';
import { addRfq } from '@/services/rfqService';
import { getProductById } from '@/services/catalogService';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import type { Json } from '@/types/supabase';

/**
 * Portal write actions.
 *
 * Every action here writes to a table whose RLS policy resolves the owner
 * through `user_profiles.user_id = auth.uid()`. The server client sends the
 * signed-in user's own JWT, so the database — not this code — decides which
 * rows the write may touch. That is why no action takes a `userId` from the
 * client: the owner is derived from the session, always.
 *
 * Each action returns a small result object rather than throwing, so the
 * form can render a bilingual message instead of a generic error boundary.
 */

export interface PortalActionResult {
  ok: boolean;
  /** A `ValidationKey`-style key the caller can translate. */
  message?: string;
  /** A human-readable id, e.g. the inquiry reference — shown on success. */
  reference?: string;
}

/**
 * The signed-in user's profile id, or `null` when nobody is signed in.
 *
 * `user_profiles.id` is the foreign key target for wishlists, inquiries and
 * tickets; `user_profiles.user_id` is the `auth.users.id` the RLS policies
 * compare against. The two are different ids and the distinction matters.
 */
async function currentProfileId(): Promise<string | null> {
  const profile = await getCurrentProfile();
  return profile ? profile.id : null;
}

// ===========================================================================
// Wishlist
// ===========================================================================

/** Save a product to the signed-in user's wishlist. */
export async function saveToWishlistAction(
  productId: string
): Promise<PortalActionResult> {
  const profileId = await currentProfileId();
  if (!profileId) return { ok: false, message: 'signInFailed' };

  const ok = await addToWishlist(profileId, productId);
  revalidatePath('/dashboard');

  return ok
    ? { ok: true }
    : { ok: false, message: 'actionFailed' };
}

/** Remove a product from the signed-in user's wishlist. */
export async function removeFromWishlistAction(
  productId: string
): Promise<PortalActionResult> {
  const profileId = await currentProfileId();
  if (!profileId) return { ok: false, message: 'signInFailed' };

  const ok = await removeFromWishlist(profileId, productId);
  revalidatePath('/dashboard');

  return ok ? { ok: true } : { ok: false, message: 'actionFailed' };
}

// ===========================================================================
// Inquiries
// ===========================================================================

export interface InquiryFormInput {
  buyerName: string;
  companyName?: string;
  phone?: string;
  email?: string;
  productId?: string;
  productName?: string;
  quantityTons?: number;
  message?: string;
}

/** Raise a quote request from the portal. */
export async function createInquiryAction(
  input: InquiryFormInput
): Promise<PortalActionResult> {
  const profileId = await currentProfileId();
  if (!profileId) return { ok: false, message: 'signInFailed' };

  if (!input.buyerName?.trim()) {
    return { ok: false, message: 'firstNameRequired' };
  }

  const inquiry = await createInquiry(profileId, {
    buyerName: input.buyerName.trim(),
    companyName: input.companyName?.trim() || undefined,
    phone: input.phone?.trim() || undefined,
    email: input.email?.trim() || undefined,
    productId: input.productId,
    productName: input.productName,
    quantityTons:
      input.quantityTons !== undefined && Number.isFinite(input.quantityTons)
        ? input.quantityTons
        : undefined,
    message: input.message?.trim() || undefined,
  });

  revalidatePath('/dashboard');

  return inquiry
    ? { ok: true, reference: inquiry.referenceId }
    : { ok: false, message: 'actionFailed' };
}

// ===========================================================================
// Support tickets
// ===========================================================================

export interface TicketFormInput {
  subject: string;
  message: string;
  category?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

/** Raise a support ticket from the portal. */
export async function createTicketAction(
  input: TicketFormInput
): Promise<PortalActionResult> {
  const profileId = await currentProfileId();
  if (!profileId) return { ok: false, message: 'signInFailed' };

  if (!input.subject?.trim()) {
    return { ok: false, message: 'subjectRequired' };
  }
  if (!input.message?.trim()) {
    return { ok: false, message: 'messageRequired' };
  }

  const ticket = await createSupportTicket(profileId, {
    subject: input.subject.trim(),
    message: input.message.trim(),
    category: input.category,
    priority: input.priority,
  });

  revalidatePath('/dashboard');

  return ticket
    ? { ok: true, reference: ticket.ticketRef }
    : { ok: false, message: 'actionFailed' };
}

// ===========================================================================
// Saved searches
// ===========================================================================

/** Save a search with an optional price-alert frequency. */
export async function createSavedSearchAction(
  name: string,
  query: Record<string, Json | undefined>,
  alertFrequency: 'none' | 'daily' | 'weekly' = 'none'
): Promise<PortalActionResult> {
  const profileId = await currentProfileId();
  if (!profileId) return { ok: false, message: 'signInFailed' };

  if (!name.trim()) {
    return { ok: false, message: 'searchNameRequired' };
  }

  const search = await createSavedSearch(
    profileId,
    name.trim(),
    query,
    alertFrequency
  );

  revalidatePath('/dashboard');

  return search ? { ok: true } : { ok: false, message: 'actionFailed' };
}

/** Delete a saved search. */
export async function deleteSavedSearchAction(
  searchId: string
): Promise<PortalActionResult> {
  const profileId = await currentProfileId();
  if (!profileId) return { ok: false, message: 'signInFailed' };

  const ok = await deleteSavedSearch(profileId, searchId);
  revalidatePath('/dashboard');

  return ok ? { ok: true } : { ok: false, message: 'actionFailed' };
}

// ===========================================================================
// Profile
// ===========================================================================

export interface ProfileFormInput {
  firstName: string;
  lastName?: string;
  phone?: string;
  company?: string;
  companyType?: string;
  gstin?: string;
  city?: string;
  locale?: 'en' | 'hi';
}

/** Save the signed-in user's profile details. */
export async function updateProfileAction(
  input: ProfileFormInput
): Promise<PortalActionResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { ok: false, message: 'signInFailed' };

  if (!input.firstName?.trim() || input.firstName.trim().length < 2) {
    return { ok: false, message: 'firstNameShort' };
  }

  const updated = await updateProfile(profile.id, {
    firstName: input.firstName.trim(),
    lastName: input.lastName?.trim() || undefined,
    phone: input.phone?.trim() || undefined,
    company: input.company?.trim() || undefined,
    companyType: input.companyType?.trim() || undefined,
    gstin: input.gstin?.trim().toUpperCase() || undefined,
    city: input.city?.trim() || undefined,
    locale: input.locale ?? (profile.locale === 'hi' ? 'hi' : 'en'),
  });

  revalidatePath('/dashboard');

  return updated ? { ok: true } : { ok: false, message: 'actionFailed' };
}

// ===========================================================================
// RFQs (the trade-desk pipeline request)
// ===========================================================================

export interface RfqFormInput {
  productId: string;
  tons: number;
  pincode: string;
  gstNumber: string;
}

/**
 * Raise a trade-desk RFQ from the portal.
 *
 * The request is written through the same `addRfq` path the public product
 * page uses, with the session's user id attached so the buyer's own "My
 * RFQs" list picks it up. The GSTIN and the tonnage are validated here as
 * well as in the API route, because the portal form is a different entry
 * point and the two must not drift apart.
 */
export async function createRfqAction(
  input: RfqFormInput
): Promise<PortalActionResult> {
  const profile = await getCurrentProfile();
  if (!profile) return { ok: false, message: 'signInFailed' };

  const gst = (input.gstNumber ?? '').trim().toUpperCase();
  if (gst.length !== 15) {
    return { ok: false, message: 'gstinInvalid' };
  }

  const tons = Number(input.tons);
  if (!Number.isFinite(tons) || tons <= 0) {
    return { ok: false, message: 'tonsInvalid' };
  }

  const product = await getProductById(input.productId);
  if (!product) {
    return { ok: false, message: 'unknownProduct' };
  }

  if (tons < product.minimumOrderTons) {
    return { ok: false, message: 'belowMoq' };
  }

  if (tons > product.inventoryTons) {
    return { ok: false, message: 'exceedsStock' };
  }

  const supabase = await createSupabaseServerClient();
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub ?? null;

  const reference = `RFQ-${Date.now().toString(36).toUpperCase()}`;

  const stored = await addRfq({
    referenceId: reference,
    buyerName: profile.firstName,
    companyName: profile.company ?? profile.firstName,
    gstNumber: gst,
    tons,
    productId: product.id,
    productName: product.name,
    pincode: String(input.pincode ?? '').trim(),
    customSpecs: null,
    status: 'PENDING',
    userId,
  });

  revalidatePath('/dashboard');

  return stored
    ? { ok: true, reference: stored.referenceId }
    : { ok: false, message: 'actionFailed' };
}
