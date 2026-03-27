'use client';
import React, { use, useState } from 'react';
import './Goods.scss';
import { Locale } from '@/i18n.config';
import AdminHeader from '@/app/components/Admin/AdminHeader/AdminHeader';
import SearchSVG from '@/app/assest/Admin/Search.svg';
import SortableTable from './SortableTable';

const orders = [
  {
    id: 1,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 22,
    week: 3993,
    month: 2939,
    year: 12,
    allTime: 1122,
  },
  {
    id: 2,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 2,
    week: 1388,
    month: 321,
    year: 293,
    allTime: 839,
  },
  {
    id: 3,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 39,
    week: 12,
    month: 11,
    year: 292,
    allTime: 1221,
  },
  {
    id: 4,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 992,
    week: 218,
    month: 345,
    year: 2562,
    allTime: 3453,
  },
  {
    id: 5,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 32,
    week: 657,
    month: 1023,
    year: 84,
    allTime: 345,
  },
  {
    id: 6,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 345,
    week: 5,
    month: 1700,
    year: 1067,
    allTime: 34,
  },
  {
    id: 7,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 38,
    week: 1939,
    month: 399,
    year: 301,
    allTime: 23,
  },
  {
    id: 8,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 333,
    week: 23,
    month: 1123,
    year: 45,
    allTime: 1234,
  },
  {
    id: 9,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 932,
    week: 34,
    month: 432,
    year: 34,
    allTime: 35,
  },
  {
    id: 10,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 930,
    week: 24,
    month: 345,
    year: 1056,
    allTime: 30,
  },
  {
    id: 11,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 1200,
    week: 1054,
    month: 23,
    year: 94,
    allTime: 239,
  },
  {
    id: 12,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 1030,
    week: 1200,
    month: 1040,
    year: 334,
    allTime: 66,
  },
  {
    id: 13,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 234,
    week: 1020,
    month: 56,
    year: 7,
    allTime: 1200,
  },
  {
    id: 14,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 948,
    week: 775,
    month: 3,
    year: 34,
    allTime: 7,
  },
  {
    id: 15,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 585,
    week: 43,
    month: 1030,
    year: 45,
    allTime: 575,
  },
  {
    id: 16,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 22,
    week: 3993,
    month: 2939,
    year: 12,
    allTime: 1122,
  },
  {
    id: 17,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 2,
    week: 1388,
    month: 321,
    year: 293,
    allTime: 839,
  },
  {
    id: 18,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 39,
    week: 12,
    month: 11,
    year: 292,
    allTime: 1221,
  },
  {
    id: 19,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 992,
    week: 218,
    month: 345,
    year: 2562,
    allTime: 3453,
  },
  {
    id: 20,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 32,
    week: 657,
    month: 1023,
    year: 84,
    allTime: 345,
  },
  {
    id: 21,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 345,
    week: 5,
    month: 1700,
    year: 1067,
    allTime: 34,
  },
  {
    id: 22,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 38,
    week: 1939,
    month: 399,
    year: 301,
    allTime: 23,
  },
  {
    id: 23,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 333,
    week: 23,
    month: 1123,
    year: 45,
    allTime: 1234,
  },
  {
    id: 24,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 932,
    week: 34,
    month: 432,
    year: 34,
    allTime: 35,
  },
  {
    id: 25,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 930,
    week: 24,
    month: 345,
    year: 1056,
    allTime: 30,
  },
  {
    id: 26,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 1200,
    week: 1054,
    month: 23,
    year: 94,
    allTime: 239,
  },
  {
    id: 27,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 1030,
    week: 1200,
    month: 1040,
    year: 334,
    allTime: 66,
  },
  {
    id: 28,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 234,
    week: 1020,
    month: 56,
    year: 7,
    allTime: 1200,
  },
  {
    id: 29,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 948,
    week: 775,
    month: 3,
    year: 34,
    allTime: 7,
  },
  {
    id: 30,
    name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натуральним алое 1000 г',
    today: 585,
    week: 43,
    month: 1030,
    year: 45,
    allTime: 575,
  },
];

const Goods = ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = use(params);
  const [startDate, setStartDate] = useState('');
  const [finishDate, setFinishDate] = useState('');
  const [search, setSearch] = useState('');
  return (
    <>
      <AdminHeader url="reviews" name="Статистика товарів" lang={lang} />
      <div className="admin-goods-container">
        <div className="filter-container">
          <div className="filters">
            <div className="select filter">
              Дата начала:
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div className="filter">
              Дата конца:{' '}
              <input
                value={finishDate}
                onChange={(e) => setFinishDate(e.target.value)}
                type="date"
              />
            </div>

            <div className="admin-reviews-search">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="пошук товарів..."
              />
              <div className="search-svg">
                <SearchSVG />
              </div>
            </div>
          </div>
        </div>
        <SortableTable
          startDate={startDate}
          finishDate={finishDate}
          search={search}
          goodsList={orders}
        />
      </div>
    </>
  );
};

export default Goods;
