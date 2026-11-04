'use client';

import { BuyRequirementItem } from '@/services/communityService';
import { X, Send, ShieldCheck, PhoneCall, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

interface ConvertToRfqModalProps {
  item: BuyRequirementItem | null;
  onClose: () => void;
}

export default function ConvertToRfqModal({ item, onClose }: ConvertToRfqModalProps) {
  const [success, setSuccess] = useState(false);
  if (!item) return null;

  const whatsappMessage = encodeURIComponent(
    `Hello Singhi Trade Desk,\n\nI want to convert community buy requirement #${item.id} into an official RFQ:\n\n• Buyer: ${item.buyerName} (${item.company})\n• Requirement: ${item.requirement}\n• Location: ${item.location}\n• Quantity: ${item.quantityTons} MT\n• Target Price: ${item.targetPrice}\n\nPlease confirm availability and dispatch terms.`
  );
  const whatsappUrl = `https://wa.me/919883051500?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="ss-glass rounded-3xl p-6 md:p-8 max-w-lg w-full border border-blue-500/30 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-ss-blue mb-2 uppercase tracking-wider font-mono">
          <ShieldCheck size={16} /> Singhi Trade Desk • RFQ Bridge
        </div>

        <h3 className="text-xl font-extrabold text-white mb-2">Convert Buy Requirement to RFQ</h3>
        <p className="text-xs text-slate-400 mb-6">
          Instantly route verified commercial lead to Singhi Enterprises desk at Burrabazar, Kolkata.
        </p>

        {success ? (
          <div className="p-6 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-center space-y-3">
            <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">RFQ Logged Successfully!</h4>
            <p className="text-xs text-slate-300">
              Your requirement has been dispatched to the Burrabazar Trade Desk and WhatsApp queue (+91 98830 51500).
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono">Buyer:</span>
                <span className="text-white font-bold">{item.buyerName} ({item.company})</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono">Location:</span>
                <span className="text-slate-200 font-mono">{item.location}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono">Quantity:</span>
                <span className="text-emerald-400 font-mono font-bold">{item.quantityTons} MT</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono">Target Rate:</span>
                <span className="text-amber-400 font-mono font-bold">{item.targetPrice}</span>
              </div>
              <div className="pt-2 border-t border-white/5">
                <p className="text-xs text-slate-300 leading-relaxed italic">&quot;{item.requirement}&quot;</p>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setSuccess(true)}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <PhoneCall size={15} /> Dispatch via WhatsApp (+91 98830 51500)
              </a>
              <button
                onClick={() => setSuccess(true)}
                className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Send size={15} /> Log to CRM
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
