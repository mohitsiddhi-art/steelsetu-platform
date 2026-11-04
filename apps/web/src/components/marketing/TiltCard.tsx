'use client';

import { ReactNode, useRef } from 'react';

/**
 * A card that tilts toward the pointer.
 *
 * The tilt is written to `--tilt-x` / `--tilt-y` CSS custom properties, which
 * the `.ss-tilt` / `.ss-tilt-lift` classes in `globals.css` read. Writing a
 * custom property does not re-render React, so the transform is handled
 * entirely on the compositor.
 *
 * The effect is skipped on coarse pointers and when the user has asked for
 * reduced motion — on a phone there is no hover state to tilt towards.
 */
export default function TiltCard({
  children,
  className = '',
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees. */
  max?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.PointerEvent) => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = node.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    node.style.setProperty('--tilt-y', `${(x * max).toFixed(2)}deg`);
    node.style.setProperty('--tilt-x', `${(-y * max).toFixed(2)}deg`);
  };

  const onLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty('--tilt-y', '0deg');
    node.style.setProperty('--tilt-x', '0deg');
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`ss-tilt-lift ${className}`}
    >
      {children}
    </div>
  );
}
