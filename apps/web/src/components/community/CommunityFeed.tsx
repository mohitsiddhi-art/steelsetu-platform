'use client';

import { useState, useEffect } from 'react';
import {
  CommunityRoomId,
  CommunityRoom,
  CommunityPoll,
  TechnicalQaItem,
  BuyRequirementItem,
  LogisticsUpdateItem,
  getRooms,
  getPoll,
  getTechnicalQas,
  getBuyRequirements,
  getLogisticsUpdates,
} from '@/services/communityService';
import PollWidget from './PollWidget';
import QuestionCard from './QuestionCard';
import ConvertToRfqModal from './ConvertToRfqModal';
import { TrendingUp, ShieldCheck, Search, Zap, Truck } from 'lucide-react';

export default function CommunityFeed() {
  const [rooms, setRooms] = useState<CommunityRoom[]>([]);
  const [activeRoom, setActiveRoom] = useState<CommunityRoomId>('mandi-rates-sentiment');
  const [poll, setPoll] = useState<CommunityPoll | null>(null);
  const [qas, setQas] = useState<TechnicalQaItem[]>([]);
  const [buys, setBuys] = useState<BuyRequirementItem[]>([]);
  const [logistics, setLogistics] = useState<LogisticsUpdateItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBuyForRfq, setSelectedBuyForRfq] = useState<BuyRequirementItem | null>(null);

  useEffect(() => {
    async function load() {
      const [r, p, q, b, l] = await Promise.all([
        getRooms(),
        getPoll(),
        getTechnicalQas(),
        getBuyRequirements(),
        getLogisticsUpdates(),
      ]);
      setRooms(r);
      setPoll(p);
      setQas(q);
      setBuys(b);
      setLogistics(l);
    }
    load();
  }, []);

  const filteredQas = qas.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBuys = buys.filter(
    (item) =>
      item.requirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLogistics = logistics.filter(
    (item) =>
      item.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vehicleType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="px-2.5 py-1 rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
            Burrabazar Live Exchange
          </span>
          <h2 className="text-xl md:text-2xl font-bold text-white mt-2">Active Trading Exchange & Mandi Feed</h2>
          <p className="text-xs text-slate-400 mt-1">Real-time steel sentiment, buy requirements, BIS QA standards, and freight updates.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Feed Active
          </span>
        </div>
      </div>

      {/* Room Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rooms.map((room) => {
          const isActive = activeRoom === room.id;
          return (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'bg-gradient-to-br from-blue-600/25 to-slate-900 border-blue-500/60 shadow-lg shadow-blue-500/10 text-white'
                  : 'ss-glass border-white/10 hover:border-white/20 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-ss-blue">
                  {room.activeCount} Active Traders
                </span>
                {isActive && <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />}
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{room.name}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{room.description}</p>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between ss-glass p-4 rounded-2xl border border-white/10">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Search discussions, standards, requirements, transport..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-ss-blue"
          />
          <Search className="absolute left-3.5 top-3 text-slate-500" size={14} />
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 w-full md:w-auto justify-end">
          <span className="font-mono">Active Room: <strong className="text-white">{rooms.find(r => r.id === activeRoom)?.name}</strong></span>
        </div>
      </div>

      {/* Room Content Render */}
      <div className="space-y-6">
        {activeRoom === 'mandi-rates-sentiment' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="ss-glass rounded-2xl p-6 border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp size={16} className="text-ss-orange" /> Burrabazar Weekly Rolling Sentiment
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Traders report steady lifting in TMT 12mm and 16mm across Howrah and Dankuni foundation sites. Galvanized coil margins remain tight due to imported hot-rolled coil landing costs.
                </p>
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] text-slate-500 uppercase">TMT 12mm Trend</p>
                    <p className="text-sm font-extrabold text-emerald-400 font-mono mt-1">+₹350 / MT</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] text-slate-500 uppercase">PPGL Sheet Demand</p>
                    <p className="text-sm font-extrabold text-ss-blue font-mono mt-1">High (PEB)</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                    <p className="text-[10px] text-slate-500 uppercase">Market Liquidity</p>
                    <p className="text-sm font-extrabold text-amber-400 font-mono mt-1">Stable</p>
                  </div>
                </div>
              </div>
            </div>
            <div>{poll && <PollWidget initialPoll={poll} />}</div>
          </div>
        )}

        {activeRoom === 'buy-rfq-exchange' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap size={16} className="text-ss-blue" /> Commercial Buy Requirements & Spot Lifting
              </h3>
              <span className="text-xs text-slate-400">Showing verified buyer inquiries</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBuys.map((buy) => (
                <div key={buy.id} className="ss-glass rounded-2xl p-5 border border-white/10 flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-0.5 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-md text-[10px] font-mono font-bold">
                        {buy.quantityTons} MT Requirement
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{buy.createdAt}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-2">{buy.company}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed mb-3">&quot;{buy.requirement}&quot;</p>
                    <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono border-t border-white/5 pt-2">
                      <span>Location: <strong className="text-slate-200">{buy.location}</strong></span>
                      <span>Target: <strong className="text-amber-400">{buy.targetPrice}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedBuyForRfq(buy)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all"
                  >
                    [⚡ Convert to RFQ via Singhi Trade Desk →]
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeRoom === 'technical-qa-standards' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" /> Technical Q&A & BIS Standards (IS 1786 / IS 277)
              </h3>
              <span className="text-xs text-slate-400">Expert peer-verified answers</span>
            </div>

            <div className="space-y-4">
              {filteredQas.map((qa) => (
                <QuestionCard key={qa.id} item={qa} />
              ))}
            </div>
          </div>
        )}

        {activeRoom === 'logistics-transport' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck size={16} className="text-ss-orange" /> Logistics, Trailer Freight & Yard Loading Updates
              </h3>
              <span className="text-xs text-slate-400">Live Burrabazar & Dankuni dispatch status</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {filteredLogistics.map((log) => (
                <div key={log.id} className="ss-glass rounded-2xl p-5 border border-white/10 flex flex-col justify-between gap-4">
                  <div>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[9px] font-mono font-bold mb-2 inline-block">
                      {log.vehicleType}
                    </span>
                    <h4 className="text-sm font-bold text-white mb-1">{log.route}</h4>
                    <p className="text-xs font-mono text-emerald-400 font-bold mb-3">{log.ratePerMt}</p>
                    <p className="text-[11px] text-slate-300">Status: <strong className="text-white">{log.availability}</strong></p>
                  </div>
                  <div className="border-t border-white/5 pt-3 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>Updated {log.updatedAt}</span>
                    <a href="https://wa.me/919883051500" target="_blank" rel="noopener noreferrer" className="text-ss-blue hover:underline">Book Truck →</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <ConvertToRfqModal item={selectedBuyForRfq} onClose={() => setSelectedBuyForRfq(null)} />
    </div>
  );
}
