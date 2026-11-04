'use client';

import { useState } from 'react';
import { MessageCircle, Phone, Send } from 'lucide-react';
import { usePortalLang } from '@/components/portal/PortalLangProvider';
import { CHAT_COPY, FORM_COPY } from '@/lib/portalCopy';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

/**
 * The WhatsApp chat panel.
 *
 * SteelSetu does not run its own live-chat widget — the trade desk is a
 * WhatsApp line, and a buyer who wants an answer now wants to talk to a
 * person, not fill in another form. So this panel is a set of one-tap
 * deep links into WhatsApp, each pre-filled with a different ask.
 *
 * The number arrives as a prop from the server, so the link is built from
 * the configured business line rather than a hard-coded number baked into
 * the client bundle.
 */

/** The three starter prompts, each with the ask it pre-fills. */
const PROMPTS = [
  {
    key: 'rate',
    label: FORM_COPY.chatPromptRate,
    build: (name: string) =>
      `Hi Singhi Enterprises, please share today's rate for ${name}.`,
  },
  {
    key: 'stock',
    label: FORM_COPY.chatPromptStock,
    build: (name: string) =>
      `Hi Singhi Enterprises, please check spot stock for ${name}.`,
  },
  {
    key: 'delivery',
    label: FORM_COPY.chatPromptDelivery,
    build: (name: string) =>
      `Hi Singhi Enterprises, please confirm delivery to ${name}.`,
  },
] as const;

export default function PortalChat({
  whatsappNumber,
  contactName,
  city,
}: {
  whatsappNumber: string;
  contactName: string;
  city?: string;
}) {
  const { t } = usePortalLang();
  const [subject, setSubject] = useState('TMT Fe-500D 12mm');

  const target = [contactName, city].filter(Boolean).join(', ');

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
      {/* The desk card. */}
      <div className="rounded-2xl border border-ss-line bg-white p-5 sm:p-6">
        <span
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366]/12 text-[#128C4B]"
          aria-hidden="true"
        >
          <MessageCircle className="h-5 w-5" />
        </span>

        <h2 className="ss-h2 mt-4 text-lg text-ss-text">
          {t(FORM_COPY.openWhatsApp.en, FORM_COPY.openWhatsApp.hi)}
        </h2>

        <p className="mt-2 text-[0.86rem] leading-relaxed text-ss-muted">
          {t(FORM_COPY.chatHint.en, FORM_COPY.chatHint.hi)}
        </p>

        <p className="ss-tabular mt-4 rounded-lg bg-ss-light px-3.5 py-2.5 text-[0.8rem] font-semibold text-ss-text">
          {t(FORM_COPY.whatsappNumber.en, FORM_COPY.whatsappNumber.hi)}
        </p>

        <p className="mt-2.5 text-[0.76rem] text-ss-muted">
          {t(CHAT_COPY.hours.en, CHAT_COPY.hours.hi)}
        </p>

        <a
          href={buildWhatsAppUrl(
            whatsappNumber,
            `Hi Singhi Enterprises, I would like a quote for ${subject}.`
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="ss-tap mt-5 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-[0.85rem] font-bold text-white transition-colors hover:bg-[#1EBE5A]"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {t(FORM_COPY.openWhatsApp.en, FORM_COPY.openWhatsApp.hi)}
        </a>
      </div>

      {/* The pre-filled prompts. */}
      <div className="rounded-2xl border border-ss-line bg-white p-5 sm:p-6">
        <label
          htmlFor="chat-subject"
          className="mb-1.5 block text-[0.76rem] font-bold uppercase tracking-wider text-ss-muted"
        >
          {t(FORM_COPY.productInterest.en, FORM_COPY.productInterest.hi)}
        </label>
        <input
          id="chat-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="TMT Fe-500D 12mm"
          className="w-full rounded-xl border border-ss-line bg-white px-3.5 py-2.5 text-[0.88rem] text-ss-text transition-colors placeholder:text-ss-muted/70 focus:border-ss-blue focus:outline-none focus:ring-2 focus:ring-ss-blue/25"
        />

        <ul className="mt-4 grid gap-2.5">
          {PROMPTS.map((prompt) => (
            <li key={prompt.key}>
              <a
                href={buildWhatsAppUrl(
                  whatsappNumber,
                  prompt.build(subject || target)
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="ss-tap flex items-center justify-between gap-3 rounded-xl border border-ss-line bg-ss-light px-4 py-3 text-[0.84rem] font-semibold text-ss-text transition-colors hover:border-ss-blue hover:text-ss-blue"
              >
                <span className="min-w-0">
                  {t(prompt.label.en, prompt.label.hi)}{' '}
                  <span className="font-normal text-ss-muted">
                    {subject || target}
                  </span>
                </span>
                <MessageCircle
                  className="h-4 w-4 shrink-0 text-ss-muted"
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ul>

        <a
          href={`tel:+${whatsappNumber}`}
          className="ss-tap mt-4 inline-flex items-center gap-2 text-[0.8rem] font-bold text-ss-muted transition-colors hover:text-ss-blue"
        >
          <Phone className="h-3.5 w-3.5" aria-hidden="true" />
          {t(FORM_COPY.phone.en, FORM_COPY.phone.hi)}
        </a>
      </div>
    </div>
  );
}
