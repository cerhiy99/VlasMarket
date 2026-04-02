import { useRouter } from 'next/navigation';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  to?: string;
}

const PaginationDynamic: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  to,
}) => {
  const router = useRouter();
  const getPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Завжди показуємо перші дві
      pages.push(1, 2);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Логіка для поточної сторінки, якщо вона не на краях
      if (currentPage > 2 && currentPage < totalPages - 1) {
        pages.push(currentPage);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Завжди показуємо останню сторінку (як на скріні "6")
      pages.push(totalPages);
    }
    return pages;
  };

  const changePage = (page: number) => {
    onPageChange(page);
    if (to) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="pagination">
      <button
        className="butNoSelect"
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.75 10L1.25 7.5M1.25 7.5L3.75 5M1.25 7.5L13.75 7.5"
            stroke="#7F7F7F"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      {getPages().map((p, index) => (
        <button
          key={index}
          className={currentPage === p ? 'but active' : 'but'}
          onClick={() => typeof p === 'number' && changePage(p)}
          disabled={p === '...'}
        >
          {p}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => changePage(currentPage + 1)}
        className="butNoSelect"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.25 5L13.75 7.5M13.75 7.5L11.25 10M13.75 7.5H1.25"
            stroke="black"
            stroke-width="1.25"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default PaginationDynamic;
