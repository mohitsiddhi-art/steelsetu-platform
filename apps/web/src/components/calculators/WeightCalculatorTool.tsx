'use client';

import { useMemo, useState } from 'react';
import { MessageCircle, Scale, Sigma } from 'lucide-react';
import {
  SHAPES,
  ShapeDefinition,
  ShapeId,
  calculateShapeWeight,
} from '@/lib/steelCalculator';
import { formatTons } from '@/lib/format';
import { buildWhatsAppUrl, getWhatsAppNumber } from '@/lib/whatsapp';
import { CalcInput, CalcLabel, GlassPanel, SegmentOption } from './CalcField';

/**
 * Tool 1 — the Steel Weight Calculator.
 *
 * Every section weight comes from the trade's own formulae (IS 1786 for
 * bars, IS 808 for sections, IS 1239 for pipes, density × area for plate),
 * and the formula is printed next to the answer. A weight that a site
 * engineer cannot audit is a weight they will not trust.
 *
 * Section weights are rounded to three decimals of a kilogram per metre
 * before the length is applied — the same convention the mill weight
 * tables use. That is why 12 mm TMT over 12 m reads 10.66 kg.
 */
export default function WeightCalculatorTool() {
  const [shapeId, setShapeId] = useState<ShapeId>('round_tmt');
  const shape: ShapeDefinition = useMemo(
    () => SHAPES.find((s) => s.id === shapeId) ?? SHAPES[0],
    [shapeId],
  );

  const [values, setValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const field of SHAPES[0].fields) initial[field.key] = field.defaultValue;
    return initial;
  });

  // Switching shape resets to that shape's defaults — a 12 mm diameter
  // carried over to a pipe would be meaningless.
  function selectShape(next: ShapeId) {
    setShapeId(next);
    const nextShape = SHAPES.find((s) => s.id === next) ?? SHAPES[0];
    const reset: Record<string, number> = {};
    for (const field of nextShape.fields) reset[field.key] = field.defaultValue;
    setValues(reset);
  }

  function setValue(key: string, value: number) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  const result = useMemo(() => calculateShapeWeight(shape, values), [shape, values]);

  const waMessage = useMemo(() => {
    const spec = shape.specSummary(values);
    return [
      `Hi Singhi Enterprises, I need a detailed quotation for ${spec}.`,
      `Calculated weight: ${result.totalKg.toFixed(2)} kg (${result.totalTons.toFixed(3)} MT).`,
      'Please share the best bulk rate for Burrabazar delivery.',
    ].join(' ');
  }, [shape, values, result]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      {/* --- Inputs --- */}
      <GlassPanel>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ss-orange">
            <Scale className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-[1.05rem] font-semibold text-white">Section &amp; Size</h3>
            <p className="text-[0.78rem] text-slate-500">
              Choose a shape, then enter the mill size, length and quantity.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <CalcLabel htmlFor="calc-shape">Shape</CalcLabel>
          <div
            id="calc-shape"
            role="group"
            aria-label="Steel shape"
            className="flex flex-wrap gap-2"
          >
            {SHAPES.map((s) => (
              <SegmentOption
                key={s.id}
                active={s.id === shapeId}
                onClick={() => selectShape(s.id)}
              >
                {s.label}
              </SegmentOption>
            ))}
          </div>
          <p className="mt-3 text-[0.75rem] text-slate-500">
            Section weights follow {shape.standard} ·{' '}
            <span className="ss-tabular text-slate-400">{shape.formula}</span>
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {shape.fields.map((field) => (
            <div key={field.key}>
              <CalcLabel htmlFor={`calc-${field.key}`}>
                {field.label} ({field.unit})
              </CalcLabel>
              <CalcInput
                id={`calc-${field.key}`}
                value={values[field.key] ?? field.defaultValue}
                onChange={(next) => setValue(field.key, next)}
                unit={field.unit}
                step={field.step}
                min={field.min}
                inputMode={field.key === 'quantity' ? 'numeric' : 'decimal'}
              />
              {field.hint && (
                <p className="mt-1.5 text-[0.72rem] text-slate-500">{field.hint}</p>
              )}
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* --- Result --- */}
      <div className="space-y-6">
        <GlassPanel className="relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            style={{
              background:
                'radial-gradient(28rem 16rem at 88% 0%, rgba(249,115,22,0.18), transparent 66%)',
            }}
          />

          <div className="relative">
            <p className="ss-eyebrow text-ss-orange">Calculated Weight</p>

            <div className="mt-4 flex items-end gap-2">
              <span className="ss-tabular ss-h1 text-5xl text-white sm:text-6xl">
                {result.totalKg.toLocaleString('en-IN', {
                  maximumFractionDigits: 2,
                })}
              </span>
              <span className="pb-2 text-lg font-semibold text-slate-300">kg</span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="ss-tabular text-[1.05rem] font-semibold text-ss-orange">
                {formatTons(result.totalTons)} MT
              </span>
              <span className="text-[0.78rem] text-slate-500">
                {shape.per === 'metre'
                  ? `${values.length ?? 0} m × ${result.pieces} nos`
                  : `${result.pieces} sheet${result.pieces === 1 ? '' : 's'}`}
              </span>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
              <div>
                <dt className="text-[0.72rem] uppercase tracking-[0.1em] text-slate-500">
                  Unit weight
                </dt>
                <dd className="ss-tabular mt-1 text-[0.95rem] font-semibold text-white">
                  {result.unitWeightKg.toFixed(3)}{' '}
                  <span className="text-[0.75rem] font-normal text-slate-500">
                    {shape.unitWeightLabel}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-[0.72rem] uppercase tracking-[0.1em] text-slate-500">
                  Total pieces
                </dt>
                <dd className="ss-tabular mt-1 text-[0.95rem] font-semibold text-white">
                  {result.pieces}
                </dd>
              </div>
            </dl>

            <a
              href={buildWhatsAppUrl(getWhatsAppNumber(), waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="ss-molten mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white shadow-lg"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Send This Custom Spec to Singhi Trade Desk for Final Ex-Mill Quote
            </a>

            <p className="mt-3 text-center text-[0.72rem] text-slate-500">
              * Approx. / Indicative ex-mill rates (exclusive of GST, freight, loading) — confirm before order.
            </p>
          </div>
        </GlassPanel>

        <GlassPanel>
          <p className="flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-slate-400">
            <Sigma className="h-4 w-4 text-ss-blue" aria-hidden="true" />
            How this is calculated
          </p>
          <p className="mt-3 text-[0.85rem] leading-relaxed text-slate-400">
            Section weights are taken from the {shape.standard} weight tables and
            rounded to three decimals of a kilogram per metre before the length
            is applied — the same convention the mills print on their own
            weight schedules. Plate weight is the section area multiplied by
            the steel density of 7.85 g/cm³.
          </p>
          <p className="mt-3 text-[0.85rem] leading-relaxed text-slate-400">
            The result is the <em>theoretical</em> weight. Actual dispatch
            weight is 1–2% higher once mill tolerance, bundling and rust
            proofing are added.
          </p>
        </GlassPanel>
      </div>
    </div>
  );
}
