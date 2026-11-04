'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { createRfqAction } from '@/app/actions/portalActions';
import { usePortalLang } from '@/components/portal/PortalLangProvider';
import {
  PortalInput,
  PortalSelect,
  PortalSubmit,
} from '@/components/portal/PortalField';
import { RFQ_COPY, VALIDATION_COPY, ValidationKey } from '@/lib/portalCopy';
import type { SteelProduct } from '@/types/steel';

/**
 * The trade-desk RFQ form.
 *
 * This is the portal's twin of the public product RFQ modal, and it writes
 * to the same `rfq_inquiries` table — with the session's user id attached,
 * so the request shows up in the buyer's own "My RFQs" list instead of
 * vanishing into the trade desk.
 *
 * The product list is passed in from the server so the select always offers
 * what the catalogue actually holds. Selecting a product also pre-fills the
 * minimum tonnage, because a request below the mill's MOQ is a wasted
 * round-trip for both sides.
 */
export default function PortalRfqForm({
  products,
  defaultGstin,
}: {
  products: SteelProduct[];
  defaultGstin?: string;
}) {
  const { t } = usePortalLang();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [productId, setProductId] = useState(products[0]?.id ?? '');
  const [tons, setTons] = useState('');
  const [pincode, setPincode] = useState('');
  const [gstin, setGstin] = useState(defaultGstin ?? '');

  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const selected = products.find((product) => product.id === productId);

  function handleProductChange(value: string) {
    setProductId(value);
    const next = products.find((product) => product.id === value);
    // Pre-fill the tonnage with the mill's minimum, so the buyer starts
    // from an orderable quantity instead of an empty box.
    if (next && next.minimumOrderTons > 0) {
      setTons(String(next.minimumOrderTons));
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setError(null);
    setReference(null);

    startTransition(async () => {
      const result = await createRfqAction({
        productId,
        tons: Number(tons),
        pincode,
        gstNumber: gstin,
      });

      if (!result.ok) {
        const key = (result.message ?? 'actionFailed') as ValidationKey;
        const copy = VALIDATION_COPY[key] ?? VALIDATION_COPY.actionFailed;
        setError(t(copy.en, copy.hi));
        return;
      }

      setReference(result.reference ?? null);
      setTons('');
      setPincode('');
      router.refresh();
    });
  }

  const productOptions = products.map((product) => ({
    value: product.id,
    label: `${product.name} — ${product.grade ?? product.category}`,
  }));

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-ss-line bg-white p-5 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <PortalSelect
            label={t(RFQ_COPY.pickProduct.en, RFQ_COPY.pickProduct.hi)}
            value={productId}
            onChange={handleProductChange}
            options={productOptions}
            name="productId"
          />
        </div>

        <PortalInput
          label={t(RFQ_COPY.quantity.en, RFQ_COPY.quantity.hi)}
          value={tons}
          onChange={setTons}
          type="number"
          inputMode="decimal"
          required
          placeholder={selected ? String(selected.minimumOrderTons) : '50'}
          name="tons"
        />

        <PortalInput
          label={t(RFQ_COPY.pincode.en, RFQ_COPY.pincode.hi)}
          value={pincode}
          onChange={setPincode}
          inputMode="numeric"
          placeholder="700019"
          name="pincode"
        />

        <div className="sm:col-span-2">
          <PortalInput
            label={t(RFQ_COPY.gstin.en, RFQ_COPY.gstin.hi)}
            hint={t(RFQ_COPY.gstinHint.en, RFQ_COPY.gstinHint.hi)}
            value={gstin}
            onChange={setGstin}
            required
            placeholder="19XXXXX1234561Z"
            name="gstin"
          />
        </div>
      </div>

      {selected && (
        <p className="ss-tabular mt-4 rounded-lg bg-ss-light px-3.5 py-2.5 text-[0.78rem] text-ss-muted">
          {t(RFQ_COPY.quantity.en, RFQ_COPY.quantity.hi)}:{' '}
          <strong className="text-ss-text">
            {selected.minimumOrderTons} MT
          </strong>{' '}
          · {t(RFQ_COPY.tons.en, RFQ_COPY.tons.hi)}:{' '}
          <strong className="text-ss-text">
            {selected.inventoryTons} MT
          </strong>
        </p>
      )}

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
            {t(RFQ_COPY.success.en, RFQ_COPY.success.hi)}{' '}
            <strong className="ss-tabular">{reference}</strong>
          </span>
        </p>
      )}

      <div className="mt-5">
        <PortalSubmit
          label={RFQ_COPY.submit}
          busy={pending}
          busyLabel={RFQ_COPY.sending}
        />
      </div>
    </form>
  );
}
