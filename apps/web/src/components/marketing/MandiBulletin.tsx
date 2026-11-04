import { Bell, MessageSquare, TrendingUp } from 'lucide-react';

export default function MandiBulletin() {
  const announcements = [
    { id: 1, text: 'Lohapatty Seva Samity: Annual trade meet scheduled for Nov 15th.', time: '2h ago' },
    { id: 2, text: 'Market Alert: TMT prices expected to rise by ₹500/MT due to raw material costs.', time: '4h ago' },
    { id: 3, text: 'Verified Stockist: Ready load of 250MT 8mm-12mm TMT available for spot delivery.', time: '5h ago' },
  ];

  return (
    <section className="ss-container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="ss-glass rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
            <Bell size={18} className="text-ss-orange" /> Seva Samity Mandi Bulletin
          </h3>
          <div className="space-y-4">
            {announcements.map((item) => (
              <div key={item.id} className="p-3 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                <p className="text-xs text-slate-300 leading-relaxed">{item.text}</p>
                <p className="text-[10px] text-slate-500 mt-2 font-mono">{item.time}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="ss-glass rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-ss-blue" /> Live Trader Requirements
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-600/10 rounded-xl border border-blue-500/20">
              <div className="h-8 w-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                <MessageSquare size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-200 font-bold">Buying: 40 MT GI Corrugated Sheets</p>
                <p className="text-[10px] text-slate-500">Location: Durgapur | Ready to lift immediately</p>
              </div>
              <button className="text-[10px] font-bold text-ss-blue hover:underline">Quote</button>
            </div>
            <div className="flex items-center gap-3 p-3 bg-emerald-600/10 rounded-xl border border-emerald-500/20">
              <div className="h-8 w-8 rounded-full bg-emerald-600/20 flex items-center justify-center text-emerald-400">
                <MessageSquare size={16} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-200 font-bold">Buying: 120 MT TMT 12mm FE550D</p>
                <p className="text-[10px] text-slate-500">Location: Kolkata | Target Price: ₹52,500/MT</p>
              </div>
              <button className="text-[10px] font-bold text-emerald-400 hover:underline">Quote</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
