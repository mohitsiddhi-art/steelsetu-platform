'use client';

import { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';

/**
 * Sign-out button for the admin/staff ERP portals.
 *
 * Posts to `/api/admin/logout` to clear the session cookie, then sends the
 * browser to the admin login page. A full-page assignment (not the client
 * router) guarantees the dropped cookie is not replayed from the previous
 * page tree.
 */
export default function AdminLogoutButton() {
  const [signingOut, setSigningOut] = useState(false);

  const handleLogout = async () => {
    setSigningOut(true);

    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } finally {
      window.location.assign('/admin/login');
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={signingOut}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-60"
    >
      {signingOut ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <LogOut className="w-3.5 h-3.5" />
      )}
      Log out
    </button>
  );
}
