'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { createSavedSearchAction } from '@/app/actions/portalActions';
import { usePortalLang } from '@/components/portal/PortalLangProvider';
import {
  PortalInput,
  PortalSelect,
  PortalSubmit,
} from '@/components/portal/PortalField';
import { FORM_COPY, VALIDATION_COPY, ValidationKey } from '@/lib/portalCopy';

/**
 * The "save a search" form.
 *
 * The search terms are stored as a JSONB query object, so a saved search
 * can carry more than one filter later. For now the form exposes a single
 * free-text term — a grade, a size, a brand — which is what a buyer
 * actually searches for.
 */
export default function PortalSavedSearchForm() {
  const { t } = usePortalLang();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [name, setName] = useState('');
  const [terms, setTerms] = useState('');
  const [alertFrequency, setAlertFrequency] = useState<'none' | 'daily' | 'weekly'>(
    'none'
  );

  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setError(null);
    setSaved(false);

    startTransition(async () => {
      const result = await createSavedSearchAction(
        name,
        { q: terms.trim() || undefined },
        alertFrequency
      );

      if (!result.ok) {
        const key = (result.message ?? 'actionFailed') as ValidationKey;
        const copy = VALIDATION_COPY[key] ?? VALIDATION_COPY.actionFailed;
        setError(t(copy.en, copy.hi));
        return;
      }

      setSaved(true);
      setName('');
      setTerms('');
      router.refresh();
    });
  }

  const frequencyOptions = (
    [
      ['none', FORM_COPY.noAlert],
      ['daily', FORM_COPY.daily],
      ['weekly', FORM_COPY.weekly],
    ] as const
  ).map(([value, copy]) => ({
    value,
    label: t(copy.en, copy.hi),
  }));

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-ss-line bg-white p-5 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <PortalInput
          label={t(FORM_COPY.searchName.en, FORM_COPY.searchName.hi)}
          value={name}
          onChange={setName}
          required
          placeholder="Bengal rebar — 12mm Fe-500D"
          name="name"
        />

        <PortalInput
          label={t(FORM_COPY.searchTerms.en, FORM_COPY.searchTerms.hi)}
          value={terms}
          onChange={setTerms}
          placeholder="TMT Fe-500D 12mm"
          name="terms"
        />

        <PortalSelect
          label={t(FORM_COPY.alertFrequency.en, FORM_COPY.alertFrequency.hi)}
          value={alertFrequency}
          onChange={(v) =>
            setAlertFrequency(v as 'none' | 'daily' | 'weekly')
          }
          options={frequencyOptions}
          name="alertFrequency"
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

      {saved && (
        <p
          role="status"
          className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-[0.84rem] text-emerald-800"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {t(FORM_COPY.searchSaved.en, FORM_COPY.searchSaved.hi)}
        </p>
      )}

      <div className="mt-5">
        <PortalSubmit
          label={FORM_COPY.submitSearch}
          busy={pending}
          busyLabel={{ en: 'Saving…', hi: 'सेव हो रहा है…' }}
        />
      </div>
    </form>
  );
}
