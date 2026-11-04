'use client';

import { useState } from 'react';
import { SteelProduct } from '@/types/steel';
import { formatInr, formatTons } from '@/lib/format';
import { X, Send, CheckCircle2, Loader2, AlertCircle, ShieldCheck, Calculator, Sparkles } from 'lucide-react';

interface RfqModalProps {
  product: SteelProduct | null;
  onClose: () => void;
}

export default function RfqModal({ product, onClose }: RfqModalProps) {
  // Smart Defaults (UX Psychology #1)
  const [buyerName, setBuyerName] = useState('Rajesh Sharma');
  const [companyName, setCompanyName] = useState('Apex Infra & Builders Pvt Ltd');
  const [gstNumber, setGstNumber] = useState('19AABCA1234F1Z8');
  const [tons, setTons] = useState<string>(String(product?.minimumOrderTons || 10));
  const [pincode, setPincode] = useState('700001');
  const [deliveryLocation, setDeliveryLocation] = useState('Kolkata / Eastern India Hub');
  const [customGrade, setCustomGrade] = useState(product?.grade || 'IS 1786 Fe 500D / IS 2062 E250');
  const [customSpecs, setCustomSpecs] = useState('Standard Mill Length (12m) with MTC');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [referenceId, setReferenceId] = useState<string | null>(null);

  if (!product) return null;

  const numericTons = parseFloat(tons) || 10;
  const estimatedMaterialValue = numericTons * product.pricePerTonInr;
  const estimatedFreightLoading = Math.round(estimatedMaterialValue * 0.018); // ~1.8% contrast effect anchoring

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/rfq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyerName,
          companyName,
          gstNumber,
          tons: numericTons,
          productId: product.id,
          pincode,
          customSpecs: `${customGrade} | Location: ${deliveryLocation} | ${customSpecs}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit RFQ inquiry');
      }

      setReferenceId(data.data.referenceId);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {referenceId ? (
          <div className="text-center py-10 space-y-4">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-2xl font-bold text-white">Mill RFQ Successfully Logged</h3>
            <p className="text-xs font-mono text-emerald-400 uppercase tracking-widest bg-emerald-950/60 border border-emerald-800 py-1 px-3 rounded-full inline-block">
              Reference: {referenceId}
            </p>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your custom mill spec for <span className="font-bold text-white">{numericTons} MT</span> of{' '}
              <span className="text-blue-400 font-medium">{product.name}</span> has been dispatched to Singhi Trade Desk allocation queue.
            </p>
            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors shadow-lg"
              >
                Close & Return to Catalogue
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Goal Gradient Progress Bar (UX Psychology #2) */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 50% Complete — Step 2: Customizing Spec
                </span>
                <span className="text-slate-400">Step 2 of 2</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full w-1/2 transition-all duration-500" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                  Smart Default RFQ Flow
                </span>
                <span className="text-xs text-slate-400 font-mono">Burrabazar Desk</span>
              </div>
              <h3 className="text-xl font-bold text-white mt-1.5">{product.name}</h3>
              <p className="text-xs text-slate-400 font-mono">SKU: {product.sku} | Brand: {product.brand || 'Prime Mill'}</p>
            </div>

            {/* Loss Aversion Trust Badge (UX Psychology #5) */}
            <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-xl text-xs text-blue-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Risk Protection Guaranteed:</span> Verified Mill-Edge / ISI Gauge. Avoid 8–12% under-gauge market loss with certified test certificates.
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Contact Person</label>
                  <input
                    required
                    type="text"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Company Name</label>
                  <input
                    required
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">GSTIN (15 Digits)</label>
                  <input
                    required
                    type="text"
                    maxLength={15}
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Quantity (Tons / MT)</label>
                  <input
                    required
                    type="number"
                    min={product.minimumOrderTons || 1}
                    value={tons}
                    onChange={(e) => setTons(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Delivery Pincode</label>
                  <input
                    required
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Steel Grade / Specification</label>
                  <input
                    type="text"
                    value={customGrade}
                    onChange={(e) => setCustomGrade(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Destination Hub</label>
                  <input
                    type="text"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* IKEA Effect / Endowment Effect Live Preview Card (UX Psychology #3) */}
              <div className="rounded-xl border border-blue-500/40 bg-slate-950 p-4 space-y-2 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-blue-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Your Custom Mill Procurement Spec Sheet
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded">
                    Live Preview
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 font-mono text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Quantity</span>
                    <span className="font-bold text-white">{numericTons} MT</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Grade</span>
                    <span className="truncate block text-white">{customGrade}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Est. Material Value</span>
                    <span className="font-bold text-emerald-400">{formatInr(estimatedMaterialValue)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Est. Freight & Loading</span>
                    <span className="text-slate-300">~{formatInr(estimatedFreightLoading)} <span className="text-[9px] text-slate-500">(~1.8%)</span></span>
                  </div>
                </div>
              </div>

              {/* Mandatory rate policy */}
              <p className="text-[10px] text-slate-500 font-mono">
                * Approx. / Indicative ex-mill rates (exclusive of GST, freight, loading) — confirm before order.
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl bg-slate-800 px-5 py-2.5 font-medium text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-500 transition-colors disabled:opacity-50 shadow-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Submit RFQ to Trade Desk
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
