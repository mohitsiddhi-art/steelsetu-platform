'use client';

import { ReactNode, useRef } from 'react';
import useInViewOnce from '@/lib/useInViewOnce';

/**
 * Scroll-reveal wrapper.
 *
 * Children start hidden and are released the first time they reach the
 * viewport. The `delay` prop staggers siblings — a grid of cards that fades
 * in all at once reads as a single flash rather than a sequence.
 *
 * The "in view" test is delegated to `useInViewOnce`, which handles the
 * jump-past-the-section case that a bare IntersectionObserver misses.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode;
  /** Stagger, in milliseconds. */
  delay?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article' | 'span';
}) {
  const ref = useRef<HTMLElement | null>(null);
  const visible = useInViewOnce(ref);

  return (
    <Tag
      ref={ref as never}
      className={`ss-reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
