'use client';
import React, { useRef, useState } from 'react';
import './Catalog.scss';
import CatalogSVG from '../../assest/Header/Catalog.svg';
import RightSVG from '../../assest/Header/Right.svg';
import { Locale } from '@/i18n.config';
import Image from 'next/image';
import SvgIcon from './SvgIcon';
import { useRouter } from 'next/navigation';
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
  const [isHovered, setIsHovered] = useState<boolean>(false); // Змінна для збереження стану

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setSelectCategory(0);
    setIsHovered(false);
  };

  const [selectCategory, setSelectCategory] = useState<number>(4);
  const router = useRouter();

  return (
    <>
      {' '}
      {isHovered && <div className="calalog-beck" />}
      <div className="catalog-container" onMouseLeave={handleMouseLeave}>
        <div onMouseEnter={handleMouseEnter} className="catalog-title">
          <CatalogSVG /> {dictionary.title}
        </div>

        {isHovered && (
          <div className="dropdown-container">
            <div className="dropdown">
              <div className="list-category">
                {catalog.map((x: any) => (
                  <div
                    key={x.id} // Додаємо унікальний key для списку
                    className={`category ${selectCategory === x.id ? 'active' : ''}`}
                    onMouseEnter={() => setSelectCategory(x.id)}
                    onClick={() => {
                      router.push(
                        getLocalizedPath(
                          `/${lang}/goods/${UkrToEng(x.nameru)}/1`,
                          lang
                        )
                      );
                      setIsHovered(false);
                    }} // Оновлюємо стан підкатегорії при кліку
                  >
                    <div className="svg-with-name">
                      <SvgIcon url={process.env.NEXT_PUBLIC_SERVER + x.svg} />

                      <p>{lang == 'ru' ? x.nameru : x.nameuk}</p>
                    </div>
                    <div className="right">
                      <RightSVG />
                    </div>
                  </div>
                ))}
              </div>
              {selectCategory !== 0 && (
                <div className="subcategory-details-container">
                  <div className="subcategory-details">
                    {catalog
                      .find((category: any) => category.id == selectCategory)
                      ?.subcategories.sort((a: any, b: any) =>
                        a[`name${lang == 'ru' ? 'ru' : 'uk'}`].localeCompare(
                          b[`name${lang == 'ru' ? 'ru' : 'uk'}`]
                        )
                      )
                      .map((categoryTitle: any) => (
                        <div
                          onClick={() => {
                            router.push(
                              getLocalizedPath(
                                `/${lang}/goods/${UkrToEng(catalog.find((x) => x.id == selectCategory)?.nameru || '')}/${UkrToEng(categoryTitle.nameru)}/1`,
                                lang
                              )
                            );
                            setIsHovered(false);
                          }}
                          className="list-category-title"
                          key={`title-${categoryTitle.id}`} // Додаємо унікальний ключ для заголовка підкатегорії
                        >
                          <div className="title-list-category-title">
                            {categoryTitle && categoryTitle?.img && (
                              <Image
                                src={
                                  process.env.NEXT_PUBLIC_SERVER +
                                  categoryTitle.img
                                }
                                alt={
                                  lang == 'ru'
                                    ? categoryTitle.nameru
                                    : categoryTitle.nameuk
                                }
                                width={30}
                                height={30}
                                style={{ objectFit: 'contain' }}
                              />
                            )}
                            <span>
                              {lang == 'ru'
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
        )}
      </div>
    </>
  );
};

export default Catalog;
