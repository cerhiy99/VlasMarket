'use client';

import React, { useEffect, useState } from 'react';
import Catalog from './Catalog';
import Search from './Search';
import AuthHeader from './AuthHeader';
import HeaderLike from './HeaderLike';
import HeaderBasket from './HeaderBasket';
import Burger from './Burger/Burger';
import { Locale } from '@/i18n.config';
import MobileMenu from './mobile/MobileMenu';
import Logo from '../../assest/LogoMob.svg';
import ComparisonSVG from '../../assest/comparison.svg';
import Link from 'next/link';

type Props = {
  dictionary: any;
  lang: Locale;
  catalog: any;
};

const heightHeader = 60;

const CatalogSearchAndOther = ({ dictionary, lang, catalog }: Props) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY >= heightHeader);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="catalog-search-and-other-container-static">
      <div
        className={`catalog-search-and-other-container ${scrolled ? 'fixed' : ''}`}
      >
        <div className="catalog-search-and-other">
          <div className="catalog">
            <Catalog
              catalog={catalog}
              lang={lang}
              dictionary={dictionary.catalog}
            />
          </div>

          <div className={`mob16`}>
            <div className={`head53  ${scrolled ? 'fixed' : ''}`}>
              <button className="burger" onClick={toggleMobileMenu}>
                <Burger />
              </button>
              <div className="mob-logo-container">
                <Link href={`${lang != 'ru' ? '/' : '/ru'}`}>
                  <Logo />
                </Link>
              </div>

              <div className="bask23">
                <HeaderBasket lang={lang} />
              </div>
              <div className="sea42">
                <Search dictionary={dictionary.search} lang={lang} />
              </div>
            </div>
          </div>
          <div className="search-with-list-icon">
            <Search dictionary={dictionary.search} lang={lang} />
            <div className="list-icon-header">
              <div className="comparison">
                <ComparisonSVG />
              </div>
              <AuthHeader dictionary={dictionary.Auth} lang={lang} />
              <HeaderLike lang={lang} />
              <HeaderBasket lang={lang} />
            </div>
          </div>
        </div>
      </div>
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        dictionary={dictionary}
        lang={lang}
      />
    </div>
  );
};

export default CatalogSearchAndOther;
