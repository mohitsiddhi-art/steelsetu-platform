'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import SteelsetuLogo from '@/components/brand/SteelsetuLogo';
import LanguageToggle from '@/components/brand/LanguageToggle';

/**
 * The cinematic-layer header.
 *
 * It starts fully transparent over the hero and, once the page scrolls, it
 * condenses into a floating glassmorphism pill with a gradient hairline
 * border. The transition is driven by a scroll listener rather than by
 * re-rendering on every frame — the handler only flips a boolean past the
 * threshold.
 *
 * This header is only for the marketing layer. The product and community
 * pages use {@link ProductHeader}, which is a different visual language.
 */

const NAV_LINKS = [
  { href: '/products', label: 'Products' },
  { href: '/suppliers', label: 'Suppliers' },
  { href: '/prices', label: 'Prices' },
  { href: '/calculators', label: 'Calculators' },
  { href: '/blog', label: 'Blog' },
  { href: '/community', label: 'Community' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function MarketingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Escape closes the sheet.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 bg-[#050811]/90 backdrop-blur-xl border-b border-white/10 shadow-xl ${
          scrolled ? 'py-2.5' : 'py-5'
        }`}
      >
        <div className="ss-container">
          <div
            className={`flex items-center justify-between gap-4 transition-all duration-300 ${
              scrolled
                ? 'ss-glass ss-hairline rounded-2xl px-4 py-2.5 shadow-2xl'
                : 'ss-glass ss-hairline rounded-2xl px-4 py-2 shadow-xl'
            }`}
          >
            <SteelsetuLogo tone="dark" animated={!scrolled} />

            {/* Desktop navigation */}
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-[0.82rem] font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2.5">
              <LanguageToggle className="inline-flex" />

              <Link
                href="/user-login?intent=post"
                className="ss-molten hidden rounded-full px-4 py-2 text-[0.8rem] font-semibold text-white md:inline-flex"
              >
                Post Your Requirement
              </Link>

              <Link
                href="/user-login"
                className="hidden rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[0.8rem] font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/10 md:inline-flex"
              >
                Login / Sign Up
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="ss-tap inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 text-white lg:hidden"
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-ss-ink/85 backdrop-blur-sm"
          />
          <div className="ss-glass absolute inset-y-0 right-0 w-[min(20rem,88vw)] overflow-y-auto border-l border-white/10 p-6">
            <div className="mb-8 flex items-center justify-between">
              <SteelsetuLogo tone="dark" size={34} />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="ss-tap inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 flex flex-col gap-3">
              <LanguageToggle className="self-start" />
              <Link
                href="/user-login?intent=post"
                onClick={() => setMenuOpen(false)}
                className="ss-molten rounded-full px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Post Your Requirement
              </Link>
              <Link
                href="/user-login"
                onClick={() => setMenuOpen(false)}
                className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Login / Sign Up
              </Link>
              <a
                href="https://wa.me/919883051500"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-3 text-sm font-semibold text-emerald-300"
              >
                <Phone className="h-4 w-4" />
                +91 98830 51500
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
