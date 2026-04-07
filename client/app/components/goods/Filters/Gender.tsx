'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Імпортуємо useRouter та useSearchParams
import './Brends.scss'; // Залишаємо Brends.scss, якщо він містить загальні стилі
import UpSVG from '../../../assest/Filters/Up.svg';
import DownSVG from '../../../assest/Filters/Down.svg';
import { Locale } from '@/i18n.config'; // Імпортуємо Locale для lang
import { sortSearchParams } from './SortSerchParams';
import { getLocalizedPath } from '../../utils/getLocalizedPath';

type CategoriesProps = {
  currentSearchParams: URLSearchParams;
  lang: Locale;
  brand?: string;
  currentPathname?: string;
  nameOpen: string;
  open: string;
  setOpen: any;
  isMob: boolean;
};

const Gender: React.FC<CategoriesProps> = ({
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
  const sortedCategories = [
    { name: lang == 'ru' ? 'Для мужчин' : 'Для чоловіків', value: 'true' },
    {
      name: lang == 'ru' ? 'Для женщин' : 'Для жінок',
      value: 'false',
    },
  ];

  // Стан для відстеження вибраних категорій (оскільки category - це один ID, це буде сингл-вибір)
  const [selectedCategories, setSelectedCategories] = useState<string>('null');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(isMob); // Ініціалізуємо false, оновлюємо в useEffect
  const scrollContainerRef = useRef<HTMLUListElement | null>(null);

  // Ініціалізація та оновлення selectedCategories з URL-параметрів
  useEffect(() => {
    const currentCategoryIdInUrl = searchParams.get('isForMan');
    if (!currentCategoryIdInUrl) setSelectedCategories('null');
    else {
      const temp = currentCategoryIdInUrl || 'null';
      setSelectedCategories(temp);
    }
  }, [searchParams]); // Залежимо від searchParams та listCategories

  // Обробник зміни чекбоксу
  const handleCheckboxChange = (categoryId: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const currentSelectedCategoryInUrl = searchParams.get('isForMan');
    if (currentSelectedCategoryInUrl == categoryId) {
      // Якщо поточна вибрана категорія клікнута знову, знімаємо вибір
      newSearchParams.delete('isForMan');
    } else {
      // Вибираємо нову категорію
      newSearchParams.set('isForMan', categoryId);
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
    else
      router.push(
        getLocalizedPath(
          `${currentPathname}/1?${sortSearchParams(newSearchParams).toString()}`,
          lang
        ),
        { scroll: false }
      );
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
    setOpen(nameOpen);
  };

  return (
    <div className="brands-container categories-container">
      <div className="brands-header" onClick={toggleDropdown}>
        <span>{lang == 'ru' ? 'ПОЛ' : 'СТАТЬ'}</span>
        <span className={`arrow-icon ${isDropdownOpen ? 'open' : ''}`}>
          {isDropdownOpen ? <UpSVG /> : <DownSVG />}
        </span>
      </div>
      {((isDropdownOpen && !isMobile) || nameOpen == open) && (
        <div
          style={{ left: '5px', width: '160px' }}
          className={isMobile ? 'dropdownFilterMobile dropdown' : ''}
        >
          {/* Алфавітний фільтр видалено */}
          <ul className="brands-list filter-scroll" ref={scrollContainerRef}>
            {sortedCategories.map((category) => (
              <li key={category.name} className="brand-item">
                {' '}
                {/* Змінено class на category-item */}
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <input
                    type="checkbox"
                    checked={category.value == selectedCategories}
                    onChange={() => handleCheckboxChange(category.value)}
                    style={{ display: 'none' }}
                  />
                  <span className="custom-checkbox"></span>
                  {/* Відображаємо назву відповідно до поточної мови */}
                  <span className="brand-name">
                    {' '}
                    {/* Змінено class на category-name */}
                    {category.name}
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

export default Gender;
