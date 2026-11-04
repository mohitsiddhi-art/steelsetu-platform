'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Upload, X, FileText, Lock } from 'lucide-react';

interface DisputeLedgerModalProps {
  supplierName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function DisputeLedgerModal({ supplierName, isOpen, onClose }: DisputeLedgerModalProps) {
  const [invoiceNo, setInvoiceNo] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [issueType, setIssueType] = useState('under_gauge');
  const [description, setDescription] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofFile) {
      setErrorMsg('Mandatory Proof Required: Please attach weighbridge slip, MTC or gauge photo before lodging claim.');
      return;
    }
    setErrorMsg('');
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-orange-950 border border-orange-800 text-ss-orange">
            <ShieldAlert className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-xl font-bold font-display text-white">Raise Trade / Quality Concern</h3>
            <p className="text-xs text-slate-400 font-mono">Strict Admin-Authored Dispute Ledger — {supplierName}</p>
          </div>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-white">Concern Lodged Successfully with Proof</h4>
            <p className="text-xs text-slate-300">
              Submitted to Platform Admin (Singhi Enterprises Trade Desk) for review and validation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="rounded-xl bg-red-950/80 border border-red-800 p-3 text-xs text-red-200 font-mono flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Invoice / Challan No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. INV-2026-884"
                  value={invoiceNo}
                  onChange={(e) => setInvoiceNo(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Mill Batch / Heat No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HT-99420"
                  value={batchNo}
                  onChange={(e) => setBatchNo(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Issue Category</label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="under_gauge">Under-Gauge / Thickness Deficiency</option>
                <option value="transit_rust">Transit Rust / Atmospheric Oxidation</option>
                <option value="weight_shortage">Weighbridge Shortage vs Invoice</option>
                <option value="mtc_mismatch">Mill Test Certificate (MTC) Mismatch</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Detailed Description</label>
              <textarea
                rows={2}
                required
                placeholder="Describe variance, weighbridge slip number, or photographic evidence..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-amber-400 mb-1 flex items-center gap-1">
                <Lock className="w-3.5 h-3.5" /> Mandatory Proof Upload (Weighbridge / MTC / Gauge Photo) *
              </label>
              <div className="border border-dashed border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500 transition-colors bg-slate-950/60 relative">
                <input
                  type="file"
                  required
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProofFile(e.target.files[0]);
                      setErrorMsg('');
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                <span className="text-xs text-slate-300 font-mono">
                  {proofFile ? `Attached: ${proofFile.name}` : 'Click or drop documentary proof file here (PDF/JPG/PNG)'}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-ss-orange hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-colors shadow-lg"
            >
              Submit Claim for Admin Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
