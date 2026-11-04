'use content';
// @ts-nocheck
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Scale,
  Calculator,
  IndianRupee,
  Ruler,
  Percent,
  Truck,
  FileSpreadsheet,
  Clock,
  Building,
  ShieldCheck,
  Copy,
  Check,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { SHAPES, calculateShapeWeight } from '@/lib/steelCalculator';
import { formatInr, formatTons } from '@/lib/format';
import { buildWhatsAppUrl, getWhatsAppNumber } from '@/lib/whatsapp';
import { CalcInput, CalcLabel, GlassPanel, SegmentOption } from './CalcField';

export default function BusinessCalculatorsSuite() {
  const [activeTab, setActiveTab] = useState<
    'weight' | 'gst' | 'landed' | 'gauge' | 'udhaar' | 'roofing' | 'margin' | 'breakeven' | 'dispatch' | 'inventory'
  >('weight');

  const [copied, setCopied] = useState(false);

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Tool 1: Weight Calculator State
  const [shapeId, setShapeId] = useState<any>('round_tmt');
  const shape = useMemo(() => SHAPES.find((s) => s.id === shapeId) ?? SHAPES[0], [shapeId]);
  const [weightValues, setWeightValues] = useState<Record<string, number>>({
    size: 12,
    length: 12,
    quantity: 100,
  });
  const weightResult = useMemo(() => calculateShapeWeight(shape, weightValues), [shape, weightValues]);

  // Tool 2: GST Calculator State
  const [gstBaseAmount, setGstBaseAmount] = useState<number>(150000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [isInterState, setIsInterState] = useState<boolean>(false);
  const gstResult = useMemo(() => {
    const tax = (gstBaseAmount * gstRate) / 100;
    const total = gstBaseAmount + tax;
    const cgst = isInterState ? 0 : tax / 2;
    const sgst = isInterState ? 0 : tax / 2;
    const igst = isInterState ? tax : 0;
    return { base: gstBaseAmount, tax, total, cgst, sgst, igst };
  }, [gstBaseAmount, gstRate, isInterState]);

  // Tool 3: Landed Cost Estimator State
  const [exMillPrice, setExMillPrice] = useState<number>(54000);
  const [tonnage, setTonnage] = useState<number>(15);
  const [freightPerMt, setFreightPerMt] = useState<number>(2200);
  const [loadingPerMt, setloadingPerMt] = useState<number>(350);
  const landedResult = useMemo(() => {
    const baseTotal = exMillPrice * tonnage;
    const freightTotal = freightPerMt * tonnage;
    const loadingTotal = loadingPerMt * tonnage;
    const subtotal = baseTotal + freightTotal + loadingTotal;
    const gst = (subtotal * 0.18);
    const grandTotal = subtotal + gst;
    const perMtLanded = grandTotal / tonnage;
    return { baseTotal, freightTotal, loadingTotal, subtotal, gst, grandTotal, perMtLanded };
  }, [exMillPrice, tonnage, freightPerMt, loadingPerMt]);

  // Tool 4: Gauge to MM Converter State
  const [gauge, setGauge] = useState<string>('24G');
  const gaugeMap: Record<string, { mm: string; kgPerSqM: number; desc: string }> = {
    '22G': { mm: '0.80 mm', kgPerSqM: 6.28, desc: 'Heavy structural roofing & industrial sheds' },
    '24G': { mm: '0.63 mm', kgPerSqM: 4.95, desc: 'Standard commercial & residential roofing' },
    '26G': { mm: '0.50 mm', kgPerSqM: 3.92, desc: 'Lightweight cladding & false ceiling' },
    '28G': { mm: '0.40 mm', kgPerSqM: 3.14, desc: 'Economical flashing & wall partitions' },
    '30G': { mm: '0.32 mm', kgPerSqM: 2.51, desc: 'Light protective covers' },
  };

  // Tool 5: Udhaar & Overdue Interest Tracker State
  const [invoiceAmount, setInvoiceAmount] = useState<number>(350000);
  const [creditDays, setCreditDays] = useState<number>(30);
  const [daysDelayed, setDaysDelayed] = useState<number>(15);
  const interestResult = useMemo(() => {
    const monthlyRate = 0.015;
    const dailyRate = monthlyRate / 30;
    const interest = invoiceAmount * dailyRate * daysDelayed;
    const totalDue = invoiceAmount + interest;
    return { interest, totalDue };
  }, [invoiceAmount, creditDays, daysDelayed]);

  // Tool 6: Roofing Sheet Coverage Estimator State
  const [roofLengthM, setRoofLengthM] = useState<number>(18);
  const [roofWidthM, setRoofWidthM] = useState<number>(12);
  const [overlapPct, setOverlapPct] = useState<number>(10);
  const roofingResult = useMemo(() => {
    const areaSqM = roofLengthM * roofWidthM;
    const effectiveArea = areaSqM * (1 + overlapPct / 100);
    const sheetsNeeded = Math.ceil(effectiveArea / (roofLengthM * 1.05));
    return { areaSqM, effectiveArea, sheetsNeeded: Math.max(sheetsNeeded, 10) };
  }, [roofLengthM, roofWidthM, overlapPct]);

  // Tool 7: Profit Margin Calculator State
  const [unitCost, setUnitCost] = useState<number>(52000);
  const [targetMarginPct, setTargetMarginPct] = useState<number>(6.5);
  const marginResult = useMemo(() => {
    const sellingPrice = unitCost / (1 - targetMarginPct / 100);
    const profitPerMt = sellingPrice - unitCost;
    return { sellingPrice, profitPerMt };
  }, [unitCost, targetMarginPct]);

  // Tool 8: Break-Even & Quotation Builder State
  const [monthlyOverhead, setMonthlyOverhead] = useState<number>(150000);
  const [avgMarginPerMt, setAvgMarginPerMt] = useState<number>(1800);
  const breakEvenResult = useMemo(() => {
    const mtNeeded = avgMarginPerMt > 0 ? Math.ceil(monthlyOverhead / avgMarginPerMt) : 0;
    return { mtNeeded };
  }, [monthlyOverhead, avgMarginPerMt]);

  // Tool 9: Truck & Dispatch Planner State
  const [orderTons, setOrderTons] = useState<number>(24);
  const truckResult = useMemo(() => {
    let truckType = '20-ft Small Truck (9 MT)';
    let count = 1;
    if (orderTons <= 9) {
      truckType = 'Small Truck (9 MT Capacity)';
      count = 1;
    } else if (orderTons <= 16) {
      truckType = '10-Wheel Heavy Truck (16 MT Capacity)';
      count = 1;
    } else if (orderTons <= 25) {
      truckType = '14-Wheel Multi-Axle (25 MT Capacity)';
      count = 1;
    } else {
      count = Math.ceil(orderTons / 25);
      truckType = `${count} Multi-Axle Trailers`;
    }
    const utilization = Math.min(100, Math.round((orderTons / (count * 25)) * 100));
    return { truckType, count, utilization };
  }, [orderTons]);

  // Tool 10: Inventory Reorder & Valuation State
  const [dailySalesMt, setDailySalesMt] = useState<number>(3.5);
  const [leadTimeDays, setLeadTimeDays] = useState<number>(4);
  const [safetyStockDays, setSafetyStockDays] = useState<number>(3);
  const inventoryResult = useMemo(() => {
    const reorderPoint = dailySalesMt * (leadTimeDays + safetyStockDays);
    const stockValuation = reorderPoint * 54000;
    return { reorderPoint, stockValuation };
  }, [dailySalesMt, leadTimeDays, safetyStockDays]);

  const tabs = [
    { id: 'weight', label: '1. Steel Weight', icon: Scale },
    { id: 'gst', label: '2. GST & Proforma', icon: Percent },
    { id: 'landed', label: '3. Landed Cost', icon: IndianRupee },
    { id: 'gauge', label: '4. Gauge Converter', icon: Ruler },
    { id: 'udhaar', label: '5. Udhaar Tracker', icon: Clock },
    { id: 'roofing', label: '6. Roofing Estimator', icon: Building },
    { id: 'margin', label: '7. Profit Margin', icon: Calculator },
    { id: 'breakeven', label: '8. Break-Even Builder', icon: FileSpreadsheet },
    { id: 'dispatch', label: '9. Truck Dispatch', icon: Truck },
    { id: 'inventory', label: '10. Inventory ROP', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-8">
      {/* Tool Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-2 ss-no-scrollbar border-b border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-ss-orange text-white shadow-lg shadow-orange-500/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* --- Tool 1: Steel Weight Calculator --- */}
      {activeTab === 'weight' && (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <GlassPanel>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ss-orange">
                <Scale className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">Steel Weight &amp; Section Calculator</h3>
                <p className="text-xs text-slate-400">IS 1786 TMT formula (d² / 162.2) &amp; structural standards.</p>
              </div>
            </div>

            <div className="mt-6">
              <CalcLabel htmlFor="calc-shape">Select Shape</CalcLabel>
              <div id="calc-shape" className="flex flex-wrap gap-2">
                {SHAPES.map((s) => (
                  <SegmentOption
                    key={s.id}
                    active={s.id === shapeId}
                    onClick={() => {
                      setShapeId(s.id);
                      const defs: Record<string, number> = {};
                      s.fields.forEach((f) => (defs[f.key] = f.defaultValue));
                      setWeightValues(defs);
                    }}
                  >
                    {s.label}
                  </SegmentOption>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {shape.fields.map((field) => (
                <div key={field.key}>
                  <CalcLabel htmlFor={`calc-${field.key}`}>{field.label} ({field.unit})</CalcLabel>
                  <CalcInput
                    id={`calc-${field.key}`}
                    value={weightValues[field.key] ?? field.defaultValue}
                    onChange={(val) => setWeightValues((prev) => ({ ...prev, [field.key]: val }))}
                    unit={field.unit}
                    step={field.step}
                    min={field.min}
                  />
                </div>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="relative">
            <p className="ss-eyebrow text-ss-orange">Calculated Weight Result</p>
            <div className="mt-4 flex items-end gap-2">
              <span className="ss-tabular text-5xl font-extrabold text-white">
                {weightResult.totalKg.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </span>
              <span className="pb-2 text-lg font-semibold text-slate-300">kg</span>
            </div>
            <p className="mt-2 text-sm text-ss-orange font-semibold">
              {formatTons(weightResult.totalTons)} MT ({weightResult.pieces} nos)
            </p>

            <div className="mt-6 flex flex-col gap-3 pt-6 border-t border-white/10">
              <button
                onClick={() => handleCopy(`Steelsetu Weight Calc: ${weightResult.totalKg.toFixed(2)} kg (${weightResult.totalTons.toFixed(3)} MT) for ${shape.label}`)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Calculation Result'}
              </button>
              <a
                href={buildWhatsAppUrl(getWhatsAppNumber(), `Hi Singhi Trade Desk, enquiry for ${weightResult.totalKg.toFixed(2)} kg (${weightResult.totalTons.toFixed(3)} MT) ${shape.label}. Please share Burrabazar mill rates.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="ss-molten flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-semibold text-white shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                Share via WhatsApp
              </a>
              <Link
                href="/user-login?intent=post"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-600/90 text-xs font-semibold text-white hover:bg-blue-500 transition-colors"
              >
                Lock Rate &amp; Convert to RFQ
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* --- Tool 2: GST & Proforma Calculator --- */}
      {activeTab === 'gst' && (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <GlassPanel>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ss-orange">
                <Percent className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">GST &amp; Proforma Invoice Calculator</h3>
                <p className="text-xs text-slate-400">Compute CGST + SGST (Intra-state) or IGST (Inter-state) for B2B orders.</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <CalcLabel htmlFor="gst-base">Base Amount (₹)</CalcLabel>
                <CalcInput
                  id="gst-base"
                  value={gstBaseAmount}
                  onChange={setGstBaseAmount}
                  unit="₹"
                  step={5000}
                  min={1000}
                />
              </div>

              <div className="flex gap-2">
                {[50000, 150000, 500000, 1000000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setGstBaseAmount(preset)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white"
                  >
                    ₹{(preset / 100000).toFixed(1)}L
                  </button>
                ))}
              </div>

              <div>
                <CalcLabel htmlFor="gst-rate">GST Rate (%)</CalcLabel>
                <div id="gst-rate" className="flex gap-3">
                  {[18, 12, 28].map((rate) => (
                    <SegmentOption
                      key={rate}
                      active={gstRate === rate}
                      onClick={() => setGstRate(rate)}
                    >
                      {rate}% Steel
                    </SegmentOption>
                  ))}
                </div>
              </div>

              <div>
                <CalcLabel htmlFor="supply-type">Supply Type</CalcLabel>
                <div id="supply-type" className="flex gap-3">
                  <SegmentOption active={!isInterState} onClick={() => setIsInterState(false)}>
                    Intra-State (CGST+SGST)
                  </SegmentOption>
                  <SegmentOption active={isInterState} onClick={() => setIsInterState(true)}>
                    Inter-State (IGST)
                  </SegmentOption>
                </div>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="relative">
            <p className="ss-eyebrow text-ss-orange">GST Proforma Summary</p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">Base Amount:</span>
                <span className="ss-tabular font-semibold text-white">{formatInr(gstResult.base)}</span>
              </div>
              {!isInterState ? (
                <>
                  <div className="flex justify-between pb-2 border-b border-white/10">
                    <span className="text-slate-400">CGST ({gstRate / 2}%):</span>
                    <span className="ss-tabular font-semibold text-slate-200">{formatInr(gstResult.cgst)}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-white/10">
                    <span className="text-slate-400">SGST ({gstRate / 2}%):</span>
                    <span className="ss-tabular font-semibold text-slate-200">{formatInr(gstResult.sgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between pb-2 border-b border-white/10">
                  <span className="text-slate-400">IGST ({gstRate}%):</span>
                  <span className="ss-tabular font-semibold text-slate-200">{formatInr(gstResult.igst)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2">
                <span className="text-base font-bold text-white">Grand Total (Inc. GST):</span>
                <span className="ss-tabular text-xl font-extrabold text-ss-orange">{formatInr(gstResult.total)}</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => handleCopy(`Steelsetu Invoice Proforma: Base ${formatInr(gstResult.base)} + GST ${formatInr(gstResult.tax)} = Total ${formatInr(gstResult.total)}`)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Proforma Summary'}
              </button>
              <a
                href={buildWhatsAppUrl(getWhatsAppNumber(), `Hi Singhi Trade Desk, confirming proforma order value of ${formatInr(gstResult.total)} (Base ${formatInr(gstResult.base)} + ${gstRate}% GST). Please dispatch proforma invoice.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="ss-molten flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-semibold text-white shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                Share via WhatsApp
              </a>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* --- Tool 3: Landed Cost Estimator --- */}
      {activeTab === 'landed' && (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <GlassPanel>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ss-orange">
                <IndianRupee className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">Landed Cost Estimator</h3>
                <p className="text-xs text-slate-400">Calculate total destination site cost per MT including freight &amp; handling.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <CalcLabel htmlFor="ex-mill">Ex-Mill Rate (₹/MT)</CalcLabel>
                <CalcInput id="ex-mill" value={exMillPrice} onChange={setExMillPrice} unit="₹" step={500} min={40000} />
              </div>
              <div>
                <CalcLabel htmlFor="tonnage">Order Quantity (MT)</CalcLabel>
                <CalcInput id="tonnage" value={tonnage} onChange={setTonnage} unit="MT" step={1} min={1} />
              </div>
              <div>
                <CalcLabel htmlFor="freight">Freight Rate (₹/MT)</CalcLabel>
                <CalcInput id="freight" value={freightPerMt} onChange={setFreightPerMt} unit="₹" step={100} min={500} />
              </div>
              <div>
                <CalcLabel htmlFor="loading">Loading &amp; Handling (₹/MT)</CalcLabel>
                <CalcInput id="loading" value={loadingPerMt} onChange={setloadingPerMt} unit="₹" step={50} min={100} />
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="relative">
            <p className="ss-eyebrow text-ss-orange">Landed Cost Breakdown</p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">Ex-Mill Material:</span>
                <span className="ss-tabular font-semibold text-white">{formatInr(landedResult.baseTotal)}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">Transport &amp; Freight:</span>
                <span className="ss-tabular font-semibold text-slate-200">{formatInr(landedResult.freightTotal)}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">Loading &amp; Handling:</span>
                <span className="ss-tabular font-semibold text-slate-200">{formatInr(landedResult.loadingTotal)}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">GST (18%):</span>
                <span className="ss-tabular font-semibold text-slate-200">{formatInr(landedResult.gst)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-base font-bold text-white">Landed Total (₹):</span>
                <span className="ss-tabular text-xl font-extrabold text-ss-orange">{formatInr(landedResult.grandTotal)}</span>
              </div>
              <p className="text-xs text-slate-400 pt-2">
                Effective Landed Cost: <strong className="text-white">{formatInr(landedResult.perMtLanded)} / MT</strong>
              </p>
            </div>

            <div className="mt-8">
              <button
                onClick={() => handleCopy(`Steelsetu Landed Cost: ${tonnage} MT at ${formatInr(landedResult.perMtLanded)}/MT. Total Landed: ${formatInr(landedResult.grandTotal)}`)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-white hover:bg-white/10 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Landed Breakdown'}
              </button>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* --- Tool 4: Gauge to MM Converter --- */}
      {activeTab === 'gauge' && (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <GlassPanel>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ss-orange">
                <Ruler className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">Sheet Gauge &amp; Thickness Converter</h3>
                <p className="text-xs text-slate-400">Standard Birmingham Wire Gauge (SWG) to Millimetres &amp; kg/m².</p>
              </div>
            </div>

            <div className="mt-6">
              <CalcLabel htmlFor="gauge-select">Select Sheet Gauge</CalcLabel>
              <div id="gauge-select" className="flex flex-wrap gap-2">
                {Object.keys(gaugeMap).map((g) => (
                  <SegmentOption key={g} active={gauge === g} onClick={() => setGauge(g)}>
                    {g}
                  </SegmentOption>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs font-mono text-ss-orange uppercase tracking-wider">Gauge Specification</p>
              <p className="text-2xl font-bold text-white mt-1">{gauge} ({gaugeMap[gauge].mm})</p>
              <p className="text-xs text-slate-300 mt-2">{gaugeMap[gauge].desc}</p>
            </div>
          </GlassPanel>

          <GlassPanel className="relative">
            <p className="ss-eyebrow text-ss-orange">Weight &amp; Application Metrics</p>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase">Surface Density</p>
                <p className="text-xl font-bold text-white mt-1 ss-tabular">{gaugeMap[gauge].kgPerSqM} kg / m²</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase">Micrometer Tolerance</p>
                <p className="text-sm text-slate-200 mt-1">±0.03 mm mill rolling tolerance permissible under IS 277.</p>
              </div>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* --- Tool 5: Udhaar & Overdue Interest Tracker --- */}
      {activeTab === 'udhaar' && (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <GlassPanel>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ss-orange">
                <Clock className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">Udhaar &amp; Overdue Interest Tracker</h3>
                <p className="text-xs text-slate-400">Calculate 1.5%/month simple interest on delayed B2B steel credit payments.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <CalcLabel htmlFor="inv-amt">Invoice Amount (₹)</CalcLabel>
                <CalcInput id="inv-amt" value={invoiceAmount} onChange={setInvoiceAmount} unit="₹" step={10000} min={10000} />
              </div>
              <div>
                <CalcLabel htmlFor="cred-days">Credit Term (Days)</CalcLabel>
                <CalcInput id="cred-days" value={creditDays} onChange={setCreditDays} unit="Days" step={5} min={0} />
              </div>
              <div className="sm:col-span-2">
                <CalcLabel htmlFor="delay-days">Payment Delay Beyond Credit Term (Days)</CalcLabel>
                <CalcInput id="delay-days" value={daysDelayed} onChange={setDaysDelayed} unit="Days" step={1} min={0} />
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="relative">
            <p className="ss-eyebrow text-ss-orange">Overdue Summary</p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">Principal Invoice:</span>
                <span className="ss-tabular font-semibold text-white">{formatInr(invoiceAmount)}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-slate-400">Delay Interest (1.5%/mo):</span>
                <span className="ss-tabular font-semibold text-amber-400">{formatInr(interestResult.interest)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-base font-bold text-white">Total Payable Amount:</span>
                <span className="ss-tabular text-xl font-extrabold text-ss-orange">{formatInr(interestResult.totalDue)}</span>
              </div>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* --- Tool 6: Roofing Sheet Quantity Estimator --- */}
      {activeTab === 'roofing' && (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <GlassPanel>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ss-orange">
                <Building className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">Roofing Sheet Quantity &amp; Wastage Estimator</h3>
                <p className="text-xs text-slate-400">Estimate corrugated / PPGL sheet count with overlap allowances.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <CalcLabel htmlFor="roof-len">Roof Length (m)</CalcLabel>
                <CalcInput id="roof-len" value={roofLengthM} onChange={setRoofLengthM} unit="m" step={1} min={2} />
              </div>
              <div>
                <CalcLabel htmlFor="roof-wid">Roof Width (m)</CalcLabel>
                <CalcInput id="roof-wid" value={roofWidthM} onChange={setRoofWidthM} unit="m" step={1} min={2} />
              </div>
              <div>
                <CalcLabel htmlFor="overlap">Overlap &amp; Wastage (%)</CalcLabel>
                <CalcInput id="overlap" value={overlapPct} onChange={setOverlapPct} unit="%" step={1} min={5} />
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="relative">
            <p className="ss-eyebrow text-ss-orange">Roofing Estimation Result</p>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase">Total Roof Area</p>
                <p className="text-2xl font-bold text-white mt-1 ss-tabular">{roofingResult.areaSqM.toFixed(1)} m²</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase">Recommended Sheet Count (Inc. Overlap)</p>
                <p className="text-3xl font-extrabold text-ss-orange mt-1 ss-tabular">{roofingResult.sheetsNeeded} Sheets</p>
              </div>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* --- Tool 7: Steel Profit Margin Calculator --- */}
      {activeTab === 'margin' && (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <GlassPanel>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ss-orange">
                <Calculator className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">Steel Trading Profit Margin Calculator</h3>
                <p className="text-xs text-slate-400">Calculate wholesale selling price per MT based on target percentage margin.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <CalcLabel htmlFor="unit-cost">Unit Purchase Cost (₹/MT)</CalcLabel>
                <CalcInput id="unit-cost" value={unitCost} onChange={setUnitCost} unit="₹" step={500} min={30000} />
              </div>
              <div>
                <CalcLabel htmlFor="target-margin">Target Margin (%)</CalcLabel>
                <CalcInput id="target-margin" value={targetMarginPct} onChange={setTargetMarginPct} unit="%" step={0.5} min={1} />
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="relative">
            <p className="ss-eyebrow text-ss-orange">Pricing Recommendation</p>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase">Recommended Selling Price</p>
                <p className="text-2xl font-extrabold text-white mt-1 ss-tabular">{formatInr(marginResult.sellingPrice)} / MT</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase">Gross Profit per MT</p>
                <p className="text-lg font-bold text-emerald-400 mt-1 ss-tabular">+{formatInr(marginResult.profitPerMt)} / MT</p>
              </div>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* --- Tool 8: Break-Even & Quotation Builder --- */}
      {activeTab === 'breakeven' && (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <GlassPanel>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ss-orange">
                <FileSpreadsheet className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">Stockist Break-Even &amp; Volume Calculator</h3>
                <p className="text-xs text-slate-400">Calculate monthly tonnage required to cover warehouse overhead.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <CalcLabel htmlFor="overhead">Monthly Overhead (₹)</CalcLabel>
                <CalcInput id="overhead" value={monthlyOverhead} onChange={setMonthlyOverhead} unit="₹" step={10000} min={50000} />
              </div>
              <div>
                <CalcLabel htmlFor="avg-margin">Avg Margin per MT (₹)</CalcLabel>
                <CalcInput id="avg-margin" value={avgMarginPerMt} onChange={setAvgMarginPerMt} unit="₹" step={100} min={500} />
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="relative">
            <p className="ss-eyebrow text-ss-orange">Break-Even Tonnage</p>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase">Minimum Monthly Volume</p>
                <p className="text-3xl font-extrabold text-ss-orange mt-1 ss-tabular">{breakEvenResult.mtNeeded} MT</p>
                <p className="text-xs text-slate-400 mt-2">To cover ₹{monthlyOverhead.toLocaleString('en-IN')} operating overhead.</p>
              </div>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* --- Tool 9: Truck & Dispatch Planner --- */}
      {activeTab === 'dispatch' && (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <GlassPanel>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ss-orange">
                <Truck className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">Truck &amp; Transport Dispatch Planner</h3>
                <p className="text-xs text-slate-400">Optimize vehicle allocation (9MT to 40MT trailers) for Burrabazar dispatches.</p>
              </div>
            </div>

            <div className="mt-6">
              <CalcLabel htmlFor="order-tons">Order Tonnage (MT)</CalcLabel>
              <CalcInput id="order-tons" value={orderTons} onChange={setOrderTons} unit="MT" step={1} min={1} />
            </div>
          </GlassPanel>

          <GlassPanel className="relative">
            <p className="ss-eyebrow text-ss-orange">Logistics Allocation</p>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase">Recommended Vehicle</p>
                <p className="text-xl font-bold text-white mt-1">{truckResult.truckType}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase">Capacity Utilization</p>
                <p className="text-2xl font-extrabold text-ss-orange mt-1 ss-tabular">{truckResult.utilization}%</p>
              </div>
            </div>
          </GlassPanel>
        </div>
      )}

      {/* --- Tool 10: Inventory Reorder & Valuation --- */}
      {activeTab === 'inventory' && (
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <GlassPanel>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ss-orange">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-lg font-semibold text-white">Inventory Reorder Point &amp; Valuation</h3>
                <p className="text-xs text-slate-400">Calculate stock safety thresholds and working capital valuation.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div>
                <CalcLabel htmlFor="daily-sales">Daily Sales (MT)</CalcLabel>
                <CalcInput id="daily-sales" value={dailySalesMt} onChange={setDailySalesMt} unit="MT" step={0.5} min={0.5} />
              </div>
              <div>
                <CalcLabel htmlFor="lead-time">Supplier Lead Time (Days)</CalcLabel>
                <CalcInput id="lead-time" value={leadTimeDays} onChange={setLeadTimeDays} unit="Days" step={1} min={1} />
              </div>
              <div>
                <CalcLabel htmlFor="safety-stock">Safety Stock Buffer (Days)</CalcLabel>
                <CalcInput id="safety-stock" value={safetyStockDays} onChange={setSafetyStockDays} unit="Days" step={1} min={1} />
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="relative">
            <p className="ss-eyebrow text-ss-orange">Inventory Metrics</p>
            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs text-slate-400 uppercase">Reorder Point (ROP)</p>
                <p className="text-2xl font-bold text-white mt-1 ss-tabular">{inventoryResult.reorderPoint.toFixed(1)} MT</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase">Required Working Capital Valuation</p>
                <p className="text-2xl font-extrabold text-ss-orange mt-1 ss-tabular">{formatInr(inventoryResult.stockValuation)}</p>
              </div>
            </div>
          </GlassPanel>
        </div>
      )}
    </div>
  );
}
