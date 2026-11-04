'use client';

import { ReactNode } from 'react';

/**
 * Shared form primitives for the calculators suite.
 *
 * The marketing layer is dark, so every control is a glass field: a subtle
 * white wash, a hairline border that warms on focus, and a visible focus
 * ring. Labels are always visible — a placeholder is not a label, and it
 * disappears exactly when the buyer needs to check what they typed.
 */

export function CalcLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-slate-400"
    >
      {children}
    </label>
  );
}

export function CalcInput({
  id,
  value,
  onChange,
  unit,
  step = 1,
  min = 0,
  max,
  inputMode = 'decimal',
}: {
  id: string;
  value: number;
  onChange: (next: number) => void;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
  inputMode?: 'decimal' | 'numeric';
}) {
  return (
    <div className="relative">
      <input
        id={id}
        type="number"
        inputMode={inputMode}
        value={Number.isFinite(value) ? value : ''}
        step={step}
        min={min}
        max={max}
        onChange={(e) => {
          const next = parseFloat(e.target.value);
          onChange(Number.isFinite(next) ? next : 0);
        }}
        className="ss-tabular w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 pr-14 text-[0.95rem] font-medium text-white outline-none transition-colors placeholder:text-slate-600 focus:border-ss-orange/60 focus:bg-white/[0.07]"
      />
      {unit && (
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[0.75rem] font-semibold text-slate-500">
          {unit}
        </span>
      )}
    </div>
  );
}

export function CalcSelect({
  id,
  value,
  onChange,
  children,
}: {
  id: string;
  value: string;
  onChange: (next: string) => void;
  children: ReactNode;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full appearance-none rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[0.95rem] font-medium text-white outline-none transition-colors focus:border-ss-orange/60 focus:bg-white/[0.07]"
    >
      {children}
    </select>
  );
}

/** A labelled option in a segmented control. */
export function SegmentOption({
  active,
  onClick,
  children,
  id,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  id?: string;
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`ss-tap rounded-lg px-3.5 py-2.5 text-[0.82rem] font-semibold transition-colors ${
        active
          ? 'bg-ss-orange text-white shadow-[0_8px_24px_-10px_rgba(249,115,22,0.8)]'
          : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

/** A glass panel — the standard card for the marketing layer. */
export function GlassPanel({
  children,
  className = '',
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`ss-glass ss-hairline rounded-2xl p-6 sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}
