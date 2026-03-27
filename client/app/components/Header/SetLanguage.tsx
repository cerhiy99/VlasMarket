'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Locale } from '@/i18n.config';
import React, { useState, useEffect } from 'react';
import './SetLanguage.scss';
import { getLocalizedPath } from '../utils/getLocalizedPath';

type Props = {
  lang: Locale;
};

const SetLanguage = ({ lang }: Props) => {
  const pathname = usePathname();
  const router = useRouter();

  // Використовуємо локальний стан для керування анімацією
  const [activeLang, setActiveLang] = useState<Locale>(lang);

  // Синхронізуємо локальний стан з пропсом lang
  useEffect(() => {
    setActiveLang(lang);
  }, [lang]);

  const handleLangClick = (newLang: Locale) => {
    if (newLang === activeLang) return;

    // Спочатку оновлюємо локальний стан, щоб запустити анімацію
    setActiveLang(newLang);

    // Отримуємо новий шлях
    const newPath = getLocalizedPath(pathname, newLang);

    // Запускаємо перехід через таймаут
    setTimeout(() => {
      router.push(newPath);
    }, 100); // Час анімації в SCSS
  };

  return (
    <div id="set-language-container">
      <div className={`lang-bg ${activeLang === 'ua' ? 'left' : 'right'}`} />
      <div
        className={`lang-link ${activeLang === 'ua' ? 'active' : ''}`}
        onClick={() => handleLangClick('ua')}
      >
        УКР
      </div>
      <div
        className={`lang-link ${activeLang === 'ru' ? 'active' : ''}`}
        onClick={() => handleLangClick('ru')}
      >
        РУС
      </div>
    </div>
  );
};

export default SetLanguage;
