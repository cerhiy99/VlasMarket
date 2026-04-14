'use client';
import React, { useRef, useState, useEffect } from 'react';
import './Brends.scss';
import Link from 'next/link';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { Locale } from '@/i18n.config';
import { toSlug } from '../utils/addittional';

type Props = {
  brends: any;
  lang: Locale;
};

const Brends = ({ brends, lang }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);
  const [isStart, setIsStart] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  // Кількість товарів на одній сторінці мобілки
  const itemsPerPage = 4;
  const totalPages = Math.ceil(brends.length / itemsPerPage);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      // Оновлюємо стан стрілок
      setIsStart(scrollLeft <= 5);
      setIsEnd(scrollLeft + clientWidth >= scrollWidth - 5);

      // Вираховуємо поточну сторінку
      const pageIndex = Math.round(scrollLeft / clientWidth);
      setActivePage(pageIndex);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const offset = direction === 'left' ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const scrollToPage = (pageIndex: number) => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      scrollRef.current.scrollTo({
        left: pageIndex * clientWidth,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    checkScroll();
  }, []);

  return (
    <div className="brends-wrapper">
      <button
        className="slider-arrow prev"
        onClick={() => scroll('left')}
        style={{
          opacity: isStart ? 0.3 : 1,
          pointerEvents: isStart ? 'none' : 'auto',
        }}
      >
        ‹
      </button>

      <button
        className="slider-arrow next"
        onClick={() => scroll('right')}
        style={{
          opacity: isEnd ? 0.3 : 1,
          pointerEvents: isEnd ? 'none' : 'auto',
        }}
      >
        ›
      </button>

      <div className="brends-container" ref={scrollRef} onScroll={checkScroll}>
        {brends.map((x: any) => (
          <Link
            href={getLocalizedPath(`/${lang}/brands/${toSlug(x.name)}/1`, lang)}
            key={x.id}
            className="mini-brend-container"
          >
            <div className="brend">{x.name}</div>
          </Link>
        ))}
      </div>

      <div className="pagination-dots">
        {/* Створюємо крапки відповідно до кількості сторінок (по 4 бренди на кожну) */}
        {Array.from({ length: totalPages }).map((_, i) => (
          <span
            key={i}
            className={`dot ${activePage === i ? 'active' : ''}`}
            onClick={() => scrollToPage(i)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Brends;
