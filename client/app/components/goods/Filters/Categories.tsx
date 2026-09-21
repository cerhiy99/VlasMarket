'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Імпортуємо useRouter та useSearchParams
import './Brends.scss'; // Залишаємо Brends.scss, якщо він містить загальні стилі
import UpSVG from '../../../assest/Filters/Up.svg';
import DownSVG from '../../../assest/Filters/Down.svg';
import { Locale } from '@/i18n.config'; // Імпортуємо Locale для lang
import { sortSearchParams } from './SortSerchParams';
import { getLocalizedPath } from '../../utils/getLocalizedPath';
import { UkrToEng } from '../../utils/UkrToEng';
import Link from 'next/link';

// Оновлена типізація Category, щоб відображати nameuk та nameru
type Category = {
  id: number;
  nameuk: string;
  nameru: string;
  brand?: string;
  url: string;
};

type CategoriesProps = {
  listCategories: Category[];
  currentSearchParams: URLSearchParams;
  lang: Locale; // 'ua' | 'ru'
  brand?: string;
  currentPathname?: string;
  nameOpen: string;
  open: string;
  setOpen: any;
  isMob: boolean;
};

const Categories: React.FC<CategoriesProps> = ({
  listCategories,
  lang,
  currentSearchParams,
  brand,
  currentPathname,
  nameOpen,
  open,
  setOpen,
  isMob,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Отримуємо поточні параметри URL

  // Сортування категорій за українською назвою
  const sortedCategories = [...listCategories].sort((a, b) => {
    const nameA = a.nameuk.toLowerCase();
    const nameB = b.nameuk.toLowerCase();
    if (/^\d/.test(nameA) && !/^\d/.test(nameB)) return 1;
    if (!/^\d/.test(nameA) && /^\d/.test(nameB)) return -1;
    return nameA.localeCompare(nameB, 'uk'); // Сортування для української мови
  });

  // Стан для відстеження вибраних категорій (оскільки category - це один ID, це буде сингл-вибір)
  const [selectedCategories, setSelectedCategories] = useState<
    Record<number, boolean>
  >({});
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(isMob); // Ініціалізуємо false, оновлюємо в useEffect
  const scrollContainerRef = useRef<HTMLUListElement | null>(null);

  // Ініціалізація та оновлення selectedCategories з URL-параметрів
  useEffect(() => {
    const currentCategoryIdInUrl = searchParams.get('category');
    const newSelectedState: Record<number, boolean> = {};

    // Ініціалізуємо всі категорії як не вибрані
    listCategories.forEach((cat) => {
      newSelectedState[cat.id] = false;
    });

    // Встановлюємо вибрану категорію з URL, якщо вона є і валідна
    if (currentCategoryIdInUrl) {
      const id = parseInt(currentCategoryIdInUrl);
      if (!isNaN(id) && listCategories.some((cat) => cat.id === id)) {
        newSelectedState[id] = true;
      }
    }
    setSelectedCategories(newSelectedState);
  }, [searchParams, listCategories]); // Залежимо від searchParams та listCategories

  // Дублююча функція, яка генерує та повертає URL для SEO та посилань
  const getHandleCheckboxChange = (categoryId: number, categoryUrl: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const currentSelectedCategoryInUrl = searchParams.get('category');
    const isThisCategoryCurrentlySelected =
      currentSelectedCategoryInUrl === categoryId.toString() ||
      currentPathname?.includes(categoryUrl);

    if (isThisCategoryCurrentlySelected) {
      // Якщо поточна вибрана категорія клікнута знову, знімаємо вибір
      newSearchParams.delete('category');
      newSearchParams.delete('subcategory'); // Очищаємо підкатегорію, якщо основна категорія знімається
    } else {
      if (brand) newSearchParams.set('category', categoryId.toString());
      newSearchParams.delete('subcategory'); // Очищаємо підкатегорію при виборі нової основної категорії
    }

    // Формуємо новий URL та повертаємо його
    if (brand) {
      return getLocalizedPath(
        `/${lang}/brands/${brand}/1?${sortSearchParams(newSearchParams).toString()}`,
        lang
      );
    } else {
      if (isThisCategoryCurrentlySelected) {
        return getLocalizedPath(
          `/${lang}/goods/1?${sortSearchParams(newSearchParams).toString()}`,
          lang
        );
      } else {
        return getLocalizedPath(
          `/${lang}/goods/${categoryUrl}/1?${sortSearchParams(newSearchParams).toString()}`,
          lang
        );
      }
    }
  };

  // Обробник зміни чекбоксу (для кліку з router.push та збереженням скролу)
  const handleCheckboxChange = (
    categoryId: number,
    categoryUrl: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    const targetUrl = getHandleCheckboxChange(categoryId, categoryUrl);
    router.push(targetUrl, { scroll: false });
  };

  const toggleDropdown = () => {
    setOpen(nameOpen);
  };

  const isOpenVisible = (isDropdownOpen && !isMobile) || nameOpen == open;

  return (
    <div className="brands-container categories-container">
      <div
        style={{ minWidth: '90px' }}
        className="brands-header categories-header"
        onClick={toggleDropdown}
      >
        <span>{lang == 'ru' ? 'КАТЕГОРИЯ' : 'КАТЕГОРІЯ'}</span>
        <span className={`arrow-icon ${isDropdownOpen ? 'open' : ''}`}>
          {isDropdownOpen ? <UpSVG /> : <DownSVG />}
        </span>
      </div>

      {/* Завжди присутній у DOM для повної SEO індексації, ховається/показується через CSS display */}
      <div
        style={{ left: '5px', display: isOpenVisible ? 'block' : 'none' }}
        className={isMobile ? 'dropdownFilterMobile dropdown' : ''}
      >
        {/* Алфавітний фільтр видалено */}
        <ul className="brands-list filter-scroll" ref={scrollContainerRef}>
          {sortedCategories.map((category) => {
            const categoryEngUrl = UkrToEng(category.nameru);
            const generatedHref = getHandleCheckboxChange(
              category.id,
              categoryEngUrl
            );

            return (
              <li key={category.id} className="brand-item">
                <Link
                  href={generatedHref}
                  onClick={(e) =>
                    handleCheckboxChange(category.id, categoryEngUrl, e)
                  }
                  style={{ textDecoration: 'none', width: '100%' }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={
                        selectedCategories[category.id] ||
                        currentPathname?.includes(categoryEngUrl) ||
                        false
                      }
                      readOnly
                      style={{ display: 'none' }}
                    />
                    <span className="custom-checkbox"></span>
                    {/* Відображаємо назву відповідно до поточної мови */}
                    <span className="brand-name">
                      {lang !== 'ru' ? category.nameuk : category.nameru}
                    </span>
                  </label>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Categories;
