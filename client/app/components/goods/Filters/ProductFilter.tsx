'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './Brends.scss'; // Залишаємо Brends.scss для загальних стилів, якщо потрібно
//import './ProductFilter.scss' // Додаємо окремий файл стилів для ProductFilter
import UpSVG from '../../../assest/Filters/Up.svg';
import DownSVG from '../../../assest/Filters/Down.svg';
import { Locale } from '@/i18n.config';
import { sortSearchParams } from './SortSerchParams';
import { getLocalizedPath } from '../../utils/getLocalizedPath';

// Типізація для об'єкта фільтра, що приходить з бекенду
type ProductFilterData = {
  id: number;
  nameuk: string;
  nameru: string;
  valuesuk: string[];
  valuesru: string[];
};

type ProductFilterProps = {
  filterData: ProductFilterData; // Об'єкт з даними для конкретного фільтра
  lang: Locale; // 'ua' | 'ru'
  currentSearchParams: URLSearchParams; // Поточні параметри URL
  brand?: string;
  currentPathname?: string;
  nameOpen: string;
  open: string;
  setOpen: any;
  isMob: boolean;
};

const ProductFilter: React.FC<ProductFilterProps> = ({
  filterData,
  lang,
  brand,
  currentPathname,
  nameOpen,
  open,
  setOpen,
  isMob,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Стан для відстеження вибраних значень фільтра (може бути кілька)
  // Ключем буде саме значення, оскільки ID у values немає
  const [selectedValues, setSelectedValues] = useState<Record<string, boolean>>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(isMob);
  const scrollContainerRef = useRef<HTMLUListElement | null>(null);

  // Визначення мобільної версії
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Ініціалізація та оновлення selectedValues з URL-параметрів
  useEffect(() => {
    // Назва параметра в URL буде filter_{id фільтра}
    const filterParamName = `filter_${filterData.id}`;
    const currentFilterValuesInUrl = searchParams.get(filterParamName);
    const newSelectedState: Record<string, boolean> = {};

    // Ініціалізуємо всі можливі значення як не вибрані
    const allPossibleValues = new Set([...filterData.valuesuk, ...filterData.valuesru]);
    allPossibleValues.forEach((value) => {
      newSelectedState[value] = false;
    });

    // Встановлюємо вибрані значення з URL, якщо вони є
    if (currentFilterValuesInUrl) {
      const values = currentFilterValuesInUrl
        .split(',')
        .map((val) => val.trim())
        .filter((val) => val !== ''); // Фільтруємо порожні рядки

      values.forEach((val) => {
        // Перевіряємо, чи значення з URL дійсно присутнє в списку доступних значень
        // (для поточної мови або обох, залежить від вашої вимоги до валідації)
        if (filterData.valuesuk.includes(val) || filterData.valuesru.includes(val)) {
          newSelectedState[val] = true;
        }
      });
    }
    setSelectedValues(newSelectedState);
  }, [searchParams, filterData]); // Залежимо від searchParams та filterData

  // Обробник зміни чекбоксу
  const handleCheckboxChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const filterParamName = `filter_${filterData.id}`;

    let currentSelectedValues = searchParams.get(filterParamName)
      ? searchParams
          .get(filterParamName)!
          .split(',')
          .map((val) => val.trim())
          .filter((val) => val !== '')
      : [];

    const isCurrentlySelected = currentSelectedValues.includes(value);

    if (isCurrentlySelected) {
      // Якщо значення вже вибрано, знімаємо вибір
      currentSelectedValues = currentSelectedValues.filter((val) => val !== value);
    } else {
      // Якщо значення не вибрано, додаємо його
      currentSelectedValues.push(value);
    }

    if (currentSelectedValues.length > 0) {
      newSearchParams.set(filterParamName, currentSelectedValues.join(','));
    } else {
      newSearchParams.delete(filterParamName); // Видаляємо параметр, якщо немає вибраних значень
    }

    // Формуємо новий URL та перенаправляємо
    if (brand)
      router.push(
        getLocalizedPath(
          `/${lang}/brands/${brand}/1?${sortSearchParams(newSearchParams).toString()}`,
          lang
        )
      );
    else
      router.push(
        getLocalizedPath(
          `${currentPathname}/1?${sortSearchParams(newSearchParams).toString()}`,
          lang
        )
      );
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
    setOpen(nameOpen);
  };
  // Вибираємо список значень відповідно до поточної мови
  const valuesToDisplay = lang !== 'ru' ? filterData.valuesuk : filterData.valuesru;

  return (
    <div className="brands-container product-filter-container">
      {' '}
      {/* Використовуємо brands-container для базових стилів */}
      <div
        style={{ minWidth: '90px' }}
        className="brands-header product-filter-header"
        onClick={toggleDropdown}
      >
        {/* Відображаємо назву фільтра відповідно до поточної мови */}
        <span>{lang !== 'ru' ? filterData.nameuk : filterData.nameru}</span>
        <span className={`arrow-icon ${isDropdownOpen ? 'open' : ''}`}>
          {isDropdownOpen ? <UpSVG /> : <DownSVG />}
        </span>
      </div>
      {((isDropdownOpen && !isMobile) || nameOpen == open) && (
        <div style={{ left: '5px' }} className={isMobile ? 'dropdownFilterMobile dropdown' : ''}>
          <ul className="brands-list filter-scroll" ref={scrollContainerRef}>
            {valuesToDisplay.map((value, index) => (
              <li key={value} className="brand-item">
                {' '}
                {/* Використовуємо значення як key */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={selectedValues[value] || false}
                    onChange={() => handleCheckboxChange(value)}
                    style={{ display: 'none' }}
                  />
                  <span className="custom-checkbox"></span>
                  <span className="brand-name">{value}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;
