'use client';
import React, { useEffect, useState } from 'react';
import './BreadCrumbsCabinetDynamic.scss';
import { Locale } from '@/i18n.config';
import MainSVG from '../../assest/BreadCrumbs/Main.svg';
import NextSVG from '../../assest/BreadCrumbs/Next.svg';
import Link from 'next/link';
import { getLocalizedPath } from './getLocalizedPath';
import { usePathname } from 'next/navigation';

type Props = {
  lang: Locale;
};

const BreadCrumbsCabinetDynamic = ({ lang }: Props) => {
  const [listUrles, setListUrls] = useState([
    { name: lang == 'ru' ? 'Кабинет' : 'Кабінет', url: 'user-cabinet/history' },
  ]);
  const pathname = usePathname();

  useEffect(() => {
    const startUrl = {
      name: lang == 'ru' ? 'Кабинет' : 'Кабінет',
      url: 'user-cabinet/history',
    };
    const finishUrl = pathname.split('/').pop();
    switch (finishUrl) {
      case 'profile':
        setListUrls([
          startUrl,
          { url: '', name: lang == 'ru' ? 'Профиль' : 'Профіль' },
        ]);
        break;
      case 'history':
        setListUrls([
          startUrl,
          {
            url: '',
            name: lang == 'ru' ? 'История заказов' : 'Історія замовлень',
          },
        ]);
        break;
      case 'like':
        setListUrls([
          startUrl,
          { url: '', name: lang == 'ru' ? 'Список желаний' : 'Список бажань' },
        ]);
        break;
      case 'bonus':
        setListUrls([
          startUrl,
          { url: '', name: lang == 'ru' ? 'Мои бонусы' : 'Мої бонуси' },
        ]);
        break;
      case 'send-emails':
        setListUrls([
          startUrl,
          {
            url: '',
            name: lang == 'ru' ? 'Рассылка на почту' : 'Розсилка на пошту',
          },
        ]);
        break;
      case 'coments':
        setListUrls([
          startUrl,
          {
            url: '',
            name:
              lang == 'ru' ? 'Отзывы и комментарии' : 'Відгуки та коментарі',
          },
        ]);
        break;
      case 'promokods':
        setListUrls([
          startUrl,
          { url: '', name: lang == 'ru' ? 'Промокоды' : 'Промокоди' },
        ]);
        break;
      case 'watched':
        setListUrls([
          startUrl,
          {
            url: '',
            name: lang == 'ru' ? 'Просмотренные товары' : 'Переглянуті товари',
          },
        ]);
        break;
      default:
        {
          setListUrls([startUrl]);
        }
        break;
    }
  }, [pathname]);
  return (
    <div className="bread-crumbs-cabinet-container">
      <div className="bread-crumb">
        <Link href={getLocalizedPath(`/${lang}`, lang)}>
          <div className="home-svg">
            <MainSVG />
          </div>{' '}
          {lang == 'ru' ? 'Главная' : 'Головна'}
        </Link>
        {listUrles.slice(0, listUrles.length - 1).map((x) => (
          <Link key={x.url} href={`${x.url}`}>
            <NextSVG />{' '}
            {x.name && x.name[0] && x.name[0].toUpperCase() + x.name.slice(1)}
          </Link>
        ))}
        {listUrles.slice(listUrles.length - 1, listUrles.length).map((x) => (
          <div key={x.url}>
            <NextSVG />{' '}
            {x.name && x.name[0] && x.name[0].toUpperCase() + x.name.slice(1)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BreadCrumbsCabinetDynamic;
