'use client';

import { TechnicalQaItem } from '@/services/communityService';
import { ThumbsUp, MessageSquare, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

export default function QuestionCard({ item }: { item: TechnicalQaItem }) {
  const [upvotes, setUpvotes] = useState(item.upvotes);
  const [voted, setVoted] = useState(false);

  function handleUpvote() {
    if (voted) {
      setUpvotes(upvotes - 1);
      setVoted(false);
    } else {
      setUpvotes(upvotes + 1);
      setVoted(true);
    }
  }

  return (
    <div className="ss-glass rounded-2xl p-5 border border-white/10 hover:border-blue-500/30 transition-all">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-md text-[10px] font-mono font-bold">
              {item.standardRef}
            </span>
            {item.isVerifiedAnswer && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-800/60">
                <CheckCircle2 size={12} /> Verified Standard Expert Answer
              </span>
            )}
          </div>
          <h4 className="text-sm font-bold text-white hover:text-ss-blue transition-colors">{item.title}</h4>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mb-4">{item.content}</p>

      <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-200">{item.author}</span>
          <span className="text-slate-500">({item.company})</span>
          <span className="text-slate-600 font-mono">• {item.createdAt}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleUpvote}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
              voted
                ? 'bg-blue-600 text-white border-blue-500'
                : 'bg-white/5 text-slate-300 border-white/10 hover:border-white/20'
            }`}
          >
            <ThumbsUp size={13} />
            <span className="font-mono font-bold">{upvotes}</span>
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-slate-300">
            <MessageSquare size={13} />
            <span className="font-mono font-bold">{item.repliesCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
