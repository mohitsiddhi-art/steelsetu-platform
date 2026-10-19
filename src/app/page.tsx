export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl text-center space-y-4">
        <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-blue-400 uppercase bg-blue-950/60 border border-blue-800 rounded-full">
          Phase 1 Active
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Steelsetu Core Platform
        </h1>
        <p className="text-slate-400 text-lg">
          Enterprise B2B trade engine for coils, profile sheets, and industrial steel supply chains.
        </p>
        <div className="pt-4 flex items-center justify-center gap-4">
          <div className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm">
            Status: <span className="text-emerald-400 font-medium">Operational</span>
          </div>
          <div className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm">
            Engine: <span className="text-blue-400 font-medium">Turbopack (Next.js 16)</span>
          </div>
        </div>
      </div>
    </main>
  );
}
