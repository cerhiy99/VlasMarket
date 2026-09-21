'use client';

import React, { useState } from 'react';
import './CatalogHome.scss';
import RightSVG from '../../assest/Header/Right.svg';
import { Locale } from '@/i18n.config';
import Image from 'next/image';
import Link from 'next/link';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { UkrToEng } from '../utils/UkrToEng';
import SvgIcon from '../Header/SvgIcon';
import { useRouter } from 'next/navigation';

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

const CatalogHome = ({ lang, dictionary, catalog }: Props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectCategory, setSelectCategory] = useState<number>(
    catalog?.[0]?.id || 4
  );

  const handleMouseLeave = () => {
    setIsHovered(false);
    setSelectCategory(0);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const router = useRouter();

  return (
    <>
      {isHovered && <div className="calalog-home-beck" />}

      <div
        className="catalog-home-container"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="dropdown-home-container">
          <div style={{ width: '374px' }} className="dropdown">
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
                    onMouseEnter={() => setSelectCategory(x.id)}
                    onClick={() => setIsHovered(false)}
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

            {/* Рендеримо підкатегорії для ВСІХ категорій в DOM одразу для SEO */}
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
                      {sortedSubcategories.map((categoryTitle) => {
                        const subcategoryPath = getLocalizedPath(
                          `/${lang}/goods/${UkrToEng(category.nameru)}/${UkrToEng(categoryTitle.nameru)}/1`,
                          lang
                        );

                        return (
                          <div
                            key={categoryTitle.id}
                            onClick={() => {
                              router.push(subcategoryPath);
                              setIsHovered(false);
                            }}
                            className="list-category-title"
                          >
                            <div className="title-list-category-title">
                              {categoryTitle.img && (
                                <Image
                                  src={
                                    process.env.NEXT_PUBLIC_SERVER +
                                    categoryTitle.img
                                  }
                                  alt={
                                    lang === 'ru'
                                      ? categoryTitle.nameru
                                      : categoryTitle.nameuk
                                  }
                                  width={25}
                                  height={25}
                                  style={{ objectFit: 'contain' }}
                                />
                              )}
                              <span>
                                {lang === 'ru'
                                  ? categoryTitle.nameru
                                  : categoryTitle.nameuk}
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

export default CatalogHome;
