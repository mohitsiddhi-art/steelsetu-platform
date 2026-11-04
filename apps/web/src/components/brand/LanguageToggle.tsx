'use client';

import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle({ className = '' }: { className?: string }) {
  const { locale, toggleLocale } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md transition-colors hover:bg-white/10 ${className}`}
      aria-label="Toggle Language EN / हि"
    >
      <Globe className="h-3.5 w-3.5 text-ss-orange" />
      <span>{locale === 'en' ? 'EN | हि' : 'हि | EN'}</span>
    </button>
  );
}
