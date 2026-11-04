'use client';

import { useState } from 'react';
import {
  HardHat, Wrench, Building, Users, MessageSquare, Send, X,
  ShieldCheck, Plus, Lock, Globe, Flame
} from 'lucide-react';
import Link from 'next/link';

const INITIAL_ROOMS = [
  {
    id: 'contractors',
    name: 'Contractors & Structural Engineers',
    icon: HardHat,
    members: '1,420 members',
    activeNow: '42 online',
    description: 'Discussion on IS 1786 / IS 2062 load calculations, foundation rebars, and structural safety audits.',
    privacy: 'public',
    theme: 'navy',
  },
  {
    id: 'fabricators',
    name: 'Fabricators & Erectors',
    icon: Wrench,
    members: '980 members',
    activeNow: '28 online',
    description: 'Roofing sheets, purlins, welding standards, and fastener torque specifications.',
    privacy: 'public',
    theme: 'industrial',
  },
  {
    id: 'procurement',
    name: 'Procurement Heads & Stockists',
    icon: Building,
    members: '2,150 members',
    activeNow: '67 online',
    description: 'Daily Burrabazar mandi price trends, mill allocation quotas, and bulk credit terms.',
    privacy: 'public',
    theme: 'navy',
  },
  {
    id: 'logistics',
    name: 'Logistics & Truck Freight',
    icon: Users,
    members: '640 members',
    activeNow: '19 online',
    description: 'Freight tariffs across Eastern India, truck availability, and Durgapur/Jamshedpur dispatch routes.',
    privacy: 'public',
    theme: 'amber',
  },
];

const INITIAL_THREADS = [
  {
    id: 't1',
    author: 'Manish Singhi',
    company: 'Singhi Enterprises',
    roleBadge: 'Room Admin',
    room: 'Procurement Heads & Stockists',
    time: '4 hours ago',
    title: 'Burrabazar Stock Update: TMT Fe 500D & structural angles ready dispatch',
    excerpt: 'Immediate stock availability for Tata Tiscon and Super Smelters rebar batches with mill test certificates. Direct stockist pricing available for bulk buyers.',
    tag: 'STOCK READY',
    tagColor: 'bg-blue-950 text-blue-400 border-blue-800',
    replies: [
      { id: 'r1', author: 'Rajesh Sharma', text: 'Confirmed stock availability? Need 50MT for Durgapur site.', time: '2 hours ago' }
    ],
    likes: 45,
  },
  // ... (rest of initial threads)
];

export default function CommunityClient() {
  const [selectedRoom, setSelectedRoom] = useState('all');
  const [rooms, setRooms] = useState(INITIAL_ROOMS);
  const [threads, setThreads] = useState(INITIAL_THREADS);

  // Modals
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);

  // ... (Form states for post, room creation, comments)

  return (
    <div className="space-y-12">
      {/* 4 Trading Hubs Grid + "+ Create Trade Room" button */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {rooms.map((room) => {
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
                  {room.privacy === 'invite-only' && <Lock className="w-4 h-4 text-slate-500" />}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                  {room.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-3">
                  {room.description}
                </p>
              </div>
              {/* ... */}
            </div>
          );
        })}

        {/* Create Room Card */}
        <button
          onClick={() => setShowCreateRoomModal(true)}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 p-5 h-full text-slate-400 hover:border-ss-orange hover:text-ss-orange transition-all"
        >
          <Plus className="w-8 h-8 mb-3" />
          <span className="font-bold">Create Trade Room</span>
        </button>
      </div>

      {/* Threads with Comment Drawers */}
      {threads.map(thread => (
        <div key={thread.id}>
           {/* ... Thread content ... */}
           <button
             onClick={() => setShowComments(showComments === thread.id ? null : thread.id)}
             className="text-xs text-blue-400"
           >
             {thread.replies.length} replies
           </button>

           {showComments === thread.id && (
             <div className="mt-4 p-4 bg-slate-950 rounded-xl space-y-3">
                {thread.replies.map(reply => (
                  <div key={reply.id} className="text-sm">
                    <span className="font-semibold text-slate-200">{reply.author}: </span>
                    <span className="text-slate-400">{reply.text}</span>
                  </div>
                ))}
                <input className="w-full bg-slate-900 border border-slate-700 p-2 rounded" placeholder="Add a reply..." />
             </div>
           )}
        </div>
      ))}

      {/* ... CreateRoomModal implementation ... */}
    </div>
  );
}
