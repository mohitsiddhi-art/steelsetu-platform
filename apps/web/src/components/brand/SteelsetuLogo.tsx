'use client';

import Link from 'next/link';

interface SteelsetuLogoProps {
  tone?: 'dark' | 'light';
  variant?: 'icon' | 'full' | 'watermark';
  size?: number;
  href?: string;
  className?: string;
  animated?: boolean;
  compact?: boolean;
}

export default function SteelsetuLogo({
  tone = 'dark',
  variant = 'full',
  size = 40,
  href = '/',
  className = '',
}: SteelsetuLogoProps) {
  const isLight = tone === 'light';
  const textColor = isLight ? '#0F172A' : '#FFFFFF';
  const subColor = isLight ? '#475569' : '#94A3B8';

  if (variant === 'watermark') {
    return (
      <div className={`pointer-events-none select-none opacity-10 ${className}`} aria-hidden="true">
        <svg
          width={size * 4}
          height={size * 4}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 20 H70 V35 H50 V65 H70 V80 H20 V65 H40 V35 H20 Z"
            fill="url(#watermark-grad)"
          />
          <defs>
            <linearGradient id="watermark-grad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  const iconSvg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      suppressHydrationWarning
    >
      <defs>
        <linearGradient id="i-beam-s-grad" x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        <linearGradient id="molten-core" x1="32" y1="26" x2="32" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        <filter id="logo-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Hexagonal Isometric Base Ring */}
      <polygon
        points="32,6 54,18 54,46 32,58 10,46 10,18"
        stroke="#1E293B"
        strokeWidth="3"
        fill="#0B132B"
        filter="url(#logo-shadow)"
      />

      {/* Heavy Industrial Isometric I-Beam folded into 'S' shape */}
      <g filter="url(#logo-shadow)">
        {/* Top flange of S */}
        <path
          d="M20 20 H44 V26 H26 V32 H38 C44 32, 48 35, 48 40 C48 45, 44 48, 38 48 H20 V42 H36 V36 H24 C18 36, 16 33, 16 28 C16 23, 20 20, 20 20 Z"
          fill="url(#i-beam-s-grad)"
        />
        {/* Molten Amber Truss Connector */}
        <path
          d="M32 30 H38 V36 H32 Z"
          fill="url(#molten-core)"
        />
      </g>
    </svg>
  );

  if (variant === 'icon') {
    return (
      <Link href={href} className={`inline-flex items-center group ${className}`} aria-label="Steelsetu Home">
        {iconSvg}
      </Link>
    );
  }

  return (
    <Link href={href} className={`inline-flex items-center gap-3 group ${className}`} aria-label="Steelsetu Home">
      {iconSvg}
      <div className="flex flex-col">
        <span
          className="font-extrabold tracking-tight text-lg leading-tight uppercase font-display bg-gradient-to-r from-slate-100 via-amber-300 to-slate-200 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(255,107,0,0.35)] hover:scale-105 transition-transform duration-300 steel-sheen-animate"
        >
          STEEL<span className="text-ss-orange">SETU</span>
        </span>
        <span
          className="text-[10px] font-mono uppercase tracking-widest leading-none mt-0.5"
          style={{ color: subColor }}
        >
          Industrial Steel Network
        </span>
      </div>
    </Link>
  );
}
