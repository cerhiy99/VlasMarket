'use client';
import React, { useEffect, useState } from 'react';
import './ListArticle.scss';
import MiniGoods from './MiniGoods';
import DownSVG from '../../assest/Home/Down.svg';
import { Locale } from '@/i18n.config';
import { $host } from '@/app/http';

type Props = {
  dictionary: any;
  lang: Locale;
  query: string;
  type?: string;
  startGoods?: any[];
};

const ListArticle = ({ dictionary, lang, query }: Props) => {
  const [columns, setColumns] = useState<number | null>(null);
  const [rows, setRows] = useState(1);
  const [listGoods, setListGoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 визначаємо кількість колонок
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;

      if (width >= 1400) setColumns(5);
      else if (width >= 1124) setColumns(4);
      else if (width >= 800) setColumns(3);
      else if (width >= 350) setColumns(2);
      else setColumns(1);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);

    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // 🔥 запит даних (по рядках)
  const getListGoods = async (rowsCount: number, cols: number) => {
    try {
      setLoading(true);

      const limit = rowsCount * cols;

      const res = await $host.get(
        `goods/get?${query}=true&limit=${limit}&page=1`
      );

      setListGoods(res.data.goods);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 перший запуск + resize
  useEffect(() => {
    if (!columns) return;

    setRows(1); // завжди починаємо з 1 рядка
    getListGoods(1, columns);
  }, [columns]);

  // 🔥 кнопка "далі"
  const loadMore = () => {
    if (!columns || loading) return;

    const nextRows = rows + 1;
    setRows(nextRows);
    getListGoods(nextRows, columns);
  };

  if (!columns) return null; // щоб не було "мигання"

  return (
    <div
      className="list-article-container"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {listGoods.map((x) => (
        <MiniGoods key={x.id} lang={lang} dictionary={dictionary} goods={x} />
      ))}

      <div className="button-down">
        <div onClick={loadMore} className="downsvg-container">
          {loading ? '...' : <DownSVG />}
        </div>
      </div>
    </div>
  );
};

export default ListArticle;
