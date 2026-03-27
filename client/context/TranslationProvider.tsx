'use client';

import { ReactNode, createContext, useContext, useEffect, useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { Locale } from '@/i18n.config';

interface TranslationContextType {
  t: (key: string, options?: Record<string, string | number>) => string | string[];
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isLoaded: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children, lang }: { children: ReactNode; lang: Locale }) {
  const pathname = usePathname();
  const [dictionary, setDictionary] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Ініціалізуємо мову з пропса lang, який прийшов з серверного Layout
  const [locale, setLocale] = useState<Locale>(lang);

  // Слідкуємо за зміною lang (якщо користувач перейшов на іншу мовну версію)
  useEffect(() => {
    let isMounted = true;
    setIsLoaded(false);

    // Важливо: перевіряємо чи lang не порожній (якщо у вас '' для української)
    const currentLang = lang || 'ua'; // адаптуйте під ваші файли в public/dictionaries/

    fetch(`/dictionaries/${currentLang}.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setDictionary(data);
          setIsLoaded(true);
        }
      })
      .catch((err) => {
        console.error('Failed to load dictionary:', err);
        setIsLoaded(true); // зупиняємо лоадер навіть при помилці
      });

    return () => {
      isMounted = false;
    };
  }, [lang]);

  // Функція перекладу (мемоізована для продуктивності)
  const t = useMemo(() => {
    return (key: string, options?: Record<string, string | number>): string | string[] => {
      if (!dictionary) return key; // Повертаємо ключ замість порожнечі, поки вантажиться

      const keys = key.split('.');
      let result: any = dictionary;

      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          return key;
        }
      }

      if (typeof result === 'string') {
        let interpolatedString = result;
        if (options) {
          for (const [optionKey, value] of Object.entries(options)) {
            interpolatedString = interpolatedString.replace(
              new RegExp(`{${optionKey}}`, 'g'), // глобальна заміна
              String(value)
            );
          }
        }
        return interpolatedString;
      }

      return result || key;
    };
  }, [dictionary]);

  return (
    <TranslationContext.Provider value={{ t, locale, setLocale, isLoaded }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
