'use client';
import React, { useState, useEffect, useRef } from 'react';
import './Brends.scss'; // Залишаємо Brends.scss, якщо він містить загальні стилі
import { useRouter, useSearchParams } from 'next/navigation'; // Імпортуємо useRouter та useSearchParams
import './Subcategories.scss'; // Додаємо окремий файл стилів для Subcategories
import UpSVG from '../../../assest/Filters/Up.svg';
import DownSVG from '../../../assest/Filters/Down.svg';
import { Locale } from '@/i18n.config'; // Імпортуємо Locale для lang
import { sortSearchParams } from './SortSerchParams';
import { getLocalizedPath } from '../../utils/getLocalizedPath';
import { UkrToEng } from '../../utils/UkrToEng';

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
  const [selectedSubcategories, setSelectedSubcategories] = useState<Record<number, boolean>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(isMob);
  const scrollContainerRef = useRef<HTMLUListElement | null>(null);

  // Визначення мобільної версії
  useEffect(() => {
    const handleResize = () => {
      setIsDropdownOpen(window.innerWidth >= 1024);
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
        .filter((id) => !isNaN(id) && listSubcategories.some((subcat) => subcat.id === id));

      ids.forEach((id) => {
        newSelectedState[id] = true;
      });
    }
    setSelectedSubcategories(newSelectedState);
  }, [searchParams, listSubcategories]); // Залежимо від searchParams та listSubcategories

  // Обробник зміни чекбоксу
  const handleCheckboxChange = (subcategoryId: number, subcategoryUrl: string) => {
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
      // Якщо підкатегорія вже вибрана, знімаємо вибір
      currentSubcategoryIds = currentSubcategoryIds.filter((id) => id !== subcategoryId);
    } else {
      // Якщо підкатегорія не вибрана, додаємо її
      currentSubcategoryIds.push(subcategoryId);
    }
    if (currentSubcategoryIds.length > 0) {
      if (brand) newSearchParams.set('subcategory', currentSubcategoryIds.join(','));
    } else {
      newSearchParams.delete('subcategory'); // Видаляємо параметр, якщо немає вибраних підкатегорій
    }

    // Формуємо новий URL та перенаправляємо
    if (brand)
      router.push(
        getLocalizedPath(
          `/${lang}/brands/${brand}/1?${sortSearchParams(newSearchParams).toString()}`,
          lang
        ),
        { scroll: false }
      );
    if (currentPathname) {
      // Розбиваємо шлях на частини
      const parts = currentPathname.split('/').filter(Boolean);

      // Перевіряємо, чи останній сегмент — підкатегорія
      const currentSubcategory = parts[3]; // якщо підкатегорія завжди на index 3

      if (currentSubcategory === subcategoryUrl) {
        // Вибрали ту саму підкатегорію — видаляємо
        parts.splice(3, 1);
      } else if (currentSubcategory) {
        // Замінюємо стару підкатегорію на нову
        parts[3] = subcategoryUrl;
      } else {
        // Додаємо нову підкатегорію
        parts.push(subcategoryUrl);
      }

      // Формуємо новий шлях
      const newPathname =
        '/' + parts.join('/') + '/1?' + sortSearchParams(newSearchParams).toString();

      // Редирект
      router.push(getLocalizedPath(newPathname, lang), { scroll: false });
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
    setOpen(nameOpen);
  };

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
      {((isDropdownOpen && !isMobile) || nameOpen == open) && (
        <div style={{ left: '5px' }} className={isMobile ? 'dropdownFilterMobile dropdown' : ''}>
          <ul className="brands-list filter-scroll" ref={scrollContainerRef}>
            {sortedSubcategories.map((subcategory) => (
              <li key={subcategory.id} className="subcategories-item">
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={
                      selectedSubcategories[subcategory.id] ||
                      currentPathname?.includes(`${UkrToEng(subcategory.nameru)}`) ||
                      false
                    }
                    onChange={() =>
                      handleCheckboxChange(subcategory.id, UkrToEng(subcategory.nameru))
                    }
                    style={{ display: 'none' }}
                  />
                  <span className="custom-checkbox"></span>
                  {/* Відображаємо назву відповідно до поточної мови */}
                  <span className="subcategory-name">
                    {lang !== 'ru' ? subcategory.nameuk : subcategory.nameru}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Subcategories;
