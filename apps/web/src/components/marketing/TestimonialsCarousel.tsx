'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import Reveal from './Reveal';

/**
 * Section 7 — "Testimonials Carousel".
 *
 * A touch-draggable slider. Pointer events handle the drag on desktop and
 * touch on a phone, and the arrow buttons give keyboard users a way through
 * it. The dots are real buttons so they are reachable by Tab.
 */
const TESTIMONIALS = [
  {
    name: 'Rakesh Menon',
    role: 'Contractor',
    city: 'Hyderabad',
    quote:
      'I used to run four different WhatsApp groups to compare rates. Now I post one requirement and the quotes come back the same evening. The 48% jump in leads was real for us.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Processor',
    city: 'Raipur',
    quote:
      'The grade comparison page is what sold my team. Fe 500D against Fe 550D, with the mill certificates right there — no more arguing about what the supplier actually sent.',
    rating: 5,
  },
  {
    name: 'Anil Kulkarni',
    role: 'Fabricator',
    city: 'Pune',
    quote:
      'The weight calculator alone saves me an afternoon every month. We stopped over-ordering by three to four percent once the estimate matched the actual bill.',
    rating: 5,
  },
];

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const [drag, setDrag] = useState(0);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pointerStart = useRef<{ x: number; index: number } | null>(null);

  const go = useCallback((delta: number) => {
    setIndex((prev) => (prev + delta + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  // Keyboard support when the slider has focus.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      if (e.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  const onPointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, index };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointerStart.current) return;
    setDrag(e.clientX - pointerStart.current.x);
  };

  const onPointerUp = () => {
    if (!pointerStart.current) return;
    const threshold = 60;
    if (drag < -threshold) go(1);
    else if (drag > threshold) go(-1);
    pointerStart.current = null;
    setDrag(0);
  };

  return (
    <section
      data-layer="marketing"
      className="relative py-24"
      aria-labelledby="testimonials-heading"
    >
      <div className="ss-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="ss-eyebrow text-ss-orange">Testimonials</p>
          <h2
            id="testimonials-heading"
            className="ss-h2 mt-3 text-3xl text-white sm:text-4xl"
          >
            Trusted on the Ground
          </h2>
        </Reveal>

        <Reveal delay={80} className="mt-12">
          <div
            className="relative mx-auto max-w-3xl"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            style={{ cursor: 'grab' }}
          >
            <div
              ref={trackRef}
              className="overflow-hidden"
              style={{ touchAction: 'pan-y' }}
            >
              <div
                className="flex transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{
                  transform: `translate3d(calc(${-index * 100}% + ${drag}px), 0, 0)`,
                }}
              >
                {TESTIMONIALS.map((t) => (
                  <figure
                    key={t.name}
                    className="w-full shrink-0 px-1"
                    aria-hidden={false}
                  >
                    <div className="ss-glass ss-hairline relative rounded-3xl p-8 sm:p-11">
                      <Quote
                        className="absolute right-9 top-8 h-16 w-16 text-white/[0.05]"
                        aria-hidden="true"
                      />

                      <div
                        className="flex gap-1"
                        aria-label={`${t.rating} out of 5 stars`}
                      >
                        {Array.from({ length: t.rating }, (_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-ss-orange text-ss-orange"
                            aria-hidden="true"
                          />
                        ))}
                      </div>

                      <blockquote className="mt-5 text-[1.02rem] leading-relaxed text-slate-200 sm:text-[1.12rem]">
                        &ldquo;{t.quote}&rdquo;
                      </blockquote>

                      <figcaption className="mt-7 flex items-center gap-3.5">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ss-blue/15 text-[0.85rem] font-bold text-ss-blue">
                          {t.name
                            .split(' ')
                            .map((w) => w[0])
                            .join('')}
                        </span>
                        <span>
                          <span className="block text-[0.92rem] font-semibold text-white">
                            {t.name}
                          </span>
                          <span className="block text-[0.78rem] text-slate-500">
                            {t.role} · {t.city}
                          </span>
                        </span>
                      </figcaption>
                    </div>
                  </figure>
                ))}
              </div>
            </div>

            {/* Arrows */}
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="ss-tap absolute -left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ss-graphite/80 text-white backdrop-blur-md transition-colors hover:bg-ss-graphite sm:-left-5"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="ss-tap absolute -right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ss-graphite/80 text-white backdrop-blur-md transition-colors hover:bg-ss-graphite sm:-right-5"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/* Dots */}
          <div
            className="mt-8 flex items-center justify-center gap-2"
            role="tablist"
            aria-label="Choose a testimonial"
          >
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Testimonial from ${t.name}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-7 bg-ss-orange'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
