'use client';

import { useState } from 'react';
import { ShieldAlert, X, Send, MessageCircle } from 'lucide-react';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComplaintModal({ isOpen, onClose }: ComplaintModalProps) {
  const [buyerName, setBuyerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [discrepancyType, setDiscrepancyType] = useState('Weighbridge Shortage');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  function handleWhatsAppSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!buyerName || !mobile || !description) {
      alert('Please fill in your name, mobile, and complaint description.');
      return;
    }

    const message = `🛡️ *OFFICIAL COMPLAINT & DISPUTE DESK* 🛡️\n\n*Buyer Name:* ${buyerName}\n*Mobile:* ${mobile}\n*Invoice / Challan No:* ${invoiceNo || 'N/A'}\n*Discrepancy:* ${discrepancyType}\n\n*Description:* ${description}\n\n_Escalated via Steelsetu Trade Desk Platform_`;

    const whatsappUrl = `https://wa.me/919883051500?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-rose-500/40 bg-slate-900 p-6 shadow-2xl space-y-6 text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-950 border border-rose-800 text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-white">Complaint Box &amp; Dispute Desk</h3>
              <p className="text-xs text-slate-400">Singhi Enterprises Quality Redressal &amp; Grievance Redressal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleWhatsAppSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Buyer / Firm Name *</label>
              <input
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="e.g. Acme Builders"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder-slate-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Contact Mobile *</label>
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 98310 00000"
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Invoice / Challan No.</label>
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                placeholder="e.g. SS/26-27/894"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white placeholder-slate-500 font-mono"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Discrepancy Type</label>
              <select
                value={discrepancyType}
                onChange={(e) => setDiscrepancyType(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white font-medium"
              >
                <option value="Weighbridge Shortage">Weighbridge Shortage</option>
                <option value="Gauge Variation">Gauge / Thickness Variation</option>
                <option value="Rust / Transit Damage">Rust / Transit Damage</option>
                <option value="Specification Mismatch">Specification Mismatch</option>
                <option value="Other Grievance">Other Grievance</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Detailed Description of Discrepancy *</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe truck number, weighbridge slip discrepancy, or photos available..."
              required
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white placeholder-slate-500 leading-relaxed font-sans"
            />
          </div>

          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-900/60 text-[11px] text-amber-300 font-mono leading-relaxed">
            ⚠️ Submitting this form opens a direct verified WhatsApp chat with Singhi Enterprises Dispute Desk (+91 98830 51500) with your structured grievance details for rapid resolution.
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 font-semibold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-white shadow-lg shadow-emerald-600/20 inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Send to WhatsApp Desk
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
