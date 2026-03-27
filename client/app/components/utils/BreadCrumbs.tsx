import React from 'react';
import './BreadCrumbs.scss';
import { Locale } from '@/i18n.config';
import MainSVG from '../../assest/BreadCrumbs/Main.svg';
import NextSVG from '../../assest/BreadCrumbs/Next.svg';
import Link from 'next/link';
import { getLocalizedPath } from './getLocalizedPath';

type Props = {
  listUrles: { url: string; name: string }[];
  lang: Locale;
};

const BreadCrumbs = async ({ listUrles, lang }: Props) => {
  return (
    <div className="bread-crumbs-container">
      <div className="bread-crumb">
        <Link href={getLocalizedPath(`/${lang}`, lang)}>
          <MainSVG /> {lang == 'ru' ? 'Главная' : 'Головна'}
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

export default BreadCrumbs;
