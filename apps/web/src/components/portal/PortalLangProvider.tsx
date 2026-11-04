'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { DEVA_STACK, PortalLang } from '@/lib/portalCopy';

/**
 * The portal's bilingual language context.
 *
 * The dashboard is a Layer 2 (light, crisp) surface, so unlike the marketing
 * pages it cannot rely on a server round-trip to swap every label. Instead
 * the language lives in a client context: the server renders the page in the
 * user's stored locale, and the toggle re-renders the labels in place.
 *
 * The choice is persisted under the same `steelsetu-lang` key the
 * site-wide `LanguageToggle` uses, so a visitor who has already chosen
 * हिन्दी elsewhere on the site arrives at the dashboard in हिन्दी too.
 */

const LANG_KEY = 'steelsetu-lang';

interface PortalLangContextValue {
  lang: PortalLang;
  setLang: (lang: PortalLang) => void;
  /** Pick the right side of a bilingual pair. */
  t: <T,>(en: T, hi: T) => T;
  /** The font stack for Devanagari text. */
  devaStack: string;
}

const PortalLangContext = createContext<PortalLangContextValue | null>(null);

/** Read the persisted language without touching the DOM. */
function readStoredLang(): PortalLang {
  if (typeof window === 'undefined') return 'en';
  try {
    return window.localStorage.getItem(LANG_KEY) === 'hi' ? 'hi' : 'en';
  } catch {
    return 'en';
  }
}

export function PortalLangProvider({
  children,
  initialLang = 'en',
}: {
  children: React.ReactNode;
  initialLang?: PortalLang;
}) {
  const [lang, setLangState] = useState<PortalLang>(initialLang);

  // The server's idea of the language comes from the profile; the browser's
  // comes from localStorage. A stored preference is the more recent signal,
  // so it wins once the client has had a chance to read it.
  useEffect(() => {
    const stored = readStoredLang();
    if (stored !== initialLang) setLangState(stored);
    // Only on mount — afterwards the user's explicit choice is authoritative.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the document in sync so the site-wide CSS and the site-wide
  // `LanguageToggle` agree with the portal.
  useEffect(() => {
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'hi' ? 'hi' : 'en');
  }, [lang]);

  const setLang = useCallback((next: PortalLang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(LANG_KEY, next);
    } catch {
      /* private mode — the choice just won't persist */
    }
  }, []);

  const value = useMemo<PortalLangContextValue>(
    () => ({
      lang,
      setLang,
      t: <T,>(en: T, hi: T) => (lang === 'hi' ? hi : en),
      devaStack: DEVA_STACK,
    }),
    [lang, setLang]
  );

  return (
    <PortalLangContext.Provider value={value}>
      {children}
    </PortalLangContext.Provider>
  );
}

/**
 * Read the portal language.
 *
 * Falls back to a working English context rather than throwing, so a
 * component rendered outside the provider still renders — it just will not
 * translate. That is a much better failure mode than a blank page.
 */
export function usePortalLang(): PortalLangContextValue {
  const ctx = useContext(PortalLangContext);

  if (ctx) return ctx;

  return {
    lang: 'en',
    setLang: () => {},
    t: <T,>(en: T, _hi: T) => en,
    devaStack: DEVA_STACK,
  };
}
