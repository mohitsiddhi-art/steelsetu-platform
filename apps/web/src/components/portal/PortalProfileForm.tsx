'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { updateProfileAction } from '@/app/actions/portalActions';
import { usePortalLang } from '@/components/portal/PortalLangProvider';
import {
  PortalInput,
  PortalSelect,
  PortalSubmit,
} from '@/components/portal/PortalField';
import { FORM_COPY, VALIDATION_COPY, ValidationKey } from '@/lib/portalCopy';
import type { UserProfile } from '@/types/platform';

/**
 * The profile settings form.
 *
 * These details travel with every inquiry, so the form is prefilled from
 * the stored profile and the GSTIN is upper-cased on save — GSTINs are
 * compared case-sensitively by some downstream systems, and a lower-case
 * GSTIN in an invoice is a real problem.
 */
export default function PortalProfileForm({
  profile,
}: {
  profile: UserProfile;
}) {
  const { t } = usePortalLang();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName ?? '');
  const [phone, setPhone] = useState(profile.phone ?? '');
  const [company, setCompany] = useState(profile.company ?? '');
  const [companyType, setCompanyType] = useState(profile.companyType ?? '');
  const [gstin, setGstin] = useState(profile.gstin ?? '');
  const [city, setCity] = useState(profile.city ?? '');
  const [locale, setLocale] = useState<'en' | 'hi'>(
    profile.locale === 'hi' ? 'hi' : 'en'
  );

  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setError(null);
    setSaved(false);

    startTransition(async () => {
      const result = await updateProfileAction({
        firstName,
        lastName: lastName || undefined,
        phone: phone || undefined,
        company: company || undefined,
        companyType: companyType || undefined,
        gstin: gstin || undefined,
        city: city || undefined,
        locale,
      });

      if (!result.ok) {
        const key = (result.message ?? 'actionFailed') as ValidationKey;
        const copy = VALIDATION_COPY[key] ?? VALIDATION_COPY.actionFailed;
        setError(t(copy.en, copy.hi));
        return;
      }

      setSaved(true);
      router.refresh();
    });
  }

  const languageOptions = [
    { value: 'en', label: t(FORM_COPY.english.en, FORM_COPY.english.hi) },
    { value: 'hi', label: t(FORM_COPY.hindi.en, FORM_COPY.hindi.hi) },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-ss-line bg-white p-5 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <PortalInput
          label={t(FORM_COPY.firstName.en, FORM_COPY.firstName.hi)}
          value={firstName}
          onChange={setFirstName}
          required
          autoComplete="given-name"
          name="firstName"
        />

        <PortalInput
          label={t(FORM_COPY.lastName.en, FORM_COPY.lastName.hi)}
          value={lastName}
          onChange={setLastName}
          autoComplete="family-name"
          name="lastName"
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
          label={t(FORM_COPY.company.en, FORM_COPY.company.hi)}
          value={company}
          onChange={setCompany}
          autoComplete="organization"
          name="company"
        />

        <PortalInput
          label={t(FORM_COPY.companyType.en, FORM_COPY.companyType.hi)}
          value={companyType}
          onChange={setCompanyType}
          placeholder="Fabricator / Contractor / Stockist"
          name="companyType"
        />

        <PortalInput
          label={t(FORM_COPY.gstin.en, FORM_COPY.gstin.hi)}
          value={gstin}
          onChange={setGstin}
          placeholder="19XXXXX1234561Z"
          name="gstin"
        />

        <PortalInput
          label={t(FORM_COPY.city.en, FORM_COPY.city.hi)}
          value={city}
          onChange={setCity}
          placeholder="Kolkata"
          name="city"
        />

        <PortalSelect
          label={t(FORM_COPY.language.en, FORM_COPY.language.hi)}
          value={locale}
          onChange={(v) => setLocale(v as 'en' | 'hi')}
          options={languageOptions}
          name="locale"
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
          {t(FORM_COPY.profileSaved.en, FORM_COPY.profileSaved.hi)}
        </p>
      )}

      <div className="mt-5">
        <PortalSubmit
          label={FORM_COPY.saveProfile}
          busy={pending}
          busyLabel={{ en: 'Saving…', hi: 'सेव हो रहा है…' }}
        />
      </div>
    </form>
  );
}
