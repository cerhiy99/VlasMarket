'use client';

import '../Cabinet.scss';
import PersonalData from '@/public/svgs/posters/personal.svg';
import Discounts from '@/public/svgs/posters/discount.svg';
import Shopping from '@/public/svgs/posters/shopping.svg';
import Favorities from '@/public/svgs/posters/favorities.svg';
import Link from 'next/link';
import { Locale } from '@/i18n.config';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';
import { useTranslation } from '@/context/TranslationProvider';

const TabNavigation = ({ lang }: { lang: Locale }) => {
  const [isNavigation, setNavigation] = useState<boolean>(false);
  const pathName = usePathname();
  const { t } = useTranslation();
  useEffect(() => {
    const resizeWindow = () => {
      const width = window.innerWidth;
      return setNavigation(width < 1024);
    };
    resizeWindow();
    window.addEventListener('resize', resizeWindow);
    return () => window.removeEventListener('resize', resizeWindow);
  }, []);

  if (
    isNavigation ||
    pathName === '/ua/user-cabinet' ||
    pathName === '/ru/user-cabinet'
  )
    return (
      <>
        <div className="tabs__container">
          <div className="tab__item">
            <Link
              href={getLocalizedPath(
                `/${lang}/user-cabinet/personal-info`,
                lang,
              )}
            ></Link>
            <div className="tab__svg">
              <PersonalData />
            </div>
            <div className="tab-content">
              <div className="tab__title">{t('cabinet.personalDataTitle')}</div>
              <div className="tab__text">{t('cabinet.personalDataText')}</div>
            </div>
          </div>
          <div className="tab__item">
            <Link
              href={getLocalizedPath(`/${lang}/user-cabinet/orders`, lang)}
            ></Link>

            <div className="tab__svg">
              <Shopping />
            </div>
            <div className="tab-content">
              <div className="tab__title">{t('cabinet.ordersTitle')}</div>
              <div className="tab__text">{t('cabinet.ordersText')}</div>
            </div>
          </div>
          <div className="tab__item">
            <Link
              href={getLocalizedPath(`/${lang}/user-cabinet/discount`, lang)}
            ></Link>
            <div className="tab__svg">
              <Discounts />
            </div>
            <div className="tab-content">
              <div className="tab__title">{t('cabinet.discountTitle')}</div>
              <div className="tab__text">{t('cabinet.discountText')}</div>
            </div>
          </div>
          <div className="tab__item">
            <Link
              href={getLocalizedPath(
                `/${lang}/user-cabinet/selected-products`,
                lang,
              )}
            ></Link>
            <div className="tab__svg">
              <Favorities />
            </div>
            <div className="tab-content">
              <div className="tab__title">{t('cabinet.favoritesTitle')}</div>
              <div className="tab__text">{t('cabinet.favoritesText')}</div>
            </div>
          </div>
        </div>
      </>
    );
};

export default TabNavigation;
