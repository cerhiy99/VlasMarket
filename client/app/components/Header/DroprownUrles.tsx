'use client';
import React, { useState, useEffect, useRef } from 'react';
import './DroprownUrles.scss';
import { Locale } from '@/i18n.config';
import Link from 'next/link';
import DownSVG from '../../assest/Header/Down.svg';
import { getLocalizedPath } from '../utils/getLocalizedPath';

type Props = {
  dictionary: any;
  lang: Locale;
};

const DroprownUrles = ({ dictionary, lang }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(true);
  };
  const toggleClose = () => {
    setIsOpen(false);
  };

  return (
    <div
      onMouseEnter={toggleOpen}
      onMouseLeave={toggleClose}
      className="header-dropdown-url"
      //ref={dropdownRef}
    >
      <p className={isOpen ? 'open' : ''}>
        {dictionary.title}
        <DownSVG className="arrow" />
      </p>
      <div onClick={toggleClose} className={`dropdown ${isOpen ? 'show' : ''}`}>
        <Link href={getLocalizedPath(`/${lang}/goods/1`, lang)}>
          {dictionary.catalog}
        </Link>
        <Link href={getLocalizedPath(`/${lang}/about-us`, lang)}>
          {dictionary.aboutUs}
        </Link>
        <Link href={getLocalizedPath(`/${lang}/contact`, lang)}>
          {dictionary.contact}
        </Link>
        <Link href={getLocalizedPath(`/${lang}/blog/1`, lang)}>Блог</Link>
        <Link href={getLocalizedPath(`/${lang}/delivery`, lang)}>
          {dictionary.delivery}
        </Link>
        <Link href={getLocalizedPath(`/${lang}/pay`, lang)}>
          {dictionary.pay}
        </Link>
        <Link href={getLocalizedPath(`/${lang}/return-goods`, lang)}>
          {dictionary.returnGoods}
        </Link>
        <Link href={getLocalizedPath(`/${lang}/offer-agreement`, lang)}>
          {dictionary.offerAgreement}
        </Link>
      </div>
    </div>
  );
};

export default DroprownUrles;
