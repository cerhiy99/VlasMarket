'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';

// 1. ВИДАЛЯЄМО метадані звідси (вони тут не працюють)

const getLocaleFromPathname = (pathname: string): 'ua' | 'ru' => {
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0];
  return locale === 'ru' ? 'ru' : 'ua';
};

export default function NotFound() {
  const pathname = usePathname();
  const [locale, setLocale] = useState<'ua' | 'ru'>('ua');

  useEffect(() => {
    setLocale(getLocaleFromPathname(pathname));
  }, [pathname]);

  const titles = {
    ua: 'Сторінку не знайдено',
    ru: 'Страница не найдена',
  };

  const buttonTexts = {
    ua: {
      home: 'На головну',
      catalog: 'У каталог',
    },
    ru: {
      home: 'На главную',
      catalog: 'В каталог',
    },
  };

  return (
    // 2. ЗАМІНЯЄМО html/body на звичайний div або Fragment
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2rem',
        boxSizing: 'border-box',
        backgroundColor: '#111', // переносимо сюди стилі з body
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: '10rem',
          fontWeight: 900,
          color: '#e11d48',
          marginBottom: '1rem',
          marginTop: 0,
        }}
      >
        404
      </h1>
      <div
        style={{
          fontSize: '1.5rem',
          marginBottom: '2rem',
          color: '#ccc',
        }}
      >
        {titles[locale]}
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link
          href={`/${locale === 'ru' ? 'ru' : ''}`}
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            border: '2px solid #e11d48',
            color: '#e11d48',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          {buttonTexts[locale].home}
        </Link>
        <Link
          href={`/${locale === 'ru' ? 'ru/' : ''}goods/1`}
          style={{
            display: 'inline-block',
            padding: '0.75rem 1.5rem',
            border: '2px solid #e11d48',
            color: '#e11d48',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          {buttonTexts[locale].catalog}
        </Link>
      </div>
    </main>
  );
}

/*
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Metadata } from 'next';

const getLocaleFromPathname = (pathname: string): 'ua' | 'ru' => {
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0];
  return locale === 'ru' ? 'ru' : 'ua';
};

export const metadata: Metadata = {
  title: 'Сторінку не знайдено',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function NotFound() {
  const pathname = usePathname();
  const [locale, setLocale] = useState<'ua' | 'ru'>('ua');

  useEffect(() => {
    setLocale(getLocaleFromPathname(pathname));
  }, [pathname]);

  const titles = {
    ua: 'Сторінку не знайдено',
    ru: 'Страница не найдена',
  };

  const buttonTexts = {
    ua: {
      home: 'На головну',
      catalog: 'У каталог',
    },
    ru: {
      home: 'На главную',
      catalog: 'В каталог',
    },
  };

  return (
    <html>
      <body
        style={{
          margin: 0,
          backgroundColor: '#111',
          color: '#fff',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '2rem',
            boxSizing: 'border-box',
          }}
        >
          <h1
            style={{
              fontSize: '10rem',
              fontWeight: 900,
              color: '#e11d48',
              marginBottom: '1rem',
              marginTop: 0,
            }}
          >
            404
          </h1>
          <div
            style={{
              fontSize: '1.5rem',
              marginBottom: '2rem',
              color: '#ccc',
            }}
          >
            {titles[locale]}
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link
              href={`/${locale == 'ru' ? 'ru' : ''}`}
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                border: '2px solid #e11d48',
                color: '#e11d48',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease-in-out',
                WebkitTransition: 'all 0.2s ease-in-out',
                msTransition: 'all 0.2s ease-in-out',
              }}
            >
              {buttonTexts[locale].home}
            </Link>
            <Link
              href={`/${locale == 'ru' ? 'ru/' : ''}goods/1`}
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                border: '2px solid #e11d48',
                color: '#e11d48',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease-in-out',
                WebkitTransition: 'all 0.2s ease-in-out',
                msTransition: 'all 0.2s ease-in-out',
              }}
            >
              {buttonTexts[locale].catalog}
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}*/
