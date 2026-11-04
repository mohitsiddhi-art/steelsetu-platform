'use client';

import { useMemo, useState } from 'react';
import { IndianRupee, MapPin, Search, TrendingUp } from 'lucide-react';
import {
  CATEGORIES,
  CITIES,
  getCategory,
  getCity,
  getGrade,
  estimateCost,
  tonnageFromArea,
} from '@/lib/costEstimator';
import { THUMB_RULES } from '@/lib/steelCalculator';
import { formatInr } from '@/lib/format';
import { buildWhatsAppUrl, getWhatsAppNumber } from '@/lib/whatsapp';
import { CalcInput, CalcLabel, CalcSelect, GlassPanel, SegmentOption } from './CalcField';

/**
 * Tool 3 — the Steel Cost & House Thumb-Rule Estimator.
 *
 * Two ways in:
 *
 *   • **By quantity** — the buyer already knows the tonnage.
 *   • **By built-up area** — the buyer has a floor plan and a thumb rule.
 *     The residential rule is 3.5–4.5 kg of steel per square foot; the
 *     commercial rule runs 5–7 kg/sq.ft.
 *
 * The answer is a *range*, because that is what the market quotes. The
 * low end is a mill-direct rate; the high end carries a stockist's margin,
 * a shorter lead time and a smaller truckload. Everything the estimate
 * does not include is listed below the result, because a tool that hides
 * its assumptions is worse than no tool at all.
 */
export default function CostEstimatorTool() {
  const [mode, setMode] = useState<'tons' | 'area'>('area');

  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const category = getCategory(categoryId);

  const [gradeId, setGradeId] = useState(category.grades[0].id);
  const grade = getGrade(category, gradeId);

  const [cityId, setCityId] = useState('kolkata');
  const city = getCity(cityId);

  const [tons, setTons] = useState(25);
  const [areaSqFt, setAreaSqFt] = useState(2000);
  const [ruleId, setRuleId] = useState(THUMB_RULES[0].id);
  const rule = THUMB_RULES.find((r) => r.id === ruleId) ?? THUMB_RULES[0];

  // Changing the category invalidates the grade, so snap it to the first
  // grade of the new category rather than leaving a stale selection.
  function selectCategory(id: string) {
    setCategoryId(id);
    setGradeId(getCategory(id).grades[0].id);
  }

  const areaTonnage = useMemo(
    () => tonnageFromArea(areaSqFt, rule),
    [areaSqFt, rule],
  );

  const effectiveTons = mode === 'area' ? areaTonnage.midTons : tons;

  const estimate = useMemo(
    () =>
      estimateCost({
        categoryId,
        gradeId,
        cityId,
        tons: effectiveTons,
        thumbRuleId: mode === 'area' ? rule.id : null,
        areaSqFt: mode === 'area' ? areaSqFt : undefined,
      }),
    [categoryId, gradeId, cityId, effectiveTons, mode, rule.id, areaSqFt],
  );

  const waMessage = useMemo(() => {
    const basis =
      mode === 'area'
        ? `${areaSqFt.toLocaleString('en-IN')} sq.ft built-up area (${rule.label}, ${rule.minKgPerSqFt}–${rule.maxKgPerSqFt} kg/sq.ft)`
        : `${tons} MT`;

    return [
      `Hi Singhi Enterprises, I need verified supplier quotes for ${category.label} — ${grade.label}.`,
      `Requirement: ${basis}.`,
      `Delivery city: ${city.label}, ${city.state}.`,
      'Please share your best rate, lead time and payment terms.',
    ].join(' ');
  }, [mode, areaSqFt, rule, tons, category, grade, city]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      {/* --- Inputs --- */}
      <GlassPanel>
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ss-orange">
            <IndianRupee className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-[1.05rem] font-semibold text-white">
              Cost Estimator
            </h3>
            <p className="text-[0.78rem] text-slate-500">
              Enter the requirement, pick the city, read the range.
            </p>
          </div>
        </div>

        {/* Basis */}
        <div className="mt-6">
          <CalcLabel htmlFor="est-mode">Estimate By</CalcLabel>
          <div id="est-mode" role="group" aria-label="Estimation basis" className="flex flex-wrap gap-2">
            <SegmentOption
              active={mode === 'area'}
              onClick={() => setMode('area')}
            >
              Built-up Area
            </SegmentOption>
            <SegmentOption
              active={mode === 'tons'}
              onClick={() => setMode('tons')}
            >
              Quantity (MT)
            </SegmentOption>
          </div>
        </div>

        {/* Quantity / area */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {mode === 'area' ? (
            <>
              <div>
                <CalcLabel htmlFor="est-area">Built-up Area (sq.ft)</CalcLabel>
                <CalcInput
                  id="est-area"
                  value={areaSqFt}
                  onChange={setAreaSqFt}
                  unit="sq.ft"
                  step={50}
                  min={0}
                />
              </div>
              <div>
                <CalcLabel htmlFor="est-rule">Thumb Rule</CalcLabel>
                <CalcSelect
                  id="est-rule"
                  value={ruleId}
                  onChange={setRuleId}
                >
                  {THUMB_RULES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </CalcSelect>
                <p className="mt-1.5 text-[0.72rem] text-slate-500">{rule.note}</p>
              </div>
            </>
          ) : (
            <div>
              <CalcLabel htmlFor="est-tons">Quantity (Metric Tonnes)</CalcLabel>
              <CalcInput
                id="est-tons"
                value={tons}
                onChange={setTons}
                unit="MT"
                step={1}
                min={0}
              />
            </div>
          )}
        </div>

        {/* Category / grade / city */}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <CalcLabel htmlFor="est-category">Category</CalcLabel>
            <CalcSelect
              id="est-category"
              value={categoryId}
              onChange={selectCategory}
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </CalcSelect>
          </div>

          <div>
            <CalcLabel htmlFor="est-grade">Grade</CalcLabel>
            <CalcSelect id="est-grade" value={gradeId} onChange={setGradeId}>
              {category.grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </CalcSelect>
          </div>
        </div>

        <div className="mt-4">
          <CalcLabel htmlFor="est-city">Delivery City</CalcLabel>
          <CalcSelect id="est-city" value={cityId} onChange={setCityId}>
            {CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}, {c.state}
              </option>
            ))}
          </CalcSelect>
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
                'radial-gradient(28rem 16rem at 88% 0%, rgba(37,99,235,0.2), transparent 66%)',
            }}
          />

          <div className="relative">
            <p className="ss-eyebrow text-ss-orange">Estimated Cost Range</p>

            <div className="mt-4">
              <span className="ss-tabular ss-h1 text-4xl text-white sm:text-5xl">
                {formatInr(estimate.lowTotal)}
              </span>
              <span className="ss-tabular px-2 text-2xl text-slate-500">–</span>
              <span className="ss-tabular ss-h1 text-4xl text-white sm:text-5xl">
                {formatInr(estimate.highTotal)}
              </span>
            </div>

            <p className="mt-2 text-[0.85rem] text-slate-400">
              Excluding GST, loading, unloading and site delivery.
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
              <div>
                <dt className="text-[0.72rem] uppercase tracking-[0.1em] text-slate-500">
                  Estimated tonnage
                </dt>
                <dd className="ss-tabular mt-1 text-[0.95rem] font-semibold text-white">
                  {estimate.totalTons.toFixed(2)} MT
                </dd>
                {mode === 'area' && (
                  <dd className="ss-tabular mt-0.5 text-[0.72rem] text-slate-500">
                    range {areaTonnage.minTons.toFixed(2)}–{areaTonnage.maxTons.toFixed(2)} MT
                  </dd>
                )}
              </div>
              <div>
                <dt className="text-[0.72rem] uppercase tracking-[0.1em] text-slate-500">
                  Landed rate
                </dt>
                <dd className="ss-tabular mt-1 text-[0.95rem] font-semibold text-white">
                  {formatInr(estimate.lowPerTon)} – {formatInr(estimate.highPerTon)}
                </dd>
                <dd className="ss-tabular mt-0.5 text-[0.72rem] text-slate-500">
                  per metric tonne
                </dd>
              </div>
            </dl>

            <div className="mt-5 space-y-2 border-t border-white/10 pt-5 text-[0.8rem]">
              {[
                { label: 'Base rate', value: formatInr(estimate.baseRatePerTon) + ' / MT' },
                {
                  label: `City factor (${city.label})`,
                  value: `${city.factor.toFixed(3)} ×`,
                },
                {
                  label: 'Freight',
                  value: `${formatInr(estimate.freightPerTon)} / MT`,
                },
                {
                  label: 'Freight total',
                  value: formatInr(estimate.freightTotal),
                },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <span className="text-slate-500">{row.label}</span>
                  <span className="ss-tabular font-semibold text-slate-300">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-lg border border-white/5 font-mono">
              <span>Est. Freight & Loading Ratio:</span>
              <span className="text-emerald-400 font-bold">~1.5% – 2.2% of total order value</span>
            </div>

            <a
              href={buildWhatsAppUrl(getWhatsAppNumber(), waMessage)}
              target="_blank"
              rel="noopener noreferrer"
              className="ss-molten mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold text-white shadow-lg"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Send This Custom Spec to Singhi Trade Desk for Final Ex-Mill Quote
            </a>

            <p className="mt-3 text-center text-[0.72rem] text-slate-500">
              * Approx. / Indicative ex-mill rates (exclusive of GST, freight, loading) — confirm before order.
            </p>
          </div>
        </GlassPanel>

        <GlassPanel>
          <p className="flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-slate-400">
            <TrendingUp className="h-4 w-4 text-ss-blue" aria-hidden="true" />
            What this range covers
          </p>
          <ul className="mt-3 space-y-2 text-[0.85rem] leading-relaxed text-slate-400">
            <li>
              The <strong className="text-slate-200">low end</strong> is a
              mill-direct rate on a full truckload with a normal lead time.
            </li>
            <li>
              The <strong className="text-slate-200">high end</strong> carries a
              stockist&rsquo;s margin, a shorter lead time and a smaller
              truckload.
            </li>
            <li>
              <MapPin className="mr-1 inline h-3.5 w-3.5" aria-hidden="true" />
              Freight is banded on the road distance from the mill belt to{' '}
              {city.label} ({city.distanceKm} km).
            </li>
            <li>
              <strong className="text-slate-200">Not included:</strong> GST,
              loading and unloading, site delivery, credit terms, and any
              mill allocation premium.
            </li>
          </ul>
        </GlassPanel>
      </div>
    </div>
  );
}
