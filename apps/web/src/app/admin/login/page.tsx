'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, ShieldAlert } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'admin@steelsetu.com') {
      router.push('/admin');
    } else if (email === 'staff@steelsetu.com') {
      router.push('/admin'); // Staff also gets access for now
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-2xl">
        <h1 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <ShieldAlert className="text-ss-orange" /> Admin/ERP Login
        </h1>

        <div className="bg-blue-950 border border-blue-800 p-4 rounded-xl mb-6 text-xs text-blue-200">
          <p className="font-bold mb-1">Demo Credentials:</p>
          <p>Admin: admin@steelsetu.com</p>
          <p>Staff: staff@steelsetu.com</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-white"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 py-3 text-white font-bold hover:bg-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
