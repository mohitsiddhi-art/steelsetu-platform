import { SteelProduct } from '@/types/steel';
import { getProductWhatsAppUrl, hasWhatsAppNumber } from '@/lib/whatsapp';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  product: SteelProduct;
  /** `sm` for the catalogue card, `lg` for the product detail sidebar. */
  size?: 'sm' | 'lg';
  /** Overrides the default label. */
  label?: string;
  className?: string;
}

/**
 * "Chat on WhatsApp" link for a product.
 *
 * Opens a pre-filled WhatsApp chat with the trade desk, so a buyer can ask
 * for a bulk rate without filling in a form. Rendered as a plain anchor —
 * `wa.me` handles the hand-off to WhatsApp Web or the mobile app.
 */
export default function WhatsAppButton({
  product,
  size = 'sm',
  label,
  className = '',
}: WhatsAppButtonProps) {
  // Without a resolvable number the link would point nowhere useful, so
  // render nothing rather than a dead button.
  if (!hasWhatsAppNumber()) return null;

  const url = getProductWhatsAppUrl(product);
  const text = label ?? (size === 'lg' ? 'Inquire on WhatsApp' : 'WhatsApp');

  const sizing =
    size === 'lg'
      ? 'w-full py-3 text-sm'
      : 'px-3 py-2 text-xs';

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      title={`Chat on WhatsApp about ${product.name}`}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg bg-green-600 font-semibold text-white transition-colors hover:bg-green-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 ${sizing} ${className}`}
    >
      <MessageCircle className={size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />
      {text}
    </a>
  );
}
