'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Language, TRANSLATIONS } from '@/utils/translations';

interface LanguageContextType {
  locale: Language;
  toggleLocale: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('steelsetu_lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'hi')) {
      setLocale(savedLang);
    }
  }, []);

  const toggleLocale = () => {
    setLocale((prev) => {
      const newLang = prev === 'en' ? 'hi' : 'en';
      localStorage.setItem('steelsetu_lang', newLang);
      return newLang;
    });
  };

  const t = (key: string): string => {
    return TRANSLATIONS[locale][key] || TRANSLATIONS['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, toggleLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      locale: 'en' as Language,
      toggleLocale: () => {},
      t: (key: string) => TRANSLATIONS['en'][key] || key,
    };
  }
  return context;
}
