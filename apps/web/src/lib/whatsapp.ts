import { SteelProduct } from '@/types/steel';
import { formatMm } from '@/lib/format';

/**
 * Fallback business number, used when `NEXT_PUBLIC_WHATSAPP_NUMBER` is not
 * set. This is the trade desk's WhatsApp line in international format —
 * country code first, no `+`, no spaces or dashes.
 */
export const DEFAULT_WHATSAPP_NUMBER = '919883051500';

/** The business name buyers are greeted with in the pre-filled message. */
export const BUSINESS_NAME = 'Singhi Enterprises';

/**
 * Resolve the WhatsApp number to link to.
 *
 * Reads `NEXT_PUBLIC_WHATSAPP_NUMBER` and falls back to
 * {@link DEFAULT_WHATSAPP_NUMBER}. The env value is normalised because
 * operators paste these as `+91 98765 43210`, `091-9876543210` and so on,
 * while `wa.me` only accepts bare digits with the country code.
 */
export function getWhatsAppNumber(): string {
  const raw = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '').trim();
  const source = raw || DEFAULT_WHATSAPP_NUMBER;

  // Drop the leading `00` international prefix, keep the country code.
  const digits = source.replace(/^00/, '').replace(/\D/g, '');

  // India writes international numbers with a trunk `0` — `091 98830 51500`.
  // `wa.me` wants the bare country code, so drop it.
  const normalised = digits.replace(/^0(?=91\d{10}$)/, '');

  // A bare 10-digit number is an Indian mobile — assume the +91 default.
  if (normalised.length === 10) return `91${normalised}`;

  return normalised;
}

/** True when a usable number resolved — a link with no digits is useless. */
export function hasWhatsAppNumber(): boolean {
  return getWhatsAppNumber().length > 0;
}

/**
 * Build a `https://wa.me/<number>?text=<message>` link.
 *
 * The message is URL-encoded, so it survives as a query parameter intact.
 */
export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/**
 * The pre-filled buyer message for a product enquiry.
 *
 * Mirrors the WhatsApp idiom of a one-line spec summary followed by the
 * actual ask, so the trade desk can quote straight off the message.
 */
export function buildProductMessage(product: SteelProduct): string {
  const parts = [
    `Hi ${BUSINESS_NAME}, I am interested in ${product.name}`,
    `(${[
      product.brand,
      `${formatMm(product.thicknessMm)}`,
      product.grade,
    ]
      .filter(Boolean)
      .join(', ')})`,
  ];

  return `${parts.join(' ')} Please share the best bulk rate for Burrabazar delivery.`;
}

/** The full WhatsApp deep link for a product, ready to drop into an anchor. */
export function getProductWhatsAppUrl(product: SteelProduct): string {
  return buildWhatsAppUrl(getWhatsAppNumber(), buildProductMessage(product));
}
