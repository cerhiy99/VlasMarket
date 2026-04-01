'use client';
import React, { use } from 'react';
import './Like.scss';
import { useSelector } from 'react-redux';
import { Locale } from '@/i18n.config';
import { RootState } from '@/app/store';
import MiniGoods from '@/app/components/Home/MiniGoods';

type Props = {
  params: Promise<{ lang: Locale }>;
};

const page = ({ params }: Props) => {
  const { lang } = use(params);
  const { like } = useSelector((state: RootState) => state.BasketAndLike);
  return (
    <div className="like-page-container">
      <h1>{lang == 'ru' ? 'Список желаний' : 'Список бажань'}</h1>
      {
        //like.map(x=><MiniGoods key={x.volume.id} goods={x} />)
      }
    </div>
  );
};

export default page;
