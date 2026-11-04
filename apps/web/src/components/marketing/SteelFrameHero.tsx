'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The animated structural-steel frame behind the hero.
 *
 * A bridge ("setu") assembled from I-beams: two towers, a deck, cross-bracing
 * and a suspension cable. The frame is drawn in SVG so it stays crisp, and
 * the whole assembly tilts a couple of degrees toward the pointer for
 * parallax.
 *
 * Performance notes:
 *   - The tilt is written to a CSS custom property, so the transform is
 *     applied by the compositor and never triggers a React re-render.
 *   - The particle field is a fixed, seeded set of nodes — it is generated
 *     once, not per frame.
 *   - `prefers-reduced-motion` and coarse pointers both turn the whole thing
 *     into a static frame.
 */
export default function SteelFrameHero() {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const node = frameRef.current;
    if (!node || reduceMotion) return;
    // Coarse pointers (touch) have no hover state to parallax against, and
    // tracking the pointer on a phone is pure battery burn.
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = node.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        node.style.setProperty('--tilt-y', `${(x * 5).toFixed(2)}deg`);
        node.style.setProperty('--tilt-x', `${(-y * 4).toFixed(2)}deg`);
      });
    };

    const onLeave = () => {
      node.style.setProperty('--tilt-y', '0deg');
      node.style.setProperty('--tilt-x', '0deg');
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduceMotion]);

  // A fixed, hand-seeded particle field. Deterministic so the layout does not
  // shift between server and client renders.
  const particles = [
    { x: 12, y: 22, s: 3, d: 0 },
    { x: 22, y: 68, s: 2, d: 1.4 },
    { x: 31, y: 15, s: 2.5, d: 2.8 },
    { x: 44, y: 78, s: 2, d: 0.7 },
    { x: 56, y: 30, s: 3, d: 3.5 },
    { x: 63, y: 71, s: 2, d: 1.9 },
    { x: 74, y: 19, s: 2.5, d: 2.2 },
    { x: 82, y: 55, s: 3, d: 4.1 },
    { x: 89, y: 33, s: 2, d: 0.4 },
    { x: 6, y: 47, s: 2, d: 3.1 },
    { x: 36, y: 45, s: 2, d: 1.1 },
    { x: 68, y: 84, s: 2.5, d: 2.5 },
  ];

  return (
    <div
      ref={frameRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* --- Floating metallic particles --- */}
      <div className="absolute inset-0">
        {particles.map((p, i) => (
          <span
            key={i}
            className="ss-particle absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.s,
              height: p.s,
              animationDelay: `${p.d}s`,
              background:
                i % 3 === 0
                  ? 'rgba(249,115,22,0.85)'
                  : i % 3 === 1
                    ? 'rgba(147,197,253,0.7)'
                    : 'rgba(226,232,240,0.55)',
              boxShadow:
                i % 3 === 0
                  ? '0 0 8px rgba(249,115,22,0.7)'
                  : '0 0 6px rgba(147,197,253,0.5)',
            }}
          />
        ))}
      </div>

      {/* --- The bridge frame --- */}
      <div
        className="ss-hero-frame absolute left-1/2 top-[54%] h-[70%] w-[min(72rem,135%)] -translate-x-1/2 -translate-y-1/2"
        style={
          {
            '--tilt-x': '0deg',
            '--tilt-y': '0deg',
          } as React.CSSProperties
        }
      >
        <svg
          viewBox="0 0 1200 520"
          fill="none"
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ss-beam" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3A4358" />
              <stop offset="34%" stopColor="#8A97AE" />
              <stop offset="52%" stopColor="#C7D2E4" />
              <stop offset="70%" stopColor="#6B7890" />
              <stop offset="100%" stopColor="#2B3344" />
            </linearGradient>
            <linearGradient id="ss-beam-warm" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A3A2C" />
              <stop offset="34%" stopColor="#A98059" />
              <stop offset="52%" stopColor="#E8B183" />
              <stop offset="70%" stopColor="#8A6544" />
              <stop offset="100%" stopColor="#3A2C20" />
            </linearGradient>
            <linearGradient id="ss-deck" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2E3646" />
              <stop offset="50%" stopColor="#B9C4D6" />
              <stop offset="100%" stopColor="#2E3646" />
            </linearGradient>
            <linearGradient id="ss-cable" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#FDBA74" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F97316" stopOpacity="0.15" />
            </linearGradient>
            <filter id="ss-molten-glow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="7" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Foundation beams */}
          <g opacity="0.85">
            <rect x="150" y="470" width="140" height="12" rx="2" fill="url(#ss-beam)" />
            <rect x="910" y="470" width="140" height="12" rx="2" fill="url(#ss-beam)" />
          </g>

          {/* --- Left tower (I-beam) --- */}
          <g>
            {/* Flanges */}
            <rect x="168" y="120" width="96" height="11" rx="2" fill="url(#ss-beam)" />
            <rect x="168" y="452" width="96" height="11" rx="2" fill="url(#ss-beam)" />
            {/* Web */}
            <rect x="209" y="126" width="14" height="330" rx="2" fill="url(#ss-beam)" />
            {/* Bracing */}
            <g stroke="url(#ss-beam)" strokeWidth="6" strokeLinecap="round" opacity="0.65">
              <path d="M180 200 L216 260 L180 320" />
              <path d="M252 200 L216 260 L252 320" />
              <path d="M180 340 L216 400 L180 445" />
              <path d="M252 340 L216 400 L252 445" />
            </g>
          </g>

          {/* --- Right tower (I-beam) --- */}
          <g>
            <rect x="936" y="120" width="96" height="11" rx="2" fill="url(#ss-beam)" />
            <rect x="936" y="452" width="96" height="11" rx="2" fill="url(#ss-beam)" />
            <rect x="977" y="126" width="14" height="330" rx="2" fill="url(#ss-beam)" />
            <g stroke="url(#ss-beam)" strokeWidth="6" strokeLinecap="round" opacity="0.65">
              <path d="M948 200 L984 260 L948 320" />
              <path d="M1020 200 L984 260 L1020 320" />
              <path d="M948 340 L984 400 L948 445" />
              <path d="M1020 340 L984 400 L1020 445" />
            </g>
          </g>

          {/* --- Deck --- */}
          <g>
            <rect x="150" y="330" width="900" height="15" rx="3" fill="url(#ss-deck)" />
            <rect x="150" y="345" width="900" height="8" rx="2" fill="url(#ss-beam)" opacity="0.7" />
            {/* Deck ribs */}
            <g stroke="#64748B" strokeWidth="3" opacity="0.5">
              {Array.from({ length: 24 }, (_, i) => (
                <line
                  key={i}
                  x1={168 + i * 37}
                  y1={330}
                  x2={168 + i * 37}
                  y2={353}
                />
              ))}
            </g>
          </g>

          {/* --- Suspension cables + hangers --- */}
          <g>
            <path
              d="M216 126 Q600 300 984 126"
              stroke="url(#ss-cable)"
              strokeWidth="3"
              fill="none"
              filter="url(#ss-molten-glow)"
            />
            <path
              d="M216 126 Q600 268 984 126"
              stroke="url(#ss-cable)"
              strokeWidth="1.6"
              fill="none"
              opacity="0.55"
            />
            <g stroke="#FDBA74" strokeWidth="1.2" opacity="0.55">
              {Array.from({ length: 19 }, (_, i) => {
                const t = (i + 1) / 20;
                const x = 216 + t * 768;
                const y = 126 + 4 * t * (1 - t) * 174;
                return <line key={i} x1={x} y1={y} x2={x} y2={330} />;
              })}
            </g>
          </g>

          {/* --- Molten edge glow along the deck --- */}
          <rect
            x="150"
            y="327"
            width="900"
            height="4"
            rx="2"
            fill="#F97316"
            opacity="0.85"
            filter="url(#ss-molten-glow)"
            className="ss-molten-edge"
          />

          {/* --- Ambient light pools --- */}
          <ellipse cx="216" cy="480" rx="150" ry="20" fill="#F97316" opacity="0.10" />
          <ellipse cx="984" cy="480" rx="150" ry="20" fill="#2563EB" opacity="0.12" />
        </svg>
      </div>
    </div>
  );
}
