'use client';

import Link from 'next/link';
import { Mail, MessageCircle, MapPin, Phone, Building2 } from 'lucide-react';
import SteelsetuLogo from '@/components/brand/SteelsetuLogo';
import FooterYear from './FooterYear';

/**
 * Social glyphs.
 */
function LinkedInGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.71h.05c.53-.95 1.83-1.96 3.76-1.96C21.4 8.75 22 11.1 22 14.2V21h-4v-6.03c0-1.44-.03-3.3-2.02-3.3-2.02 0-2.33 1.57-2.33 3.19V21h-4V9Z" />
    </svg>
  );
}

function TwitterGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M18.9 2.5h3.4l-7.43 8.49 8.74 11.51h-6.85l-5.36-7.01-6.13 7.01H1.87l7.95-9.09L1.5 2.5h7.02l4.85 6.41 5.53-6.41Zm-1.2 17.9h1.88L7.4 4.5H5.39l12.31 15.9Z" />
    </svg>
  );
}

function YouTubeGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.12-2.12C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.53A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.12 2.12c1.88.53 9.38.53 9.38.53s7.5 0 9.38-.53a3 3 0 0 0 2.12-2.12A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.27 3.6-6.27 3.6Z" />
    </svg>
  );
}

const FOOTER_LINKS = [
  {
    title: 'Catalogue',
    links: [
      { href: '/products', label: 'All Products' },
      { href: '/suppliers', label: 'Brands & Suppliers' },
      { href: '/prices', label: 'Live Prices' },
      { href: '/compare', label: 'Compare Products' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { href: '/calculators', label: 'Steel Weight Calculator' },
      { href: '/calculators#converter', label: 'Unit Converter' },
      { href: '/calculators#estimator', label: 'Cost Estimator' },
      { href: '/blog', label: 'Steel Blog' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Steelsetu' },
      { href: '/contact', label: 'Contact' },
      { href: '/community', label: 'Community' },
      { href: '/user-login', label: 'Post Your Requirement' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/disclaimer', label: 'Trade Disclaimer' },
      { href: '/login', label: 'Staff Login' },
      { href: '/trade-desk', label: 'Trade Desk' },
    ],
  },
];

export default function SiteFooter({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const isDark = tone === 'dark';

  return (
    <footer
      data-layer={isDark ? 'marketing' : 'product'}
      className={
        isDark
          ? 'relative overflow-hidden border-t border-white/10 bg-ss-ink text-slate-300'
          : 'border-t border-ss-line bg-white text-ss-muted'
      }
    >
      {isDark && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(37,99,235,0.6), rgba(249,115,22,0.5), transparent)',
          }}
        />
      )}

      <div className="ss-container relative py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.4fr]">
          {/* Brand block */}
          <div className="max-w-sm">
            <SteelsetuLogo tone={isDark ? 'dark' : 'light'} />

            <p
              className={`mt-5 text-sm leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-ss-muted'
              }`}
            >
              Build to make steel trading simple — Singhi Enterprises
              (Burrabazar, Kolkata).
            </p>

            {/* Official Registration & Stockist Notice */}
            <div className="mt-4 rounded-xl border border-blue-800/40 bg-blue-950/20 p-3 text-xs text-blue-200/90 font-mono leading-relaxed flex items-start gap-2">
              <Building2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                Singhi Enterprises · Maharshi Debendra Road, Burrabazar, Kolkata - 700007, West Bengal. Registered Industrial Steel Stockist &amp; Commercial Trade Desk.
              </span>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <a
                href="mailto:hello@steelsetu.com"
                className={`flex items-center gap-3 transition-colors ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-ss-muted hover:text-ss-blue'
                }`}
              >
                <Mail className="h-4 w-4 text-ss-blue" aria-hidden="true" />
                hello@steelsetu.com
              </a>

              <a
                href="https://wa.me/919883051500"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 transition-colors ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-ss-muted hover:text-ss-blue'
                }`}
              >
                <MessageCircle className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                WhatsApp +91 98830 51500
              </a>

              <a
                href="tel:+919883051500"
                className={`flex items-center gap-3 transition-colors ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-ss-muted hover:text-ss-blue'
                }`}
              >
                <Phone className="h-4 w-4 text-ss-orange" aria-hidden="true" />
                +91 98830 51500
              </a>

              <p
                className={`flex items-start gap-3 ${
                  isDark ? 'text-slate-400' : 'text-ss-muted'
                }`}
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ss-blue" aria-hidden="true" />
                Maharshi Debendra Road, Burrabazar, Kolkata, West Bengal 700007
              </p>
            </div>

            <div className="mt-7 flex items-center gap-2.5">
              {[
                { href: 'https://www.linkedin.com/company/steelsetu', Icon: LinkedInGlyph, label: 'LinkedIn' },
                { href: 'https://twitter.com/steelsetu', Icon: TwitterGlyph, label: 'Twitter' },
                { href: 'https://www.youtube.com/@steelsetu', Icon: YouTubeGlyph, label: 'YouTube' },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`ss-tap inline-flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                    isDark
                      ? 'border-white/10 bg-white/5 text-slate-400 hover:border-ss-blue/50 hover:text-white'
                      : 'border-ss-line bg-ss-light text-ss-muted hover:border-ss-blue hover:text-ss-blue'
                  }`}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title}>
                <h3
                  className={`ss-eyebrow ${
                    isDark ? 'text-slate-200' : 'text-ss-text'
                  }`}
                >
                  {group.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.href + link.label}>
                      <Link
                        href={link.href}
                        className={`text-sm transition-colors ${
                          isDark
                            ? 'text-slate-400 hover:text-ss-orange'
                            : 'text-ss-muted hover:text-ss-blue'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`mt-14 flex flex-col items-center justify-between gap-4 border-t pt-7 text-xs sm:flex-row ${
            isDark ? 'border-white/10 text-slate-500' : 'border-ss-line text-ss-muted'
          }`}
        >
          <p>© <FooterYear /> Steelsetu. All rights reserved.</p>
          <p className={isDark ? 'text-slate-600' : 'text-ss-muted'}>
            Singhi Enterprises · Maharshi Debendra Road, Burrabazar, Kolkata - 700007, West Bengal. Registered Industrial Steel Stockist &amp; Commercial Trade Desk.
          </p>
        </div>
      </div>
    </footer>
  );
}
