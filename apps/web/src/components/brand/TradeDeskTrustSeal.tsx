'use client';

interface TradeDeskTrustSealProps {
  className?: string;
  size?: number;
}

export default function TradeDeskTrustSeal({ className = '', size = 120 }: TradeDeskTrustSealProps) {
  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
        suppressHydrationWarning
      >
        <defs>
          <linearGradient id="seal-grad" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <path
            id="textPath"
            d="M 25, 80 a 55,55 0 1,1 110,0 a 55,55 0 1,1 -110,0"
          />
          <path
            id="textPathBottom"
            d="M 135, 80 a 55,55 0 1,1 -110,0 a 55,55 0 1,1 110,0"
          />
        </defs>

        {/* Outer Ribbed Rebar Border */}
        <circle cx="80" cy="80" r="75" stroke="url(#seal-grad)" strokeWidth="4" strokeDasharray="4 3" fill="#0B132B" />
        <circle cx="80" cy="80" r="70" stroke="url(#seal-grad)" strokeWidth="1.5" fill="none" />
        <circle cx="80" cy="80" r="14" stroke="url(#seal-grad)" strokeWidth="1" fill="#050811" />

        {/* Circular Text Ring */}
        <text className="text-[9.5px] font-mono font-bold tracking-widest uppercase" fill="#FBBF24">
          <textPath href="#textPath" startOffset="0%" textAnchor="middle">
            • SHREE BURRABAZAR LOHAPATTY • KOLKATA • ESTD. 1968 •
          </textPath>
        </text>

        <text className="text-[8.5px] font-mono font-semibold tracking-wider uppercase" fill="#94A3B8">
          <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
            MEMBER: SBLSS/M019 • VERIFIED TRADE SEAL
          </textPath>
        </text>

        {/* Center Emblem: Howrah Bridge / I-Beam Truss Silhouette */}
        <g transform="translate(80, 80)">
          {/* Bridge Truss */}
          <path d="M-22 10 L-10 -10 L10 -10 L22 10 Z" stroke="#38BDF8" strokeWidth="1.5" fill="none" />
          <path d="M-15 10 L-5 -4 L5 -4 L15 10 Z" stroke="#F97316" strokeWidth="1" fill="none" />
          {/* Center text */}
          <text x="0" y="24" textAnchor="middle" className="text-[8px] font-extrabold font-display fill-white tracking-tighter">
            STEELSETU
          </text>
        </g>
      </svg>
    </div>
  );
}
