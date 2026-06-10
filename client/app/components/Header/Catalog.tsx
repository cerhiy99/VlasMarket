'use client';

import React, { useCallback, useMemo, useState } from 'react';
import './Catalog.scss';
import CatalogSVG from '../../assest/Header/Catalog.svg';
import RightSVG from '../../assest/Header/Right.svg';
import { Locale } from '@/i18n.config';
import Image from 'next/image';
import SvgIcon from './SvgIcon';
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
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [selectCategory, setSelectCategory] = useState<number>(4);

  // ⚡ швидкий lookup замість find у render
  const selectedCategory = useMemo(() => {
    return catalog.find((c) => c.id === selectCategory) || null;
  }, [catalog, selectCategory]);

  // ⚡ сортування один раз
  const sortedSubcategories = useMemo(() => {
    if (!selectedCategory) return [];

    const key = lang === 'ru' ? 'nameru' : 'nameuk';

    return [...selectedCategory.subcategories].sort((a, b) =>
      a[key].localeCompare(b[key])
    );
  }, [selectedCategory, lang]);

  const open = useCallback(() => {
    if (pathname === '/' || pathname === '/ru') return;
    setIsOpen((prev) => !prev);
  }, [pathname]);

  const handleSelect = useCallback((id: number) => {
    setSelectCategory(id);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleCategoryClick = useCallback(
    (x: CategoryInterface) => {
      router.push(
        getLocalizedPath(`/${lang}/goods/${UkrToEng(x.nameru)}/1`, lang)
      );
      setIsOpen(false);
    },
    [lang, router]
  );

  return (
    <>
      {isOpen && <div onClick={handleClose} className="back-dark" />}

      <div className="catalog-container">
        <div onClick={open} className="catalog-title">
          <CatalogSVG /> {dictionary.title}
        </div>

        {isOpen && (
          <div className="dropdown-container">
            <div className="dropdown">
              {/* CATEGORY LIST */}
              <div className="list-category">
                {catalog.map((x) => (
                  <div
                    key={x.id}
                    className={`category ${
                      selectCategory === x.id ? 'active' : ''
                    }`}
                    onMouseEnter={() => handleSelect(x.id)}
                    onClick={() => handleCategoryClick(x)}
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

              {/* SUBCATEGORIES */}
              {selectCategory !== 0 && selectedCategory && (
                <div className="subcategory-details-container">
                  <div className="subcategory-details">
                    {sortedSubcategories.map((item) => (
                      <div
                        key={item.id}
                        className="list-category-title"
                        onClick={() => {
                          router.push(
                            getLocalizedPath(
                              `/${lang}/goods/${UkrToEng(
                                selectedCategory.nameru
                              )}/${UkrToEng(item.nameru)}/1`,
                              lang
                            )
                          );
                          setIsOpen(false);
                        }}
                      >
                        <div className="title-list-category-title">
                          {item.img && (
                            <Image
                              src={process.env.NEXT_PUBLIC_SERVER + item.img}
                              alt={lang === 'ru' ? item.nameru : item.nameuk}
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
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Catalog;
