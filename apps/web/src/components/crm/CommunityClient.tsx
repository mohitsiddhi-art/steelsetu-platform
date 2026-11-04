'use client';

import { useState } from 'react';
import { HardHat, Wrench, Building, Users, Landmark, MessageSquare, Flame, CheckCircle2, Send, ExternalLink, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';

const ROOMS = [
  {
    id: 'contractors',
    name: 'Contractors & Structural Engineers',
    icon: HardHat,
    members: '1,420 members',
    activeNow: '42 online',
    description: 'Discussion on IS 1786 / IS 2062 load calculations, foundation rebars, and structural safety audits.',
  },
  {
    id: 'fabricators',
    name: 'Fabricators & Erectors',
    icon: Wrench,
    members: '980 members',
    activeNow: '28 online',
    description: 'Roofing sheets, purlins, welding standards, and fastener torque specifications.',
  },
  {
    id: 'procurement',
    name: 'Procurement Heads & Stockists',
    icon: Building,
    members: '2,150 members',
    activeNow: '67 online',
    description: 'Daily Burrabazar mandi price trends, mill allocation quotas, and bulk credit terms.',
  },
  {
    id: 'logistics',
    name: 'Logistics & Truck Freight',
    icon: Users,
    members: '640 members',
    activeNow: '19 online',
    description: 'Freight tariffs across Eastern India, truck availability, and Durgapur/Jamshedpur dispatch routes.',
  },
];

const INITIAL_THREADS = [
  {
    id: 't1',
    author: 'Manish Singhi',
    company: 'Singhi Enterprises',
    roleBadge: 'Life Member',
    room: 'Procurement Heads & Stockists',
    time: '4 hours ago',
    title: 'Burrabazar Stock Update: TMT Fe 500D & structural angles ready dispatch',
    excerpt: 'Immediate stock availability for Tata Tiscon and Super Smelters rebar batches with mill test certificates. Direct stockist pricing available for bulk buyers.',
    tag: 'STOCK READY',
    tagColor: 'bg-blue-950 text-blue-400 border-blue-800',
    replies: 12,
    likes: 45,
  },
  {
    id: 't2',
    author: 'Rajesh Sharma',
    company: 'Apex Infra Kolkata',
    roleBadge: 'EPC Contractor',
    room: 'Procurement Heads & Stockists',
    time: '6 hours ago',
    title: 'Fe 500D TMT price trend for coming week in Burrabazar',
    excerpt: 'Main mill despatches from Jamshedpur are showing tighter allocation. Are stockists holding current rates or expecting a ₹500/MT upward correction?',
    tag: 'BUY REQUIREMENT',
    tagColor: 'bg-emerald-950 text-emerald-400 border-emerald-800',
    replies: 14,
    likes: 32,
  },
  {
    id: 't3',
    author: 'Amit Agarwal',
    company: 'Durga Roofing Solutions',
    roleBadge: 'Burrabazar Stockist',
    room: 'Fabricators & Erectors',
    time: 'Yesterday',
    title: 'Ready stock 200 MT Jindalume AZ-150 coils available at Howrah yard',
    excerpt: 'Immediate same-day dispatch available with mill test certificates. DM for bulk trade pricing.',
    tag: 'STOCK READY',
    tagColor: 'bg-blue-950 text-blue-400 border-blue-800',
    replies: 18,
    likes: 45,
  },
];

export default function CommunityClient() {
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [pollVoted, setPollVoted] = useState(false);
  const [pollOption, setPollOption] = useState<number | null>(null);
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postRoom, setPostRoom] = useState('Procurement Heads & Stockists');
  const [postTag, setPostTag] = useState('BUY REQUIREMENT');

  const filteredThreads = selectedRoom === 'all'
    ? threads
    : threads.filter(t => t.room === ROOMS.find(r => r.id === selectedRoom)?.name);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;
    const newThread = {
      id: `t_${Date.now()}`,
      author: 'Singhi Trade Desk User',
      company: 'Verified Trade Partner',
      roleBadge: 'Verified Member',
      room: postRoom,
      time: 'Just now',
      title: postTitle,
      excerpt: postContent,
      tag: postTag,
      tagColor: postTag === 'BUY REQUIREMENT' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-blue-950 text-blue-400 border-blue-800',
      replies: 0,
      likes: 1,
    };
    setThreads([newThread, ...threads]);
    setPostTitle('');
    setPostContent('');
    setShowPostModal(false);
  };

  return (
    <div className="space-y-12">
      {/* 4 Trading Hubs Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ROOMS.map((room) => {
          const Icon = room.icon;
          const isSelected = selectedRoom === room.id;
          return (
            <div
              key={room.id}
              onClick={() => setSelectedRoom(isSelected ? 'all' : room.id)}
              className={`flex flex-col justify-between rounded-2xl border p-5 h-full transition-all cursor-pointer group ${
                isSelected
                  ? 'border-blue-500 bg-slate-900 shadow-xl shadow-blue-500/10'
                  : 'border-slate-800 bg-slate-900/90 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-950 border border-blue-800 text-blue-400 group-hover:scale-110 transition-transform">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-[10px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {room.activeNow}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  {room.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-3">
                  {room.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">{room.members}</span>
                <span className="text-blue-400 font-semibold group-hover:underline inline-flex items-center gap-1">
                  {isSelected ? 'Viewing' : 'Filter'} &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Discussion Feeds & Sentiment Poll */}
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Live Threads */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-ss-orange" />
              {selectedRoom === 'all' ? 'Active Trading Exchange & Mandi Feed' : `Feed: ${ROOMS.find(r => r.id === selectedRoom)?.name}`}
            </h2>
            <button
              onClick={() => setShowPostModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-blue-600/20"
            >
              + Post Requirement / Bulletin
            </button>
          </div>

          <div className="space-y-4">
            {filteredThreads.map((thread) => (
              <div key={thread.id} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 hover:border-slate-700 transition-all">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-block rounded-md px-2.5 py-0.5 text-[10px] font-mono font-bold border ${thread.tagColor}`}>
                      {thread.tag}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{thread.room}</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">{thread.time}</span>
                </div>

                <h3 className="text-lg font-bold text-white hover:text-blue-400 cursor-pointer transition-colors">
                  {thread.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  {thread.excerpt}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{thread.author}</span>
                    <span className="text-slate-500 font-mono">({thread.company})</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-blue-300 border border-slate-700">
                      {thread.roleBadge}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={`https://wa.me/919883051500?text=${encodeURIComponent(`Hello Singhi Trade Desk, regarding post "${thread.title}": I want to connect and discuss quotation/requirements.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-colors text-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Chat on WhatsApp (+91 98830 51500)
                    </a>
                    <Link
                      href="/trade-desk"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-ss-orange/20 hover:bg-ss-orange/30 text-ss-orange border border-ss-orange/30 font-semibold transition-colors"
                    >
                      Convert to RFQ &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Poll Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-950/80 border border-amber-800 text-[10px] font-mono text-amber-300">
              Weekly Market Sentiment Poll
            </div>
            <h3 className="text-base font-bold text-white">
              Where do you see TMT rebar prices heading next week in Burrabazar?
            </h3>

            <div className="space-y-3 pt-2 text-xs">
              {[
                { label: 'Bullish (+₹500/MT or more)', pct: '58%', opt: 0 },
                { label: 'Stable / Consolidated', pct: '29%', opt: 1 },
                { label: 'Bearish (Correction expected)', pct: '13%', opt: 2 },
              ].map((item) => (
                <button
                  key={item.opt}
                  onClick={() => {
                    setPollVoted(true);
                    setPollOption(item.opt);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    pollOption === item.opt
                      ? 'border-blue-500 bg-blue-950/40 text-white'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="font-mono font-bold text-blue-400">{pollVoted ? item.pct : 'Vote'}</span>
                </button>
              ))}
            </div>

            {pollVoted && (
              <p className="text-[11px] font-mono text-emerald-400 text-center">
                ✓ Vote recorded. Real-time Burrabazar mandi sentiment updated.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Post Requirement / Bulletin Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-6 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-ss-orange" /> Post Requirement or Trade Bulletin
              </h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Select Hub / Room</label>
                <select
                  value={postRoom}
                  onChange={(e) => setPostRoom(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  {ROOMS.map(r => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Bulletin Tag</label>
                <select
                  value={postTag}
                  onChange={(e) => setPostTag(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="BUY REQUIREMENT">BUY REQUIREMENT (RFQ)</option>
                  <option value="STOCK READY">STOCK READY (Sell / Inventory)</option>
                  <option value="LOGISTICS">LOGISTICS / FREIGHT</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Title / Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Required 40 MT Fe 500D TMT Rebars 16mm for Howrah site"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Detailed Specifications &amp; Terms</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Mention grade, delivery timeline, payment terms, or contact preference..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 font-bold shadow-lg shadow-blue-600/30 transition-colors"
                >
                  Publish &amp; Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
