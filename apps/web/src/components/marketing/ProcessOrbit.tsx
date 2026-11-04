'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Search, GitCompareArrows, FileText, Handshake, PackageCheck, Truck } from 'lucide-react';
import Reveal from './Reveal';

/**
 * Section 5 — "From Requirement to Delivery".
 *
 * An orbital process diagram: six steps arranged around a ring, with the
 * active step highlighted and its detail shown beneath. The ring is a CSS
 * circle with the steps absolutely positioned around it, so it scales without
 * a layout library.
 *
 * On a phone the ring collapses into a horizontal stepper — an orbit is
 * meaningless at 375px.
 */
const STEPS = [
  {
    key: 'search',
    title: 'Search',
    blurb:
      'Search by brand, grade, size or city across 10,000+ live SKUs — or let us post the requirement for you.',
    Icon: Search,
    href: '/products',
  },
  {
    key: 'compare',
    title: 'Compare',
    blurb:
      'Put mills side by side on rate, grade, certification and lead time before you commit a single rupee.',
    Icon: GitCompareArrows,
    href: '/compare',
  },
  {
    key: 'inquire',
    title: 'Inquire',
    blurb:
      'Send one requirement and it reaches every matched supplier — no more calling ten stockists separately.',
    Icon: FileText,
    href: '/user-login?intent=post',
  },
  {
    key: 'quote',
    title: 'Get Quotation',
    blurb:
      'Verified quotes land in your dashboard, typically within 24 hours of posting.',
    Icon: Handshake,
    href: '/dashboard',
  },
  {
    key: 'negotiate',
    title: 'Negotiate',
    blurb:
      'Counter-offer directly on the trade desk number, with GST and freight terms shown upfront.',
    Icon: Handshake,
    href: '/dashboard',
  },
  {
    key: 'order',
    title: 'Order',
    blurb:
      'Confirm the allocation and we arrange dispatch, documentation and site delivery across Bengal.',
    Icon: Truck,
    href: '/contact',
  },
];

export default function ProcessOrbit() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];
  const StepIcon = step.Icon;

  return (
    <section
      data-layer="marketing"
      className="relative py-24"
      aria-labelledby="process-heading"
    >
      <div className="ss-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="ss-eyebrow text-ss-orange">How It Works</p>
          <h2 id="process-heading" className="ss-h2 mt-3 text-3xl text-white sm:text-4xl">
            From Requirement to Delivery
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-slate-400">
            Six steps, one trade desk, and a quote back before your site team
            needs the material.
          </p>
        </Reveal>

        {/* --- Desktop: the orbit --- */}
        <Reveal delay={80} className="mt-16 hidden lg:block">
          <div className="relative mx-auto h-[26rem] w-[26rem]">
            {/* The ring */}
            <div
              className="absolute inset-0 rounded-full border border-white/10"
              aria-hidden="true"
            />
            <div
              className="absolute inset-[3.25rem] rounded-full border border-dashed border-white/[0.07]"
              aria-hidden="true"
            />

            {/* Centre hub */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="ss-glass ss-hairline flex h-40 w-40 flex-col items-center justify-center rounded-full text-center">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ss-orange/15 text-ss-orange">
                  <StepIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="mt-2.5 text-[0.95rem] font-semibold text-white">
                  {step.title}
                </span>
                <span className="ss-tabular mt-0.5 text-[0.68rem] uppercase tracking-[0.14em] text-slate-500">
                  Step {active + 1} of {STEPS.length}
                </span>
              </div>
            </div>

            {/* The nodes */}
            {STEPS.map((s, i) => {
              const angle = (i / STEPS.length) * Math.PI * 2 - Math.PI / 2;
              const x = Math.cos(angle) * 11.6;
              const y = Math.sin(angle) * 11.6;
              const selected = i === active;
              const NodeIcon = s.Icon;

              return (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  aria-pressed={selected}
                  className="group absolute flex flex-col items-center gap-2"
                  style={{
                    left: `calc(50% + ${x}rem)`,
                    top: `calc(50% + ${y}rem)`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <span
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl border transition-all duration-300 ${
                      selected
                        ? 'border-ss-orange/60 bg-ss-orange/20 text-ss-orange shadow-[0_0_30px_-6px_rgba(249,115,22,0.7)]'
                        : 'border-white/10 bg-white/5 text-slate-300 group-hover:border-ss-blue/40 group-hover:text-ss-blue'
                    }`}
                  >
                    <NodeIcon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <span
                    className={`text-[0.78rem] font-semibold transition-colors ${
                      selected ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* --- Detail panel --- */}
        <Reveal delay={140} className="mt-10">
          <div className="ss-glass ss-hairline mx-auto max-w-2xl rounded-2xl p-7 text-center">
            <h3 className="text-lg font-semibold text-white">{step.title}</h3>
            <p className="mt-3 text-[0.92rem] leading-relaxed text-slate-400">
              {step.blurb}
            </p>
            <Link
              href={step.href}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-[0.82rem] font-semibold text-white transition-colors hover:bg-white/10"
            >
              {active === 0 ? 'Start searching' : 'Continue'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        {/* --- Mobile: a horizontal stepper --- */}
        <Reveal delay={180} className="mt-10 lg:hidden">
          <ol className="space-y-2.5">
            {STEPS.map((s, i) => {
              const selected = i === active;
              const NodeIcon = s.Icon;
              return (
                <li key={s.key}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={selected}
                    className={`flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-colors ${
                      selected
                        ? 'border-ss-orange/40 bg-ss-orange/10'
                        : 'border-white/10 bg-white/[0.04]'
                    }`}
                  >
                    <span
                      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        selected
                          ? 'bg-ss-orange/20 text-ss-orange'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      <NodeIcon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.9rem] font-semibold text-white">
                        {s.title}
                      </span>
                      <span className="mt-0.5 block text-[0.76rem] leading-snug text-slate-400">
                        {s.blurb}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </Reveal>

        {/* Decorative package icon for the closing step. */}
        <span className="sr-only">
          <PackageCheck aria-hidden="true" />
        </span>
      </div>
    </section>
  );
}
