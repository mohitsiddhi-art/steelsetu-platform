'use client';

import { useMemo, useState } from 'react';
import { ArrowLeftRight, Ruler } from 'lucide-react';
import { CONVERSION_PAIRS, ConversionPair, convert } from '@/lib/steelCalculator';
import { CalcLabel, GlassPanel, SegmentOption } from './CalcField';

/**
 * Render a converted value.
 *
 * The pair's own precision is the ceiling, but a value that would round to
 * zero at that precision gets more decimals — "0.00 MT" tells the buyer
 * nothing, where "0.001 MT" is the answer they were looking for.
 */
function formatResult(value: number, decimals: number): string {
  if (!Number.isFinite(value)) return '0';

  const fixed = value.toFixed(decimals);
  if (parseFloat(fixed) === 0 && value !== 0) {
    return value.toLocaleString('en-IN', { maximumFractionDigits: 8 });
  }

  return Number(fixed).toLocaleString('en-IN', { maximumFractionDigits: decimals });
}

/**
 * Tool 2 — the Unit Converter.
 *
 * Every pair is bidirectional. Rather than a "from" list and a "to" list,
 * there is one pair of units and a swap button — a buyer converting
 * millimetres to inches and then back again should never have to hunt for
 * the right combination.
 */
export default function UnitConverterTool() {
  const [pairId, setPairId] = useState(CONVERSION_PAIRS[0].id);
  const [swapped, setSwapped] = useState(false);
  const [value, setValue] = useState(1);

  const pair: ConversionPair = useMemo(
    () => CONVERSION_PAIRS.find((p) => p.id === pairId) ?? CONVERSION_PAIRS[0],
    [pairId],
  );

  const fromUnit = swapped ? pair.toUnit : pair.fromUnit;
  const toUnit = swapped ? pair.fromUnit : pair.toUnit;
  const result = convert(value, pair, swapped);

  function selectPair(id: string) {
    setPairId(id);
    setSwapped(false);
    setValue(1);
  }

  /**
   * Swap the ends of the pair, carrying the answer across.
   *
   * Reversing the direction without moving the number would show 1 kg as
   * 0.001 MT and read as "zero" — so the result becomes the new input, and
   * the conversion visibly round-trips.
   */
  function swap() {
    setValue(result);
    setSwapped((s) => !s);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <GlassPanel>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ss-orange">
            <Ruler className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-[1.05rem] font-semibold text-white">
              Convert a Unit
            </h3>
            <p className="text-[0.78rem] text-slate-500">
              Pick a pair, type a value, read the answer.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <CalcLabel htmlFor="conv-pair">Conversion</CalcLabel>
          <div
            id="conv-pair"
            role="group"
            aria-label="Conversion pair"
            className="flex flex-wrap gap-2"
          >
            {CONVERSION_PAIRS.map((p) => (
              <SegmentOption
                key={p.id}
                active={p.id === pairId}
                onClick={() => selectPair(p.id)}
              >
                {p.label}
              </SegmentOption>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
          <div>
            <CalcLabel htmlFor="conv-from">From ({fromUnit})</CalcLabel>
            <input
              id="conv-from"
              type="number"
              inputMode="decimal"
              value={Number.isFinite(value) ? value : ''}
              onChange={(e) => {
                const next = parseFloat(e.target.value);
                setValue(Number.isFinite(next) ? next : 0);
              }}
              className="ss-tabular w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[1.15rem] font-semibold text-white outline-none transition-colors focus:border-ss-orange/60 focus:bg-white/[0.07]"
            />
          </div>

          <button
            type="button"
            onClick={swap}
            aria-label="Swap units"
            className="ss-tap mb-1 inline-flex h-11 w-11 items-center justify-center self-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition-colors hover:border-ss-orange/50 hover:text-ss-orange sm:mx-1"
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <div>
            <CalcLabel htmlFor="conv-to">To ({toUnit})</CalcLabel>
            <div
              id="conv-to"
              aria-live="polite"
              className="ss-tabular flex h-[3.25rem] items-center rounded-xl border border-ss-orange/30 bg-ss-orange/10 px-4 text-[1.15rem] font-bold text-ss-orange"
            >
              {formatResult(result, pair.decimals)}
            </div>
          </div>
        </div>

        <p className="mt-4 text-[0.78rem] text-slate-500">
          {pair.hint} · the conversion runs in both directions.
        </p>
      </GlassPanel>

      <GlassPanel>
        <p className="ss-eyebrow text-ss-orange">Quick Reference</p>
        <h3 className="mt-2 text-[1.05rem] font-semibold text-white">
          Conversions worth memorising
        </h3>

        <dl className="mt-5 space-y-3">
          {[
            { k: '1 MT', v: '1,000 kg' },
            { k: '1 tonne', v: '10 quintals' },
            { k: '1 m', v: '3.2808 ft' },
            { k: '1 ft', v: '304.8 mm' },
            { k: '1 inch', v: '25.4 mm' },
            { k: '1 m²', v: '10.7639 sq.ft' },
            { k: '1 sq.ft', v: '0.0929 m²' },
            { k: '1 acre', v: '43,560 sq.ft' },
            { k: '1 hectare', v: '107,639 sq.ft' },
            { k: '1 kg', v: '2.2046 lb' },
          ].map((row) => (
            <div
              key={row.k}
              className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.03] px-4 py-2.5"
            >
              <dt className="ss-tabular text-[0.85rem] font-semibold text-slate-300">
                {row.k}
              </dt>
              <dd className="ss-tabular text-[0.85rem] text-slate-500">{row.v}</dd>
            </div>
          ))}
        </dl>
      </GlassPanel>
    </div>
  );
}
