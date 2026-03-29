'use client';
import React, { useEffect, useState } from 'react';
import './ListArticle.scss';
import MiniGoods from './MiniGoods';
import DownSVG from '../../assest/Home/Down.svg';
import { Locale } from '@/i18n.config';
import { $host } from '@/app/http';

type Props = {
  type: string;
  dictionary: any;
  lang: Locale;
  query: string;
  startGoods?: any[];
};

const ListArticle = ({ type, dictionary, lang, query, startGoods }: Props) => {
  const [limit, setLimit] = useState(5);
  const [countShow, setCountShow] = useState(1);
  const [listGoods, setListGoods] = useState<any[]>(
    startGoods ? startGoods : []
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.outerWidth;
      if (width >= 1400) {
        setLimit(5);
      } else if (width >= 1124) {
        setLimit(4);
        setListGoods(listGoods.slice(0, 4));
      } else if (width >= 800) {
        setLimit(3);
        setListGoods(listGoods.slice(0, 3));
      } else if (width >= 350) {
        setLimit(2);
        setListGoods(listGoods.slice(0, 2));
      } else {
        setLimit(1);
        setListGoods(listGoods.slice(0, 1));
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

  const getListGoods = async () => {
    try {
      const res = await $host.get(
        `goods/get?${query}=true&limit=${limit}&page=${countShow}`
      );
      setListGoods([...listGoods, ...res.data.goods]);
    } catch (err) {}
  };

  useEffect(() => {
    if (startGoods && countShow == 1) return;
    else getListGoods();
  }, [limit, countShow]);

  const addCountShow = () => {
    setCountShow(countShow + 1);
  };

  return (
    <div className={`list-article-container limit-${limit}`}>
      {listGoods.map((x) => (
        <MiniGoods lang={lang} dictionary={dictionary} goods={x} key={x.id} />
      ))}
      <div className="button-down">
        <div onClick={addCountShow} className="downsvg-container">
          <DownSVG />
        </div>
      </div>
    </div>
  );
};

export default ListArticle;
