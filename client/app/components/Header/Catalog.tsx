'use client';

import React, { useCallback, useState } from 'react';
import './Catalog.scss';
import CatalogSVG from '../../assest/Header/Catalog.svg';
import RightSVG from '../../assest/Header/Right.svg';
import { Locale } from '@/i18n.config';
import Image from 'next/image';
import SvgIcon from './SvgIcon';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { UkrToEng } from '../utils/UkrToEng';

interface SubcategoryInterface {
  id: number;
  nameuk: string;
  nameru: string;
  img: string | null;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
}

interface CategoryInterface {
  id: number;
  nameuk: string;
  nameru: string;
  svg: string;
  createdAt: string;
  updatedAt: string;
  subcategories: SubcategoryInterface[];
}

type Props = {
  dictionary: any;
  lang: Locale;
  catalog: CategoryInterface[];
};

const Catalog = ({ lang, dictionary, catalog }: Props) => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [selectCategory, setSelectCategory] = useState<number>(
    catalog?.[0]?.id || 4
  );

  const open = useCallback(() => {
    if (pathname === '/' || pathname === '/ru') return;
    setIsOpen((prev) => !prev);
  }, [pathname]);

  const handleSelect = useCallback((id: number) => {
    setSelectCategory(id);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSelectCategory(0);
  }, []);

  const router = useRouter();

  return (
    <>
      {isOpen && <div onClick={handleClose} className="back-dark" />}

      <div className="catalog-container">
        <div onClick={open} className="catalog-title">
          <CatalogSVG /> {dictionary.title}
        </div>

        {/* Завжди в DOM для SEO, показуємо/ховаємо через CSS клас 'visible' */}
        <div className={`dropdown-container ${isOpen ? 'visible' : ''}`}>
          <div className="dropdown">
            {/* CATEGORY LIST */}
            <div className="list-category">
              {catalog.map((x) => {
                const categoryPath = getLocalizedPath(
                  `/${lang}/goods/${UkrToEng(x.nameru)}/1`,
                  lang
                );
                return (
                  <Link
                    key={x.id}
                    href={categoryPath}
                    className={`category ${selectCategory === x.id ? 'active' : ''}`}
                    onMouseEnter={() => handleSelect(x.id)}
                    onClick={handleClose}
                  >
                    <div className="svg-with-name">
                      <SvgIcon url={process.env.NEXT_PUBLIC_SERVER + x.svg} />
                      <p>{lang === 'ru' ? x.nameru : x.nameuk}</p>
                    </div>

                    <div className="right">
                      <RightSVG />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* SUBCATEGORIES - рендеримо для всіх категорій одразу для SEO, перемикаємо через CSS */}
            <div className="subcategory-details-container">
              {catalog.map((category) => {
                const isCurrentCategory = category.id === selectCategory;
                const sortedSubcategories = [...category.subcategories].sort(
                  (a, b) => {
                    const key = lang === 'ru' ? 'nameru' : 'nameuk';
                    return a[key].localeCompare(b[key]);
                  }
                );

                return (
                  <div
                    key={`sub-container-${category.id}`}
                    className={`subcategory-details-wrapper ${isCurrentCategory ? 'active' : ''}`}
                  >
                    <div className="subcategory-details">
                      {sortedSubcategories.map((item) => {
                        const subcategoryPath = getLocalizedPath(
                          `/${lang}/goods/${UkrToEng(category.nameru)}/${UkrToEng(item.nameru)}/1`,
                          lang
                        );

                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              router.push(subcategoryPath);
                              handleClose();
                            }}
                            className="list-category-title"
                          >
                            <div className="title-list-category-title">
                              {item.img && (
                                <Image
                                  src={
                                    process.env.NEXT_PUBLIC_SERVER + item.img
                                  }
                                  alt={
                                    lang === 'ru' ? item.nameru : item.nameuk
                                  }
                                  width={30}
                                  height={30}
                                  style={{ objectFit: 'contain' }}
                                />
                              )}

                              <span>
                                {lang === 'ru' ? item.nameru : item.nameuk}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Catalog;
