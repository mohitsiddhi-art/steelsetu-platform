import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';
import Reveal from './Reveal';

/**
 * Section 8 — "Final CTA".
 *
 * The molten-metal glow banner. A wide gradient wash in molten orange over
 * the dark ground, with the headline sitting on top of it.
 */
export default function FinalCta() {
  const waText = encodeURIComponent(
    'Hi Singhi Enterprises, I would like to post a steel requirement for Burrabazar delivery.',
  );

  return (
    <section
      data-layer="marketing"
      className="relative overflow-hidden py-24 sm:py-28"
      aria-labelledby="final-cta-heading"
    >
      {/* Molten wash */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(60rem 26rem at 50% 118%, rgba(249,115,22,0.42), transparent 68%),' +
            'radial-gradient(40rem 20rem at 18% 120%, rgba(234,88,12,0.24), transparent 70%),' +
            'radial-gradient(46rem 22rem at 84% 116%, rgba(37,99,235,0.22), transparent 72%)',
        }}
      />

      {/* Molten horizon line */}
      <div
        className="ss-molten-edge pointer-events-none absolute inset-x-0 bottom-0 h-px"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(251,146,60,0.9) 22%, rgba(249,115,22,0.95) 50%, rgba(251,146,60,0.9) 78%, transparent)',
        }}
      />

      <div className="ss-container relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="ss-eyebrow text-ss-orange">Ready When You Are</p>

          <h2
            id="final-cta-heading"
            className="ss-h1 mt-4 text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl"
          >
            Your Next Steel Order
            <br />
            <span className="ss-text-forge">Starts Here.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-[0.98rem] leading-relaxed text-slate-300">
            Post one requirement and reach every matched mill and stockist in
            Bengal. No call sheet, no waiting on a WhatsApp group to reply.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/user-login?intent=post"
              className="ss-molten inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-8 text-sm font-semibold text-white sm:w-auto"
            >
              Post Your Requirement
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <a
              href={`https://wa.me/919883051500?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10 sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Talk to the Trade Desk
            </a>
          </div>

          <p className="mt-7 text-[0.78rem] text-slate-500">
            Singhi Enterprises · Burrabazar, Kolkata · +91 98830 51500
          </p>
        </Reveal>
      </div>
    </section>
  );
}
