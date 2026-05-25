'use client';

import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Locale, defaultLocale, locales } from '@/i18n';
import en from '@/i18n/en.json';
import es from '@/i18n/es.json';

interface Translations {
  [key: string]: string | Translations;
}

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  locales: Locale[];
}

export const I18nContext = createContext<I18nContextValue | null>(null);

const allMessages: Record<Locale, Translations> = { en, es };

function getNestedValue(obj: Translations, path: string): string {
  const keys = path.split('.');
  let current: Translations | string = obj;
  for (const key of keys) {
    if (typeof current === 'object' && current !== null && key in current) {
      current = current[key] as Translations | string;
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const stored = localStorage.getItem('i18n-locale') as Locale | null;
    if (stored && locales.includes(stored)) {
      setLocaleState(stored);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('i18n-locale', newLocale);
  }, []);

  const t = useCallback(
    (key: string): string => getNestedValue(allMessages[locale], key),
    [locale],
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, locales }}>
      {children}
    </I18nContext.Provider>
  );
}
