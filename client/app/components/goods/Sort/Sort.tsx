'use client'; // Це важливо, оскільки ми використовуємо клієнтські хуки Next.js

import { Locale } from '@/i18n.config';
import React, { useState } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation'; // Імпортуємо необхідні хуки
import './Sort.scss';
import { getLocalizedPath } from '../../utils/getLocalizedPath';
import SortSVG from '../../../assest/Filters/SortDown.svg';
import CloseSVG from '../../../assest/Filters/Close.svg';

type Props = {
  lang: Locale;
  url: string;
  // currentSearchParams тепер не потрібен безпосередньо в Props,
  // оскільки ми будемо використовувати useSearchParams() для актуальних параметрів URL
};

const Sort = ({ lang, url }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Отримуємо поточні параметри запиту з URL

  // Визначимо варіанти сортування та їхні відповідні значення для URL
  const sortOptions = [
    {
      label: lang != 'ru' ? 'Популярні товари' : 'Популярные товары',
      value: 'popularity',
    },
    {
      label: lang == 'ru' ? 'Дешевые сначала' : 'Дешевші спочатку',
      value: 'price_asc',
    }, // За замовчуванням зростання ціни. Можна додати логіку перемикання на price_desc.
    {
      label: lang != 'ru' ? 'Дорожчі спочатку' : 'Дороже сначала',
      value: 'price_desc',
    }, // За замовчуванням зростання ціни. Можна додати логіку перемикання на price_desc.
    {
      label: lang != 'ru' ? 'За алфавітом' : 'По алфавиту',
      value: `name_${lang}`,
    }, // За замовчуванням за назвою (А-Я)
    {
      label: lang != 'ru' ? 'Найкращі відгуки' : 'Лучшие отзывы',
      value: 'rating_desc',
    }, // За замовчуванням спадання рейтингу (від найвищого)
  ];

  // Функція обробки кліку на опцію сортування
  const handleSortClick = (sortValue: string) => {
    // Створюємо новий об'єкт URLSearchParams на основі поточних параметрів
    const params = new URLSearchParams(searchParams.toString());
    if (currentSort == sortValue) {
      params.delete('sort');
    } else {
      // Встановлюємо або оновлюємо параметр 'sort'
      params.set('sort', sortValue);
    }
    console.log(
      6432434,
      url,
      getLocalizedPath(`/${lang}/${url}?${params.toString()}`, lang)
    );
    // Оновлюємо URL, що призведе до перезавантаження даних з новими параметрами сортування
    router.push(getLocalizedPath(`/${lang}/${url}?${params.toString()}`, lang));
  };

  // Визначаємо активний варіант сортування з URL або встановлюємо 'popularity' за замовчуванням
  const currentSort = searchParams.get('sort') || '';

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="sort-container">
      <div
        className="title-sort"
        style={{ display: 'flex', flexDirection: 'row' }}
        onClick={() => setIsOpen(true)}
      >
        {lang == 'ru' ? 'Сортировка' : 'Сортування'}
        <div id="svg-mob1">
          <SortSVG />
        </div>
      </div>
      <div className={`list-sort-for-container ${isOpen ? 'open' : 'close'}`}>
        <div className={`list-sort-for ${isOpen ? 'open' : ''}`}>
          <div className="mob-title">
            {lang == 'ru' ? 'Сортировка' : 'Сортування'}
            <div onClick={() => setIsOpen(false)} className="close">
              <CloseSVG />
            </div>
          </div>
          {sortOptions.map((option) => (
            <span
              key={option.value}
              // Динамічно застосовуємо клас 'active', якщо це поточний варіант сортування
              className={currentSort === option.value ? 'active' : ''}
              onClick={() => handleSortClick(option.value)}
            >
              {option.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sort;
