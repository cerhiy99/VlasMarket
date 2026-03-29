import { Locale } from '@/i18n.config';
import React from 'react';
import Logo from '../../assest/Logo.svg';
import Link from 'next/link';
import { getDictionary } from '@/lib/dictionary';
import DroprownUrles from './DroprownUrles';
import './Header.scss';
import ContactWithUs from './ContactWithUs';
import SetLanguage from './SetLanguage';
import CatalogSearchAndOther from './CatalogSearchAndOther';
import AdminLogo from './AdminLogo';
import { getLocalizedPath } from '../utils/getLocalizedPath';

type Props = {
  lang: Locale;
};

const getData = async (lang: Locale) => {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_SERVER +
        'category/getCategoryAndSubcategoryWithProduct?lang=' +
        lang,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 * 60 * 12 }, // якщо використовуєш Next.js 13+ (app router) з кешуванням
      }
    );

    if (!res.ok) {
      throw new Error('Помилка при завантаженні категорій');
    }

    const data = await res.json();
    return data.category;
  } catch (err) {
    console.error('Помилка запиту getFull:', err);
    return null;
  }
};

const Header = async ({ lang }: Props) => {
  const { header } = await getDictionary(lang);
  const catalog = await getData(lang);
  return (
    <>
      <header>
        <div className="header-container">
          <AdminLogo />
          <div className="list-url-and-logo-container">
            <div className="list-url-and-logo">
              <div className="list-url">
                <DroprownUrles lang={lang} dictionary={header.aboutShop} />
                <Link
                  className="button-url"
                  href={getLocalizedPath(`/${lang}/brands`, lang)}
                >
                  {header.brands}
                </Link>
                <Link
                  className="button-url"
                  href={getLocalizedPath(`/${lang}/cooperation`, lang)}
                >
                  {header.cooperation}
                </Link>
                <div
                  style={{ backgroundColor: '#F80000' }}
                  className="discount button-url"
                >
                  <Link href={getLocalizedPath(`/${lang}/discount/1`, lang)}>
                    {header.discount}
                  </Link>
                </div>
              </div>
              <div className="logo-container">
                <Link href={`${lang != 'ru' ? '/' : '/ru'}`}>
                  <Logo />
                </Link>
              </div>
              <div className="list-url-and-language-and-contact">
                <Link
                  className="button-url"
                  href={getLocalizedPath(`/${lang}/partners`, lang)}
                >
                  {header.partners}
                </Link>
                <ContactWithUs lang={lang} dictionary={header.contact} />
                <SetLanguage lang={lang} />
              </div>
            </div>
          </div>
          {
            //<Update />
          }
        </div>
      </header>

      <CatalogSearchAndOther
        catalog={catalog}
        dictionary={header}
        lang={lang}
      />
    </>
  );
};

export default Header;
