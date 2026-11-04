'use client';

import { useState } from 'react';
import { CommunityPoll, votePoll } from '@/services/communityService';
import { BarChart3, CheckCircle2, Users } from 'lucide-react';

export default function PollWidget({ initialPoll }: { initialPoll: CommunityPoll }) {
  const [poll, setPoll] = useState<CommunityPoll>(initialPoll);
  const [loading, setLoading] = useState(false);

  async function handleVote(optionId: string) {
    if (poll.userVotedOptionId || loading) return;
    setLoading(true);
    try {
      const updated = await votePoll(optionId);
      setPoll(updated);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ss-glass rounded-2xl p-6 border border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-ss-orange/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-2 text-xs font-bold text-ss-orange mb-3 uppercase tracking-wider">
        <BarChart3 size={16} /> Mandi Market Sentiment Poll
      </div>

      <h3 className="text-base font-bold text-white mb-4 leading-snug">{poll.question}</h3>

      <div className="space-y-3 mb-4">
        {poll.options.map((opt: { id: string; text: string; votes: number }) => {
          const pct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
          const isSelected = poll.userVotedOptionId === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              disabled={!!poll.userVotedOptionId || loading}
              className={`w-full text-left relative overflow-hidden p-3.5 rounded-xl border transition-all ${
                isSelected
                  ? 'border-ss-orange bg-ss-orange/20 text-white'
                  : 'border-white/10 bg-white/5 hover:border-white/20 text-slate-200'
              }`}
            >
              {/* Progress fill bar if voted */}
              {poll.userVotedOptionId && (
                <div
                  className="absolute inset-y-0 left-0 bg-ss-orange/15 transition-all duration-500 pointer-events-none"
                  style={{ width: `${pct}%` }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between gap-4">
                <span className="text-xs font-semibold flex items-center gap-2">
                  {isSelected && <CheckCircle2 size={14} className="text-ss-orange shrink-0" />}
                  {opt.text}
                </span>
                {poll.userVotedOptionId && (
                  <span className="text-xs font-mono font-bold text-ss-orange shrink-0">
                    {pct}% ({opt.votes})
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-white/5">
        <span className="flex items-center gap-1.5 font-mono">
          <Users size={14} className="text-slate-500" /> {poll.totalVotes} Burrabazar Traders Voted
        </span>
        <span className="text-emerald-400 font-medium">Verified Mandi Opinion</span>
      </div>
    </div>
  );
}
