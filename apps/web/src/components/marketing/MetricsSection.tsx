import { Quote, TrendingUp, Zap } from 'lucide-react';
import CountUp from './CountUp';
import Reveal from './Reveal';

/**
 * Section 4 — "Featured Success Story & Metrics".
 *
 * Two animated counters for the operational gains and four for the network
 * size. The numbers are the brief's own figures, not derived from the
 * database — they describe the platform, not the current catalogue.
 */
const OUTCOME_METRICS = [
  { value: 3.2, decimals: 1, suffix: 'x', label: 'Faster procurement' },
  { value: 48, suffix: '%', label: 'More qualified leads' },
  { value: 60, suffix: '%', label: 'Less inquiry drop-off' },
  { value: 24, prefix: '<', suffix: 'h', label: 'Quote turnaround' },
];

const NETWORK_METRICS = [
  { value: 10000, suffix: '+', label: 'Products listed' },
  { value: 500, suffix: '+', label: 'Verified suppliers' },
  { value: 12000, suffix: '+', label: 'Active buyers' },
  { value: 25, suffix: '+', label: 'Cities served' },
];

export default function MetricsSection() {
  return (
    <section
      data-layer="marketing"
      className="relative border-y border-white/[0.07] bg-ss-graphite/40 py-24"
      aria-labelledby="metrics-heading"
    >
      <div className="ss-container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="ss-eyebrow text-ss-orange">Proven Outcomes</p>
          <h2 id="metrics-heading" className="ss-h2 mt-3 text-3xl text-white sm:text-4xl">
            From Enquiry to Delivery, Faster
          </h2>
        </Reveal>

        {/* Outcome metrics */}
        <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {OUTCOME_METRICS.map((m, i) => (
            <Reveal key={m.label} delay={i * 80}>
              <div className="ss-glass ss-hairline rounded-2xl p-6 text-center">
                <p className="ss-h1 text-3xl text-white sm:text-4xl">
                  <CountUp
                    value={m.value}
                    decimals={m.decimals ?? 0}
                    prefix={m.prefix ?? ''}
                    suffix={m.suffix ?? ''}
                  />
                </p>
                <p className="mt-2 text-[0.8rem] leading-snug text-slate-400">
                  {m.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Success story */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <Reveal>
            <figure className="ss-glass relative h-full overflow-hidden rounded-3xl p-8 sm:p-10">
              <Quote
                className="absolute right-8 top-8 h-14 w-14 text-white/[0.05]"
                aria-hidden="true"
              />
              <span className="ss-eyebrow inline-flex items-center gap-1.5 text-ss-blue">
                <Zap className="h-3.5 w-3.5" aria-hidden="true" />
                Success Story
              </span>
              <blockquote className="mt-5 text-[1.05rem] leading-relaxed text-slate-200 sm:text-[1.15rem]">
                &ldquo;We needed 340 tonnes of Fe 550D for a residential
                township in Rajarhat, spread across three delivery points. One
                requirement on Steelsetu, three verified quotes the same
                evening, and the mill allocation confirmed before the site
                team had finished the pour schedule.&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ss-blue/15 text-sm font-bold text-ss-blue">
                  SM
                </span>
                <span>
                  <span className="block text-[0.88rem] font-semibold text-white">
                    S. Mukherjee
                  </span>
                  <span className="block text-[0.76rem] text-slate-500">
                    Project Head, Infra Build Pvt Ltd · Kolkata
                  </span>
                </span>
              </figcaption>
            </figure>
          </Reveal>

          {/* Network metrics */}
          <Reveal delay={100}>
            <div className="ss-brushed flex h-full flex-col justify-center rounded-3xl p-8 sm:p-10">
              <p className="ss-eyebrow inline-flex items-center gap-1.5 text-ss-orange">
                <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                The Network
              </p>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-slate-400">
                One desk, every mill, and a supply chain that already knows
                how to move steel in Bengal.
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-7">
                {NETWORK_METRICS.map((m) => (
                  <div key={m.label}>
                    <dt className="ss-tabular ss-h2 text-2xl text-white">
                      <CountUp value={m.value} suffix={m.suffix} />
                    </dt>
                    <dd className="mt-1 text-[0.76rem] leading-snug text-slate-500">
                      {m.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
