'use client'; // Це важливо, оскільки ми використовуємо клієнтські хуки Next.js

import { Locale } from '@/i18n.config';
import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation'; // Імпортуємо необхідні хуки
import './Sort.scss';
import { getLocalizedPath } from '../../utils/getLocalizedPath';

type Props = {
  lang: Locale;
  brend?: string;
  // currentSearchParams тепер не потрібен безпосередньо в Props,
  // оскільки ми будемо використовувати useSearchParams() для актуальних параметрів URL
};

const Sort = ({ lang, brend }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Отримуємо поточні параметри запиту з URL

  // Визначимо варіанти сортування та їхні відповідні значення для URL
  const sortOptions = [
    {
      label: lang == 'ru' ? 'популярности' : 'популярності',
      value: 'popularity',
    },
    {
      label: lang == 'ru' ? 'цене (по возрастанию)' : 'ціні (за зростанням)',
      value: 'price_asc',
    }, // За замовчуванням зростання ціни. Можна додати логіку перемикання на price_desc.
    {
      label: lang == 'ru' ? 'цене (по убыванию)' : 'ціні (за спаданням)',
      value: 'price_desc',
    }, // За замовчуванням зростання ціни. Можна додати логіку перемикання на price_desc.
    { label: lang == 'ru' ? 'названии' : 'назві', value: `name_${lang}` }, // За замовчуванням за назвою (А-Я)
    { label: 'рейтингу', value: 'rating_desc' }, // За замовчуванням спадання рейтингу (від найвищого)
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

    // Оновлюємо URL, що призведе до перезавантаження даних з новими параметрами сортування
    if (brend)
      router.push(
        getLocalizedPath(
          `/${lang}/brands/${brend}/1?${params.toString()}`,
          lang,
        ),
      );
    else
      router.push(
        getLocalizedPath(`/${lang}/goods/1?${params.toString()}`, lang),
      );
  };

  // Визначаємо активний варіант сортування з URL або встановлюємо 'popularity' за замовчуванням
  const currentSort = searchParams.get('sort') || '';

  return (
    <div className="sort-container">
      <p>{lang == 'ru' ? 'Сортировать по:' : 'Сортувати по:'}</p>
      <div className="list-sort-for">
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
  );
};

export default Sort;
