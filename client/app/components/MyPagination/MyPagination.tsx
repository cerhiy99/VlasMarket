// components/Pagination/Pagination.tsx
import Link from 'next/link';
import React from 'react';
import './MyPagination.scss'; // Переконайтеся, що шлях до стилів правильний
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { Locale } from '@/i18n.config';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  currentSearchParams: { [key: string]: string | string[] | undefined } | any;
  currentPathname: string; // Очікується шлях без номера сторінки, наприклад "/ua/goods"
  lang: Locale;
  // Або шлях з номером, який ми обробимо всередині
}

const MyPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  currentSearchParams,
  currentPathname,
  lang,
}) => {
  const generatePageLink = (page: number) => {
    // 1. Визначаємо базовий шлях для пагінації (без номера сторінки)
    // Наприклад, якщо currentPathname = "/ua/goods/2", то baseForPagination має стати "/ua/goods"
    let baseForPagination = currentPathname;
    const pathSegments = currentPathname.split('/').filter((s) => s !== ''); // Розбиваємо шлях на сегменти

    // 2. Фільтруємо параметр 'PAGEN_1' з існуючих пошукових параметрів,
    // оскільки він більше не буде використовуватися для пагінації
    const filteredSearchParams = Object.entries(currentSearchParams).filter(
      ([key]) => key !== 'PAGEN_1',
    );

    // 3. Створюємо URLSearchParams з решти фільтрів
    const params = new URLSearchParams(
      filteredSearchParams.flatMap(([key, value]) => {
        if (Array.isArray(value)) {
          return value.map((v) => [key, v]);
        }
        return value ? [[key, value]] : [];
      }),
    );

    const queryString = params.toString(); // Генеруємо рядок запиту з фільтрів

    // 4. Формуємо кінцевий URL-шлях з номером сторінки
    let finalPathSegment = '';

    // Якщо сторінка не перша, додаємо її номер до шляху
    finalPathSegment = `/${page}`;
    // Якщо page === 1, finalPathSegment залишається порожнім, і посилання буде на базовий шлях (наприклад, /ua/goods)

    // 5. Комбінуємо базовий шлях, сегмент сторінки та рядок запиту
    return `${baseForPagination}${finalPathSegment}${currentSearchParams.toString() != '' ? `?${currentSearchParams.toString()}` : ''}`.replace(
      '//',
      '/',
    );
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5; // Total number of visible page buttons (e.g., 1 2 3 ... 7)
    const boundaryPages = 1; // Number of pages always visible at the start and end (e.g., 1, 7)
    const middlePages = maxVisiblePages - 2 * boundaryPages; // Number of pages to show around current page

    // Always show the first page if totalPages > 0
    if (totalPages > 0) {
      pages.push(
        <PaginationItem
          key={1}
          page={1}
          isActive={currentPage === 1}
          href={generatePageLink(1)}
          lang={lang}
        />,
      );
    }

    // Determine the range of pages to show around the current page
    let startMiddle = Math.max(
      boundaryPages + 1,
      currentPage - Math.floor(middlePages / 2),
    );
    let endMiddle = Math.min(
      totalPages - boundaryPages,
      currentPage + Math.floor(middlePages / 2),
    );

    // Adjust the middle range if it overlaps with the start or end boundary pages
    if (endMiddle - startMiddle + 1 < middlePages) {
      // If the range is too small
      if (startMiddle <= boundaryPages + 1) {
        // If it's near the beginning
        endMiddle = Math.min(
          totalPages - boundaryPages,
          startMiddle + middlePages - 1,
        );
      } else if (endMiddle >= totalPages - boundaryPages) {
        // If it's near the end
        startMiddle = Math.max(boundaryPages + 1, endMiddle - middlePages + 1);
      }
    }

    // Ensure startMiddle doesn't go beyond endMiddle
    if (startMiddle > endMiddle) {
      startMiddle = endMiddle;
    }

    // Add ellipsis after the first page if necessary
    if (startMiddle > boundaryPages + 1) {
      pages.push(
        <span key="ellipsis-start" className="pagination-ellipsis">
          ...
        </span>,
      );
    }

    // Add middle pages
    for (let i = startMiddle; i <= endMiddle; i++) {
      // Avoid duplicating the first page if startMiddle happens to be 1
      if (i === 1) continue;
      // Avoid duplicating the last page if endMiddle happens to be totalPages
      if (i === totalPages) continue;

      pages.push(
        <PaginationItem
          key={i}
          page={i}
          isActive={currentPage === i}
          href={generatePageLink(i)}
          lang={lang}
        />,
      );
    }

    // Add ellipsis before the last page if necessary
    if (endMiddle < totalPages - boundaryPages) {
      pages.push(
        <span key="ellipsis-end" className="pagination-ellipsis">
          ...
        </span>,
      );
    }

    // Always show the last page if totalPages > 1 and it hasn't been added yet
    if (
      totalPages > 1 &&
      (pages.length === 0 ||
        parseInt(pages[pages.length - 1].key as string) !== totalPages)
    ) {
      pages.push(
        <PaginationItem
          key={totalPages}
          page={totalPages}
          isActive={currentPage === totalPages}
          href={generatePageLink(totalPages)}
          lang={lang}
        />,
      );
    }

    return pages;
  };

  return (
    <nav className="pagination-container2" aria-label="Навігація по сторінках">
      <ul className="pagination-list">
        {/* Кнопка "Попередня" */}
        {currentPage > 1 && (
          <PaginationItem
            key="prev"
            page="<"
            isActive={false}
            href={generatePageLink(currentPage - 1)}
            lang={lang}
          />
        )}

        {renderPageNumbers()}

        {/* Кнопка "Наступна" */}
        {currentPage < totalPages && (
          <PaginationItem
            key="next"
            page=">"
            isActive={false}
            href={generatePageLink(currentPage + 1)}
            lang={lang}
          />
        )}
      </ul>
    </nav>
  );
};

interface PaginationItemProps {
  page: number | string;
  isActive: boolean;
  href: string;
  lang: Locale;
}

const PaginationItem: React.FC<PaginationItemProps> = ({
  page,
  isActive,
  href,
  lang,
}) => {
  return (
    <li>
      <Link
        href={getLocalizedPath(href, lang)}
        className={`pagination-item ${isActive ? 'active' : ''}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {page}
      </Link>
    </li>
  );
};

export default MyPagination;
