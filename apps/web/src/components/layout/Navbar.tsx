import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white tracking-wider">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Steelsetu</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-slate-300">
          <Link href="/" className="hover:text-white transition-colors">Spot Catalog</Link>
          <Link href="/trade-desk" className="hover:text-white transition-colors flex items-center gap-1.5">
            Trade Desk
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2.5 py-1 bg-slate-800 text-slate-400 border border-slate-700 rounded-md">
            B2B Trade Portal
          </span>
        </div>
      </div>
    </header>
  );
}
