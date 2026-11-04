'use client';

import { useEffect, useRef, useState } from 'react';
import useInViewOnce from '@/lib/useInViewOnce';

/**
 * Animate a number from 0 to its target when it scrolls into view.
 *
 * The animation is driven by `requestAnimationFrame` with an ease-out curve,
 * and it uses `tabular-nums` so the digits do not jitter the layout as they
 * change width.
 *
 * `prefers-reduced-motion` is honoured: the final value is written straight
 * to the DOM, with no tweening.
 */
export default function CountUp({
  value,
  duration = 1800,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
}: {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInViewOnce(ref);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      // easeOutCubic — fast start, gentle settle.
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      if (frame) cancelAnimationFrame(frame);
    };
  }, [inView, value, duration]);

  return (
    <span ref={ref} className={`ss-tabular ${className}`}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
