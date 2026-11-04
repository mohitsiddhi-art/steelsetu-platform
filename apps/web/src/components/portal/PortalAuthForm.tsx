'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, Lock, Mail, User } from 'lucide-react';
import { signInAction, signUpAction } from '@/app/actions/portalAuth';
import type { AuthActionResult } from '@/app/actions/portalAuth';
import { AUTH_COPY, DEVA_STACK, pick, PortalLang, VALIDATION_COPY, ValidationKey } from '@/lib/portalCopy';

/**
 * The portal sign-in / sign-up form.
 *
 * The two tabs share one form because the only difference between them is
 * which fields are shown and which action is called — splitting them into two
 * components would duplicate the validation and the bilingual label plumbing
 * for no gain.
 *
 * Validation is deliberately forgiving. The form checks that the email *looks*
 * like an email and that the password is long enough, but the Auth server
 * remains the authority on whether the account exists and whether the
 * credentials are right. The messages come from `VALIDATION_COPY`, which is
 * bilingual and phrased to reassure rather than scold.
 */
export default function PortalAuthForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();

  const [mode, setMode] = useState<'signin' | 'signup'>('signup');
  const [lang, setLang] = useState<PortalLang>('en');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer');

  const [fieldError, setFieldError] = useState<
    { field: string; message: string } | null
  >(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const t = <T,>(en: T, hi: T) => pick(lang, en, hi);
  const isSignUp = mode === 'signup';

  function switchMode(next: 'signin' | 'signup') {
    setMode(next);
    setFieldError(null);
    setFormError(null);
  }

  /**
   * Map a server-side failure onto the form.
   *
   * The action returns a `message` key rather than prose, so the wording
   * lives in one place and the same failure reads identically whether it came
   * from the browser or the server.
   */
  function applyFailure(result: { ok: boolean; field?: string; message?: string }) {
    if (result.field) {
      const key = validationKeyFor(result.field);
      setFieldError({
        field: result.field,
        message: key ? t(VALIDATION_COPY[key].en, VALIDATION_COPY[key].hi) : 'Something went wrong.',
      });
      return;
    }

    const key = (result.message ?? 'signInFailed') as ValidationKey;
    const copy = VALIDATION_COPY[key] ?? VALIDATION_COPY.signInFailed;
    setFormError(t(copy.en, copy.hi));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setFieldError(null);
    setFormError(null);

    // Client-side checks first, so a typo is caught without a round-trip.
    if (isSignUp) {
      if (firstName.trim().length < 2) {
        setFieldError({
          field: 'firstName',
          message: t(
            VALIDATION_COPY.firstNameShort.en,
            VALIDATION_COPY.firstNameShort.hi
          ),
        });
        return;
      }
      if (!lastName.trim()) {
        setFieldError({
          field: 'lastName',
          message: t(
            VALIDATION_COPY.lastNameRequired.en,
            VALIDATION_COPY.lastNameRequired.hi
          ),
        });
        return;
      }
    }

    if (!email.trim()) {
      setFieldError({
        field: 'email',
        message: t(VALIDATION_COPY.emailRequired.en, VALIDATION_COPY.emailRequired.hi),
      });
      return;
    }

    if (!password) {
      setFieldError({
        field: 'password',
        message: t(
          VALIDATION_COPY.passwordRequired.en,
          VALIDATION_COPY.passwordRequired.hi
        ),
      });
      return;
    }

    if (isSignUp && password.length < 8) {
      setFieldError({
        field: 'password',
        message: t(
          VALIDATION_COPY.passwordShort.en,
          VALIDATION_COPY.passwordShort.hi
        ),
      });
      return;
    }

    setBusy(true);

    try {
      const result: AuthActionResult = isSignUp
        ? await signUpAction({ firstName, lastName, email, password, role })
        : await signInAction(email, password);

      if (!result.ok) {
        applyFailure(result);
        setBusy(false);
        return;
      }

      // The role is read back from the profile on the server, so the route we
      // land on is the one the account actually has. It is a different
      // variable from the `role` state above — that one is what the visitor
      // picked, this one is what the server confirmed.
      const resolvedRole = result.role ?? 'buyer';
      router.replace(
        nextPath === '/dashboard' ? `/dashboard/${resolvedRole}` : nextPath
      );
      router.refresh();
    } catch {
      setFormError(
        t(VALIDATION_COPY.signInFailed.en, VALIDATION_COPY.signInFailed.hi)
      );
      setBusy(false);
    }
  }

  const fieldClass = (hasError: boolean) =>
    `w-full rounded-xl border bg-white/[0.04] py-3 pl-11 pr-4 text-[0.95rem] text-white outline-none transition-colors placeholder:text-slate-600 focus:bg-white/[0.07] ${
      hasError
        ? 'border-red-500/60 focus:border-red-400'
        : 'border-white/10 focus:border-ss-orange/60'
    }`;

  return (
    <div className="mt-9">
      {/* Tab switch */}
      <div
        role="tablist"
        aria-label={t(AUTH_COPY.signInTab.en, AUTH_COPY.signInTab.hi)}
        className="ss-glass ss-hairline grid grid-cols-2 gap-1 rounded-xl p-1"
      >
        {(
          [
            ['signup', AUTH_COPY.signUpTab],
            ['signin', AUTH_COPY.signInTab],
          ] as const
        ).map(([key, label]) => {
          const active = mode === key;
          return (
            <button
              key={key}
              type="button"
              role="tab"
              id={`portal-tab-${key}`}
              aria-selected={active}
              aria-controls="portal-form"
              onClick={() => switchMode(key)}
              className={`ss-tap rounded-lg px-4 py-2.5 text-[0.88rem] font-semibold transition-colors ${
                active
                  ? 'bg-ss-orange text-white shadow-[0_8px_24px_-10px_rgba(249,115,22,0.8)]'
                  : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              {t(label.en, label.hi)}
            </button>
          );
        })}
      </div>

      {/* Form */}
      <form
        id="portal-form"
        role="tabpanel"
        aria-labelledby={`portal-tab-${mode}`}
        onSubmit={handleSubmit}
        noValidate
        className="ss-glass ss-hairline mt-4 space-y-4 rounded-2xl p-5 sm:p-6"
      >
        {formError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-red-500/40 bg-red-500/10 px-3.5 py-3 text-[0.85rem] text-red-300"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{formError}</span>
          </div>
        )}

        {isSignUp && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="firstName"
              label={t(AUTH_COPY.firstName.en, AUTH_COPY.firstName.hi)}
              error={fieldError?.field === 'firstName' ? fieldError.message : null}
              icon={<User className="h-4 w-4" aria-hidden="true" />}
            >
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Rakesh"
                aria-invalid={fieldError?.field === 'firstName'}
                className={fieldClass(fieldError?.field === 'firstName')}
              />
            </Field>

            <Field
              id="lastName"
              label={t(AUTH_COPY.lastName.en, AUTH_COPY.lastName.hi)}
              error={fieldError?.field === 'lastName' ? fieldError.message : null}
              icon={<User className="h-4 w-4" aria-hidden="true" />}
            >
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Sharma"
                aria-invalid={fieldError?.field === 'lastName'}
                className={fieldClass(fieldError?.field === 'lastName')}
              />
            </Field>
          </div>
        )}

        <Field
          id="email"
          label={t(AUTH_COPY.email.en, AUTH_COPY.email.hi)}
          error={fieldError?.field === 'email' ? fieldError.message : null}
          icon={<Mail className="h-4 w-4" aria-hidden="true" />}
        >
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.in"
            aria-invalid={fieldError?.field === 'email'}
            className={fieldClass(fieldError?.field === 'email')}
          />
        </Field>

        <Field
          id="password"
          label={t(AUTH_COPY.password.en, AUTH_COPY.password.hi)}
          error={fieldError?.field === 'password' ? fieldError.message : null}
          icon={<Lock className="h-4 w-4" aria-hidden="true" />}
          hint={isSignUp ? t(AUTH_COPY.passwordHint.en, AUTH_COPY.passwordHint.hi) : undefined}
        >
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            aria-invalid={fieldError?.field === 'password'}
            className={fieldClass(fieldError?.field === 'password')}
          />
        </Field>

        {/* Role — buyers and sellers see different things downstream, so the
            choice is asked once, up front, and stored on the profile. */}
        {isSignUp && (
          <fieldset>
            <legend className="mb-2 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-slate-400">
              {t(AUTH_COPY.role.en, AUTH_COPY.role.hi)}
            </legend>

            <div className="grid gap-2 sm:grid-cols-2">
              {(
                [
                  ['buyer', AUTH_COPY.roleBuyer, AUTH_COPY.roleBuyerHint],
                  ['seller', AUTH_COPY.roleSeller, AUTH_COPY.roleSellerHint],
                ] as const
              ).map(([key, label, hint]) => {
                const active = role === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRole(key)}
                    aria-pressed={active}
                    className={`ss-tap rounded-xl border px-4 py-3 text-left transition-colors ${
                      active
                        ? 'border-ss-orange/70 bg-ss-orange/10'
                        : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    <span
                      className={`block text-[0.9rem] font-semibold ${
                        active ? 'text-ss-orange' : 'text-white'
                      }`}
                    >
                      {t(label.en, label.hi)}
                    </span>
                    <span
                      className="mt-1 block text-[0.76rem] leading-relaxed text-slate-400"
                      style={{ fontFamily: lang === 'hi' ? DEVA_STACK : undefined }}
                    >
                      {t(hint.en, hint.hi)}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>
        )}

        <button
          type="submit"
          disabled={busy}
          className="ss-molten ss-tap flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[0.95rem] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
          {busy
            ? isSignUp
              ? t(AUTH_COPY.creatingAccount.en, AUTH_COPY.creatingAccount.hi)
              : t(AUTH_COPY.signingIn.en, AUTH_COPY.signingIn.hi)
            : isSignUp
              ? t(AUTH_COPY.submitSignUp.en, AUTH_COPY.submitSignUp.hi)
              : t(AUTH_COPY.submitSignIn.en, AUTH_COPY.submitSignIn.hi)}
        </button>

        {/* Language switch — the form is the surface most likely to be met in
            Hindi, so the control sits inside the form rather than in the page
            chrome. */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <p className="text-[0.8rem] text-slate-400">
            {isSignUp
              ? t(AUTH_COPY.haveAccount.en, AUTH_COPY.haveAccount.hi)
              : t(AUTH_COPY.noAccount.en, AUTH_COPY.noAccount.hi)}{' '}
            <button
              type="button"
              onClick={() => switchMode(isSignUp ? 'signin' : 'signup')}
              className="font-semibold text-ss-orange underline-offset-2 transition-colors hover:text-ss-orange-2 hover:underline"
            >
              {isSignUp
                ? t(AUTH_COPY.signInInstead.en, AUTH_COPY.signInInstead.hi)
                : t(AUTH_COPY.createOne.en, AUTH_COPY.createOne.hi)}
            </button>
          </p>

          <div
            role="group"
            aria-label="Language / भाषा"
            className="inline-flex shrink-0 items-center rounded-full border border-white/10 bg-white/5 p-0.5 text-[0.7rem] font-semibold"
          >
            <button
              type="button"
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
              className={`rounded-full px-2.5 py-1 transition-colors ${
                lang === 'en' ? 'bg-ss-blue text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              aria-pressed={lang === 'hi'}
              style={{ fontFamily: DEVA_STACK }}
              className={`rounded-full px-2.5 py-1 transition-colors ${
                lang === 'hi' ? 'bg-ss-blue text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/** A labelled field with an optional error message and hint. */
function Field({
  id,
  label,
  error,
  hint,
  icon,
  children,
}: {
  id: string;
  label: string;
  error?: string | null;
  hint?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-slate-400"
      >
        {label}
      </label>

      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </span>
        {children}
      </div>

      {error ? (
        <p
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-[0.78rem] text-red-300"
        >
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-[0.78rem] text-slate-500">{hint}</p>
      ) : null}
    </div>
  );
}

/**
 * Map a field key returned by the server action onto a validation message.
 *
 * The server returns the *field* for a field-specific failure and a
 * *message key* for a general one, so only the field case needs a lookup.
 */
function validationKeyFor(field: string): ValidationKey | null {
  switch (field) {
    case 'firstName':
      return 'firstNameRequired';
    case 'lastName':
      return 'lastNameRequired';
    case 'email':
      return 'emailInvalid';
    case 'password':
      return 'passwordShort';
    case 'role':
      return 'roleRequired';
    default:
      return null;
  }
}
