'use client';

import { useId } from 'react';
import { usePortalLang } from '@/components/portal/PortalLangProvider';

/**
 * Form primitives for the portal.
 *
 * The dashboard is a dense, form-heavy surface, and a dozen hand-rolled
 * `<label>` + `<input>` pairs would drift apart in padding, focus ring and
 * error styling. These four components are the single definition of what a
 * portal field looks like.
 *
 * Every field wires its label with `htmlFor` and its hint with
 * `aria-describedby`, so a screen reader announces the hint and the error
 * with the field rather than leaving them floating.
 */

const FIELD_BASE =
  'w-full rounded-xl border border-ss-line bg-white px-3.5 py-2.5 text-[0.88rem] text-ss-text transition-colors placeholder:text-ss-muted/70 focus:border-ss-blue focus:outline-none focus:ring-2 focus:ring-ss-blue/25 disabled:bg-ss-light disabled:text-ss-muted';

function useFieldIds() {
  const id = useId();
  return {
    id,
    hintId: `${id}-hint`,
    errorId: `${id}-error`,
  };
}

/** A labelled text input. */
export function PortalInput({
  label,
  hint,
  error,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
  autoComplete,
  inputMode,
  name,
}: {
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric' | 'decimal';
  name?: string;
}) {
  const { id, hintId, errorId } = useFieldIds();

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[0.76rem] font-bold uppercase tracking-wider text-ss-muted"
      >
        {label}
        {required && <span className="ml-1 text-ss-orange">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') ||
          undefined
        }
        className={`${FIELD_BASE} ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : ''}`}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-[0.72rem] text-ss-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-[0.72rem] font-semibold text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

/** A labelled textarea. */
export function PortalTextarea({
  label,
  hint,
  error,
  value,
  onChange,
  placeholder,
  rows = 4,
  required,
  name,
}: {
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  name?: string;
}) {
  const { id, hintId, errorId } = useFieldIds();

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[0.76rem] font-bold uppercase tracking-wider text-ss-muted"
      >
        {label}
        {required && <span className="ml-1 text-ss-orange">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') ||
          undefined
        }
        className={`${FIELD_BASE} resize-y ${error ? 'border-rose-400' : ''}`}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-[0.72rem] text-ss-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-[0.72rem] font-semibold text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

/** A labelled select. */
export function PortalSelect({
  label,
  hint,
  error,
  value,
  onChange,
  options,
  name,
}: {
  label: string;
  hint?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  name?: string;
}) {
  const { id, hintId, errorId } = useFieldIds();

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[0.76rem] font-bold uppercase tracking-wider text-ss-muted"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [hint ? hintId : '', error ? errorId : ''].filter(Boolean).join(' ') ||
          undefined
        }
        className={`${FIELD_BASE} cursor-pointer appearance-none bg-[length:0] pr-9 ${error ? 'border-rose-400' : ''}`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%235B6478' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-[0.72rem] text-ss-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-[0.72rem] font-semibold text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}

/** A submit button that shows a busy state. */
export function PortalSubmit({
  label,
  busyLabel,
  busy,
  variant = 'primary',
}: {
  label: { en: string; hi: string };
  busyLabel?: { en: string; hi: string };
  busy: boolean;
  variant?: 'primary' | 'secondary';
}) {
  const { t } = usePortalLang();

  const base =
    'ss-tap inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-[0.85rem] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60';

  const tone =
    variant === 'primary'
      ? 'bg-ss-orange text-white hover:bg-ss-orange-2'
      : 'border border-ss-line bg-white text-ss-text hover:border-ss-blue hover:text-ss-blue';

  const shown = busy
    ? (busyLabel ?? label)
    : label;

  return (
    <button type="submit" disabled={busy} className={`${base} ${tone}`}>
      {t(shown.en, shown.hi)}
    </button>
  );
}
