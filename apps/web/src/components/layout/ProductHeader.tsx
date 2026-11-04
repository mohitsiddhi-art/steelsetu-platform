'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import SteelsetuLogo from '@/components/brand/SteelsetuLogo';
import LanguageToggle from '@/components/brand/LanguageToggle';

/**
 * The clean product & community layer header.
 *
 * Sticky, solid white, compact. Deliberately a different visual language
 * from the marketing header — no transparency, no glass, no 3D. The product
 * layer is about reading data, so the chrome stays out of the way.
 */

const NAV_LINKS = [
  { href: '/products', label: 'Products' },
  { href: '/suppliers', label: 'Suppliers' },
  { href: '/prices', label: 'Prices' },
  { href: '/calculators', label: 'Calculators' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function ProductHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-shadow ${
          scrolled ? 'border-ss-line shadow-sm' : 'border-transparent'
        }`}
      >
        <div className="ss-container">
          <div className="flex h-16 items-center justify-between gap-4">
            <SteelsetuLogo tone="light" animated={false} compact />

            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-[0.85rem] font-medium text-ss-muted transition-colors hover:bg-ss-light hover:text-ss-text"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2.5">
              <LanguageToggle className="hidden md:inline-flex !border-ss-line !bg-ss-light" />

              <a
                href="https://wa.me/919883051500"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-[0.8rem] font-semibold text-emerald-700 transition-colors hover:bg-emerald-100 sm:inline-flex"
              >
                <Phone className="h-3.5 w-3.5" />
                WhatsApp
              </a>

              <Link
                href="/user-login?intent=post"
                className="hidden rounded-full bg-ss-orange px-4 py-2 text-[0.8rem] font-semibold text-white transition-colors hover:bg-ss-orange-2 md:inline-flex"
              >
                Post Your Requirement
              </Link>

              <Link
                href="/user-login"
                className="rounded-full border border-ss-line bg-white px-4 py-2 text-[0.8rem] font-semibold text-ss-text transition-colors hover:border-ss-blue hover:text-ss-blue"
              >
                Login
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="ss-tap inline-flex items-center justify-center rounded-lg border border-ss-line bg-white text-ss-text lg:hidden"
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-ss-ink/50 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 right-0 w-[min(20rem,88vw)] overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <SteelsetuLogo tone="light" animated={false} size={34} />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="ss-tap inline-flex items-center justify-center rounded-lg border border-ss-line text-ss-text"
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
                  className="rounded-lg px-3 py-3 text-base font-medium text-ss-text transition-colors hover:bg-ss-light"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-6 flex flex-col gap-3">
              <LanguageToggle className="self-start !border-ss-line !bg-ss-light" />
              <Link
                href="/user-login?intent=post"
                onClick={() => setMenuOpen(false)}
                className="rounded-full bg-ss-orange px-5 py-3 text-center text-sm font-semibold text-white"
              >
                Post Your Requirement
              </Link>
              <a
                href="https://wa.me/919883051500"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-semibold text-emerald-700"
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
