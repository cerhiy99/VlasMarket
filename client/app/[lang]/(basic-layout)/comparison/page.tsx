'use client';
import React, { use, useEffect, useState } from 'react';
import './Comparison.scss';
import BreadCrumbs from '@/app/components/utils/BreadCrumbs';
import { Locale } from '@/i18n.config';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { $host } from '@/app/http';
import MiniGoods from '@/app/components/Home/MiniGoods';
import { GoodInterface } from '@/app/interfaces/goods';
import ShowInfo from './ShowInfo';

type Props = {
  params: Promise<{ lang: Locale }>;
};

const Page = ({ params }: Props) => {
  const { lang } = use(params);
  const { comparison } = useSelector((state: RootState) => state.BasketAndLike);
  const [fullGoods, setFullGoods] = useState<GoodInterface[]>([]);
  const getFullGoods = async () => {
    try {
      const res = await $host.get(
        'goods/getMiniGoods?goodsIdes=' +
          JSON.stringify(comparison.map((x) => x.id))
      );
      setFullGoods(res.data.goods);
    } catch (err) {
      console.error('Помилка ', err);
    }
  };

  useEffect(() => {
    if (comparison.length > 0) getFullGoods();
    else setFullGoods([]);
  }, [comparison]);
  const name = lang == 'ru' ? 'Сравнение товаров' : 'Порівняння товарів';

  return (
    <div className="comparison-container">
      {
        <BreadCrumbs
          lang={lang}
          listUrles={[
            {
              name,
              url: 'comparison',
            },
          ]}
        />
      }
      <h1>{lang == 'ru' ? 'Сравнение товаров' : 'Порівняння товарів'}</h1>
      <div className="list-goods-comparison">
        {fullGoods.map((x) => (
          <div key={x.id} className="col">
            <MiniGoods goods={x} lang={lang} />
            <ShowInfo good={x} lang={lang} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
