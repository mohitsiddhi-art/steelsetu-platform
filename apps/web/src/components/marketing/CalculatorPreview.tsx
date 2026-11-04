import Link from 'next/link';
import { ArrowRight, Calculator, IndianRupee, Ruler, Scale } from 'lucide-react';
import Reveal from './Reveal';

/**
 * Section 6 — "Interactive Steel Calculators Suite Preview".
 *
 * Three teaser cards that deep-link into each calculator on `/calculators`.
 * The cards show a live worked example so the value of the tool is legible
 * before the click.
 */
const TOOLS = [
  {
    href: '/calculators#weight',
    Icon: Scale,
    title: 'Steel Weight Calculator',
    blurb:
      'IS 1786 / IS 808 formulae for every shape — TMT, square, pipe, angle, channel, I-beam and plate.',
    example: '12mm TMT × 12 m',
    result: '10.66 kg',
  },
  {
    href: '/calculators#converter',
    Icon: Ruler,
    title: 'Unit Converter',
    blurb:
      'Bidirectional conversion across millimetres, inches, tons, kilograms, square feet and metres.',
    example: '1 ton',
    result: '1000 kg',
  },
  {
    href: '/calculators#estimator',
    Icon: IndianRupee,
    title: 'Cost & Thumb-Rule Estimator',
    blurb:
      'Built-up area and the 3.5–4.5 kg/sq.ft residential rule, priced by city and grade.',
    example: '2,000 sq.ft',
    result: '8.0 MT · ₹4.7L',
  },
];

export default function CalculatorPreview() {
  return (
    <section
      data-layer="marketing"
      className="relative border-y border-white/[0.07] bg-ss-graphite/40 py-24"
      aria-labelledby="calc-heading"
    >
      <div className="ss-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="ss-eyebrow text-ss-orange">Free Tools</p>
          <h2 id="calc-heading" className="ss-h2 mt-3 text-3xl text-white sm:text-4xl">
            Steel Calculators Suite
          </h2>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-slate-400">
            Work out the tonnage and the budget before you ever open a phone
            call to a supplier.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {TOOLS.map((tool, i) => (
            <Reveal key={tool.href} delay={i * 80}>
              <Link
                href={tool.href}
                className="ss-glass group flex h-full flex-col rounded-2xl p-7 transition-colors hover:border-ss-orange/40"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ss-orange transition-colors group-hover:border-ss-orange/40">
                  <tool.Icon className="h-6 w-6" aria-hidden="true" />
                </span>

                <h3 className="mt-5 text-[1.05rem] font-semibold text-white">
                  {tool.title}
                </h3>
                <p className="mt-2.5 flex-1 text-[0.86rem] leading-relaxed text-slate-400">
                  {tool.blurb}
                </p>

                {/* Worked example */}
                <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <span className="ss-tabular text-[0.78rem] text-slate-400">
                    {tool.example}
                  </span>
                  <span className="ss-tabular text-[0.9rem] font-bold text-white">
                    {tool.result}
                  </span>
                </div>

                <span className="mt-5 inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-ss-orange">
                  Open the tool
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal delay={240} className="mt-10 text-center">
          <Link
            href="/calculators"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10"
          >
            <Calculator className="h-4 w-4" aria-hidden="true" />
            Open the full calculators suite
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
