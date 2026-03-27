'use client';
import { Locale } from '@/i18n.config';
import React, { useState, useEffect } from 'react';
import { m, LazyMotion, domAnimation } from 'framer-motion';
import MiniGoods from './MiniGoods';
import RightSvg from '../../assest/Home/Right.svg';
import LeftSVG from '../../assest/Home/Left.svg';
import './ListGoodsLeft.scss';

type Props = { lang: Locale; dictionary: any; data: any };

const ListGoodsLeftWithRealGoods = ({ lang, dictionary, data }: Props) => {
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [listGoods, setListGoods] = useState<any[]>([]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width >= 1400) {
        setLimit(5);
      } else if (width >= 1124) {
        setLimit(4);
      } else if (width >= 800) {
        setLimit(3);
      } else if (width >= 375) {
        setLimit(2);
      } else {
        setLimit(1);
      }
    };

    // Виклик функції для встановлення початкового значення
    handleResize();

    // Додаємо обробник події при зміні розміру вікна
    window.addEventListener('resize', handleResize);

    // Очищуємо обробник при відмонтовані компонента
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const startIndex = currentPage * limit;
    const endIndex = startIndex + limit;
    setListGoods(data.slice(startIndex, endIndex));
  }, [limit, currentPage]);

  const handleNext = () => {
    if ((currentPage + 1) * limit < data.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="list-goods-left-container" id="listGoodsLeft">
      <div
        className={`scroll-button left ${
          currentPage > 0 ? 'arrow-active' : 'disabled'
        }`}
        onClick={handlePrevious}
      >
        <LeftSVG />
      </div>

      <div className={`list-goods limit-${limit}`}>
        {listGoods.map((item: any, index) => (
          <m.div
            key={item.id}
            style={{ minWidth: '100%', display: 'flex' }}
            initial={{ opacity: 1, y: 20 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <MiniGoods lang={lang} dictionary={dictionary} goods={item} />
          </m.div>
        ))}
      </div>

      <div
        className={`scroll-button right ${
          (currentPage + 1) * limit < data.length ? 'arrow-active' : 'disabled'
        }`}
        onClick={handleNext}
      >
        <RightSvg />
      </div>
    </div>
  );
};

export default ListGoodsLeftWithRealGoods;
