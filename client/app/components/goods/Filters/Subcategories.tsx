'use client';
import React, { useState, useEffect, useRef } from 'react';
import './Brends.scss'; // Залишаємо Brends.scss, якщо він містить загальні стилі
import { useRouter, useSearchParams } from 'next/navigation'; // Імпортуємо useRouter та useSearchParams
import UpSVG from '../../../assest/Filters/Up.svg';
import DownSVG from '../../../assest/Filters/Down.svg';
import { Locale } from '@/i18n.config'; // Імпортуємо Locale для lang
import { sortSearchParams } from './SortSerchParams';
import { getLocalizedPath } from '../../utils/getLocalizedPath';
import { UkrToEng } from '../../utils/UkrToEng';
import Link from 'next/link';

// Оновлена типізація Subcategory
type Subcategory = {
  id: number;
  nameuk: string;
  nameru: string;
  categoryId: number; // Важливо для фільтрації
};

type SubcategoriesProps = {
  listSubcategories: Subcategory[]; // Список підкатегорій, що приходять з бекенду
  currentSearchParams: URLSearchParams; // Поточні параметри URL
  lang: Locale; // 'ua' | 'ru'
  brand?: string;
  currentPathname?: string;
  nameOpen: string;
  open: string;
  setOpen: any;
  isMob: boolean;
  noCategory?: false;
};

const Subcategories: React.FC<SubcategoriesProps> = ({
  listSubcategories,
  lang,
  currentSearchParams,
  brand,
  currentPathname,
  nameOpen,
  open,
  setOpen,
  isMob,
  noCategory,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Отримуємо поточні параметри URL

  // Сортування підкатегорій за українською назвою
  const sortedSubcategories = [...listSubcategories].sort((a, b) => {
    const nameA = a.nameuk.toLowerCase();
    const nameB = b.nameuk.toLowerCase();
    if (/^\d/.test(nameA) && !/^\d/.test(nameB)) return 1;
    if (!/^\d/.test(nameA) && /^\d/.test(nameB)) return -1;
    return nameA.localeCompare(nameB, 'uk'); // Сортування для української мови
  });

  // Стан для відстеження вибраних підкатегорій (може бути кілька)
  const [selectedSubcategories, setSelectedSubcategories] = useState<
    Record<number, boolean>
  >({});
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(isMob);
  const scrollContainerRef = useRef<HTMLUListElement | null>(null);

  // Ініціалізація та оновлення selectedSubcategories з URL-параметрів
  useEffect(() => {
    const currentSubcategoryIdsInUrl = searchParams.get('subcategory');
    const newSelectedState: Record<number, boolean> = {};

    // Ініціалізуємо всі підкатегорії як не вибрані
    listSubcategories.forEach((subcat) => {
      newSelectedState[subcat.id] = false;
    });

    // Встановлюємо вибрані підкатегорії з URL, якщо вони є
    if (currentSubcategoryIdsInUrl) {
      const ids = currentSubcategoryIdsInUrl
        .split(',')
        .map((idStr) => parseInt(idStr.trim()))
        .filter(
          (id) =>
            !isNaN(id) && listSubcategories.some((subcat) => subcat.id === id)
        );

      ids.forEach((id) => {
        newSelectedState[id] = true;
      });
    }
    setSelectedSubcategories(newSelectedState);
  }, [searchParams, listSubcategories]); // Залежимо від searchParams та listSubcategories

  // Дублююча функція, яка генерує та повертає URL для SEO та посилань
  const getHandleCheckboxChange = (
    subcategoryId: number,
    subcategoryUrl: string
  ) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    let currentSubcategoryIds = searchParams.get('subcategory')
      ? searchParams
          .get('subcategory')!
          .split(',')
          .map((idStr) => parseInt(idStr.trim()))
          .filter((id) => !isNaN(id))
      : [];

    const isCurrentlySelected = currentSubcategoryIds.includes(subcategoryId);

    if (isCurrentlySelected) {
      currentSubcategoryIds = currentSubcategoryIds.filter(
        (id) => id !== subcategoryId
      );
    } else {
      currentSubcategoryIds.push(subcategoryId);
    }
    if (currentSubcategoryIds.length > 0) {
      if (brand) {
        if (!searchParams.toString().includes('category')) {
          newSearchParams.set(
            'category',
            listSubcategories[0].categoryId.toString()
          );
        }
        newSearchParams.set('subcategory', currentSubcategoryIds.join(','));
      }
    } else {
      newSearchParams.delete('subcategory');
    }

    if (brand) {
      return getLocalizedPath(
        `/${lang}/brands/${brand}/1?${sortSearchParams(newSearchParams).toString()}`,
        lang
      );
    }

    if (currentPathname) {
      const parts = currentPathname.split('/').filter(Boolean);
      const currentSubcategory = parts[3];

      const newParts = [...parts];

      if (currentSubcategory === subcategoryUrl) {
        newParts.splice(3, 2);
      } else if (currentSubcategory) {
        newParts[3] = subcategoryUrl;
      } else {
        newParts.push(subcategoryUrl);
      }

      const newPathname =
        '/' +
        newParts.join('/') +
        '/1?' +
        sortSearchParams(newSearchParams).toString();

      return getLocalizedPath(newPathname, lang);
    }

    return getLocalizedPath(`/${lang}/goods/1`, lang);
  };

  // Обробник зміни чекбоксу для кліку із router.push та збереженням скролу
  const handleCheckboxChange = (
    subcategoryId: number,
    subcategoryUrl: string,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    const targetUrl = getHandleCheckboxChange(subcategoryId, subcategoryUrl);
    router.push(targetUrl, { scroll: false });
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
    setOpen(nameOpen);
  };

  const isOpenVisible = (isDropdownOpen && !isMobile) || nameOpen == open;

  return (
    <div className="brands-container subcategories-container">
      <div
        style={{ minWidth: '90px' }}
        className="brands-header subcategories-header"
        onClick={toggleDropdown}
      >
        <span>{lang == 'ru' ? 'ПОДКАТЕГОРИЯ' : 'ПІДКАТЕГОРІЯ'}</span>
        <span className={`arrow-icon ${isDropdownOpen ? 'open' : ''}`}>
          {isDropdownOpen ? <UpSVG /> : <DownSVG />}
        </span>
      </div>

      {/* Завжди присутній у DOM для SEO, показується/ховається через style.display */}
      <div
        style={{ left: '5px', display: isOpenVisible ? 'block' : 'none' }}
        className={isMobile ? 'dropdownFilterMobile dropdown' : ''}
      >
        <ul className="brands-list filter-scroll" ref={scrollContainerRef}>
          {sortedSubcategories.map((subcategory) => {
            const subcategoryEngUrl = UkrToEng(subcategory.nameru);
            const generatedHref = getHandleCheckboxChange(
              subcategory.id,
              subcategoryEngUrl
            );

            return (
              <li key={subcategory.id} className="brand-item">
                <Link
                  href={
                    generatedHref.endsWith('?')
                      ? generatedHref.slice(0, generatedHref.length - 1)
                      : generatedHref
                  }
                  onClick={(e) =>
                    handleCheckboxChange(subcategory.id, subcategoryEngUrl, e)
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
                        selectedSubcategories[subcategory.id] ||
                        currentPathname?.includes(subcategoryEngUrl) ||
                        false
                      }
                      readOnly
                      style={{ display: 'none' }}
                    />
                    <span className="custom-checkbox"></span>
                    {/* Відображаємо назву відповідно до поточної мови */}
                    <span className="brand-name">
                      {lang !== 'ru' ? subcategory.nameuk : subcategory.nameru}
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

export default Subcategories;
