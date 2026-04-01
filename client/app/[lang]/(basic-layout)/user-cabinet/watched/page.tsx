'use client';
import React, { use, useEffect, useState } from 'react';
import './Watched.scss';
import { Locale } from '@/i18n.config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import ListGoods from '@/app/components/goods/ListGoods';
import PaginationDynamic from '@/app/components/utils/PaginationDynamic';
import { initializedFromUserWatched } from '@/app/store/reducers/userWatched';

type Props = {
  params: Promise<{ lang: Locale }>;
};

const limit = 16;

const page = ({ params }: Props) => {
  const { lang } = use(params);
  const { watched }: any = useSelector((state: RootState) => state.watched);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [countPages, setCountPages] = useState(0);
  const dispatch = useDispatch();
  useEffect(() => {
    if (watched.length == 0) {
      dispatch(initializedFromUserWatched());
    }
  }, []);
  useEffect(() => {
    setCountPages(Math.ceil(watched.length / limit));
  }, [watched]);

  useEffect(() => {}, [currentPage]);
  console.log(434, watched);
  if (watched.length == 0) {
    return <>loading...</>;
  }

  return (
    <div className="watched-container">
      <h1>{lang == 'ru' ? 'Просмотренные товары' : 'Переглянуті товари'}</h1>
      <ListGoods
        data={watched.slice((currentPage - 1) * limit, currentPage * limit)}
        isFilter={true}
        lang={lang}
      />
      <div className="pagination">
        {countPages > 1 && (
          <PaginationDynamic
            currentPage={currentPage}
            totalPages={countPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default page;
