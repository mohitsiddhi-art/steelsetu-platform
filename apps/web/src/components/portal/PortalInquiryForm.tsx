'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { createInquiryAction } from '@/app/actions/portalActions';
import { usePortalLang } from '@/components/portal/PortalLangProvider';
import {
  PortalInput,
  PortalTextarea,
  PortalSubmit,
} from '@/components/portal/PortalField';
import { FORM_COPY, VALIDATION_COPY, ValidationKey } from '@/lib/portalCopy';

/**
 * The "raise an inquiry" form.
 *
 * The fields the user has already given us are pre-filled from the profile,
 * because a repeat customer retyping their company name on every order is
 * the single most common way a B2B form gets abandoned. Anything blank in
 * the profile stays blank here.
 */
export default function PortalInquiryForm({
  defaultName,
  defaultCompany,
  defaultPhone,
  defaultEmail,
}: {
  defaultName: string;
  defaultCompany?: string;
  defaultPhone?: string;
  defaultEmail?: string;
}) {
  const { t } = usePortalLang();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [buyerName, setBuyerName] = useState(defaultName);
  const [companyName, setCompanyName] = useState(defaultCompany ?? '');
  const [phone, setPhone] = useState(defaultPhone ?? '');
  const [email, setEmail] = useState(defaultEmail ?? '');
  const [productInterest, setProductInterest] = useState('');
  const [quantityTons, setQuantityTons] = useState('');
  const [message, setMessage] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setError(null);
    setReference(null);

    const tons = Number(quantityTons);

    startTransition(async () => {
      const result = await createInquiryAction({
        buyerName,
        companyName: companyName || undefined,
        phone: phone || undefined,
        email: email || undefined,
        productName: productInterest || undefined,
        quantityTons:
          quantityTons.trim() !== '' && Number.isFinite(tons) ? tons : undefined,
        message: message || undefined,
      });

      if (!result.ok) {
        const key = (result.message ?? 'actionFailed') as ValidationKey;
        const copy = VALIDATION_COPY[key] ?? VALIDATION_COPY.actionFailed;
        setError(t(copy.en, copy.hi));
        return;
      }

      setReference(result.reference ?? null);
      setMessage('');
      setProductInterest('');
      setQuantityTons('');
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-ss-line bg-white p-5 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <PortalInput
          label={t(FORM_COPY.contactName.en, FORM_COPY.contactName.hi)}
          value={buyerName}
          onChange={setBuyerName}
          required
          autoComplete="name"
          name="buyerName"
        />

        <PortalInput
          label={t(FORM_COPY.company.en, FORM_COPY.company.hi)}
          value={companyName}
          onChange={setCompanyName}
          autoComplete="organization"
          name="companyName"
        />

        <PortalInput
          label={t(FORM_COPY.phone.en, FORM_COPY.phone.hi)}
          value={phone}
          onChange={setPhone}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          name="phone"
        />

        <PortalInput
          label={t(FORM_COPY.email.en, FORM_COPY.email.hi)}
          value={email}
          onChange={setEmail}
          type="email"
          inputMode="email"
          autoComplete="email"
          name="email"
        />

        <PortalInput
          label={t(FORM_COPY.productInterest.en, FORM_COPY.productInterest.hi)}
          value={productInterest}
          onChange={setProductInterest}
          placeholder="TMT Fe-500D 12mm"
          name="productInterest"
        />

        <PortalInput
          label={t(FORM_COPY.quantityMt.en, FORM_COPY.quantityMt.hi)}
          value={quantityTons}
          onChange={setQuantityTons}
          type="number"
          inputMode="decimal"
          placeholder="50"
          name="quantityTons"
        />
      </div>

      <div className="mt-4">
        <PortalTextarea
          label={t(FORM_COPY.message.en, FORM_COPY.message.hi)}
          value={message}
          onChange={setMessage}
          rows={4}
          placeholder="Delivery location, grade preference, payment terms…"
          name="message"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-3 text-[0.84rem] text-rose-700"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {reference && (
        <p
          role="status"
          className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-[0.84rem] text-emerald-800"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {t(FORM_COPY.inquirySent.en, FORM_COPY.inquirySent.hi)}{' '}
            <strong className="ss-tabular">{reference}</strong>
          </span>
        </p>
      )}

      <div className="mt-5">
        <PortalSubmit
          label={FORM_COPY.submitInquiry}
          busy={pending}
          busyLabel={{ en: 'Sending…', hi: 'भेजा जा रहा है…' }}
        />
      </div>
    </form>
  );
}
