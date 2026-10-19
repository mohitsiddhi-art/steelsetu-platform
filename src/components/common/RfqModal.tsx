'use client';

import { useState } from 'react';
import { SteelProduct } from '@/types/steel';
import { X, Send, CheckCircle2 } from 'lucide-react';

interface RfqModalProps {
  product: SteelProduct | null;
  onClose: () => void;
}

export default function RfqModal({ product, onClose }: RfqModalProps) {
  const [buyerName, setBuyerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [tons, setTons] = useState<number>(product?.minimumOrderTons || 5);
  const [pincode, setPincode] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!product) return null;

  const estimatedValue = (tons || 0) * product.pricePerTonInr;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Inquiry Dispatched</h3>
            <p className="text-sm text-slate-300">
              Your inquiry for <span className="font-semibold text-white">{tons} MT</span> of{' '}
              <span className="text-blue-400">{product.name}</span> has been logged. Our trading desk will verify mill allocation and contact you within 2 hours.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                Request Formal Quotation
              </span>
              <h3 className="text-lg font-bold text-white mt-1">{product.name}</h3>
              <p className="text-xs text-slate-400 font-mono">SKU: {product.sku}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Contact Person</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Rajesh Sharma"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Company / Enterprise</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Apex Infra Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">GSTIN Number</label>
                <input
                  required
                  type="text"
                  placeholder="22AAAAA0000A1Z5"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono uppercase"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Delivery Pincode</label>
                <input
                  required
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 700001"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Required Quantity (Metric Tons)</span>
                <span>Min: {product.minimumOrderTons} MT</span>
              </div>
              <input
                required
                type="number"
                min={product.minimumOrderTons}
                max={product.inventoryTons}
                step="0.5"
                value={tons}
                onChange={(e) => setTons(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Estimated Material Value (Ex-Mill):</span>
              <span className="font-mono font-bold text-white text-sm">
                ₹{estimatedValue.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/30"
            >
              <Send className="w-4 h-4" />
              Submit RFQ for Mill Allocation
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
