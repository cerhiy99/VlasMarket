'use client';

import React, { useMemo, useState, useCallback } from 'react';
import './CatalogHome.scss';
import RightSVG from '../../assest/Header/Right.svg';
import { Locale } from '@/i18n.config';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { UkrToEng } from '../utils/UkrToEng';
import SvgIcon from '../Header/SvgIcon';

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
  const router = useRouter();

  const [isHovered, setIsHovered] = useState(false);
  const [selectCategory, setSelectCategory] = useState<number>(4);

  // ✅ швидкий lookup замість find в render
  const selectedCategory = useMemo(() => {
    return catalog.find((c) => c.id === selectCategory) || null;
  }, [catalog, selectCategory]);

  // ✅ сортування один раз при зміні category/lang
  const sortedSubcategories = useMemo(() => {
    if (!selectedCategory) return [];

    const key = lang === 'ru' ? 'nameru' : 'nameuk';

    return [...selectedCategory.subcategories].sort((a, b) =>
      a[key].localeCompare(b[key])
    );
  }, [selectedCategory, lang]);

  const handleMouseLeave = useCallback(() => {
    setSelectCategory(0);
    setIsHovered(false);
  }, []);

  const handleHover = useCallback((id: number) => {
    setSelectCategory(id);
    setIsHovered(true);
  }, []);

  return (
    <>
      {isHovered && <div className="calalog-home-beck" />}

      <div className="catalog-home-container" onMouseLeave={handleMouseLeave}>
        <div className="dropdown-home-container">
          <div style={{ width: '374px' }} className="dropdown">
            <div className="list-category">
              {catalog.map((x) => (
                <div
                  key={x.id}
                  className={`category ${selectCategory === x.id ? 'active' : ''}`}
                  onMouseEnter={() => handleHover(x.id)}
                  onClick={() => {
                    router.push(
                      getLocalizedPath(
                        `/${lang}/goods/${UkrToEng(x.nameru)}/1`,
                        lang
                      )
                    );
                    setIsHovered(false);
                  }}
                >
                  <div className="svg-with-name">
                    <SvgIcon url={process.env.NEXT_PUBLIC_SERVER + x.svg} />
                    <p>{lang === 'ru' ? x.nameru : x.nameuk}</p>
                  </div>

                  <div className="right">
                    <RightSVG />
                  </div>
                </div>
              ))}
            </div>

            {selectCategory !== 0 && selectedCategory && (
              <div className="subcategory-details-container">
                <div className="subcategory-details">
                  {sortedSubcategories.map((categoryTitle) => (
                    <div
                      key={categoryTitle.id}
                      className="list-category-title"
                      onClick={() => {
                        router.push(
                          getLocalizedPath(
                            `/${lang}/goods/${UkrToEng(selectedCategory.nameru)}/${UkrToEng(categoryTitle.nameru)}/1`,
                            lang
                          )
                        );
                        setIsHovered(false);
                      }}
                    >
                      <div className="title-list-category-title">
                        {categoryTitle.img && (
                          <Image
                            src={
                              process.env.NEXT_PUBLIC_SERVER + categoryTitle.img
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
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CatalogHome;
