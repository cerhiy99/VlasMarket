'use client';
import { Locale } from '@/i18n.config';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MiniGoods from '../Home/MiniGoods';
import RightSvg from '../../assest/Home/Right.svg';
import LeftSVG from '../../assest/Home/Left.svg';
import './UserWatched.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { initializedFromUserWatched } from '@/app/store/reducers/userWatched';

type Props = { lang: Locale; dictionary: any; type: string; title: string };

const UserWatched = ({ lang, dictionary, type, title }: Props) => {
  const dispatch = useDispatch();
  const data = useSelector((state: RootState) => state.watched.watched);
  const [limit, setLimit] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [listGoods, setListGoods] = useState<any[]>([]);

  useEffect(() => {
    if (data.length == 0) {
      dispatch(initializedFromUserWatched());
    }
  }, []);
  useEffect(() => {
    const handleResize = () => {
      const width = window.outerWidth;

      if (width >= 1400) {
        setLimit(5);
      } else if (width >= 1124) {
        setLimit(4);
      } else if (width >= 800) {
        setLimit(3);
      } else if (width >= 350) {
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
  }, [limit, currentPage, data]);

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
  if (data.length == 0)
    return (
      <>
        <br /> <br /> <br />
      </>
    );
  return (
    <div className="list-goods-left-container-main">
      {' '}
      <p className="h2">{title}</p>
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
            <motion.div
              key={item.id}
              style={{ minWidth: '100%', display: 'flex' }}
              initial={{ opacity: 0, y: 20 }} // Початковий стан
              animate={{ opacity: 1, y: 0 }} // Анімація появи
              exit={{ opacity: 0, y: -20 }} // Анімація зникнення
              transition={{
                duration: 0.3,
                delay: index * 0.1, // Затримка для кожного елемента
              }}
            >
              <MiniGoods lang={lang} dictionary={dictionary} goods={item} />
            </motion.div>
          ))}
        </div>

        <div
          className={`scroll-button right ${
            (currentPage + 1) * limit < data.length
              ? 'arrow-active'
              : 'disabled'
          }`}
          onClick={handleNext}
        >
          <RightSvg />
        </div>
      </div>
    </div>
  );
};

export default UserWatched;
