'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './Brends.scss'; // Залишаємо Brends.scss для стилів
import UpSVG from '../../../assest/Filters/Up.svg';
import DownSVG from '../../../assest/Filters/Down.svg';
import { Locale } from '@/i18n.config';
import { sortSearchParams } from './SortSerchParams';
import { getLocalizedPath } from '../../utils/getLocalizedPath';

// Типізація Brand на основі desc brends
type Brand = {
  id: number;
  name: string;
};

type Props = {
  lang: Locale;
  realBrands: Brand[]; // Тепер це реальні бренди, що приходять з бекенду
  currentSearchParams: URLSearchParams; // Поточні параметри URL (хоча використовуємо useSearchParams)
  currentPathname?: string;
  nameOpen: string;
  open: string;
  setOpen: any;
  isMob: boolean;
};

const Brands: React.FC<Props> = ({
  lang,
  realBrands,
  currentPathname,
  nameOpen,
  open,
  setOpen,
  isMob,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Стан для відстеження вибраних брендів (може бути кілька)
  const [selectedBrands, setSelectedBrands] = useState<Record<number, boolean>>({});
  const [selectedLetter, setSelectedLetter] = useState<string>(''); // Порожній рядок за замовчуванням
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

  // Ініціалізація та оновлення selectedBrands з URL-параметрів
  useEffect(() => {
    const currentBrandIdsInUrl = searchParams.get('brend');
    const newSelectedState: Record<number, boolean> = {};

    // Ініціалізуємо всі бренди як не вибрані
    realBrands.forEach((brand) => {
      newSelectedState[brand.id] = false;
    });

    // Встановлюємо вибрані бренди з URL, якщо вони є
    if (currentBrandIdsInUrl) {
      const ids = currentBrandIdsInUrl
        .split(',')
        .map((idStr) => parseInt(idStr.trim()))
        .filter((id) => !isNaN(id) && realBrands.some((brand) => brand.id === id)); // Перевірка на валідність ID

      ids.forEach((id) => {
        newSelectedState[id] = true;
      });
    }
    setSelectedBrands(newSelectedState);
  }, [searchParams, realBrands]); // Залежимо від searchParams та realBrands

  // Обробник зміни чекбоксу
  const handleCheckboxChange = (brandId: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    let currentBrandIds = searchParams.get('brend')
      ? searchParams
          .get('brend')!
          .split(',')
          .map((idStr) => parseInt(idStr.trim()))
          .filter((id) => !isNaN(id))
      : [];

    const isCurrentlySelected = currentBrandIds.includes(brandId);

    if (isCurrentlySelected) {
      // Якщо бренд вже вибраний, знімаємо вибір
      currentBrandIds = currentBrandIds.filter((id) => id !== brandId);
    } else {
      // Якщо бренд не вибраний, додаємо його
      currentBrandIds.push(brandId);
    }

    if (currentBrandIds.length > 0) {
      newSearchParams.set('brend', currentBrandIds.join(','));
    } else {
      newSearchParams.delete('brend'); // Видаляємо параметр, якщо немає вибраних брендів
    }

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
  // --- Динамічне формування алфавіту ---
  const dynamicAlphabet = useMemo(() => {
    const firstLetters = new Set<string>();
    realBrands.forEach((brand) => {
      const firstChar = brand.name.trim().charAt(0);
      if (firstChar) {
        if (/\d/.test(firstChar)) {
          firstLetters.add('0-9');
        } else {
          firstLetters.add(firstChar.toUpperCase());
        }
      }
    });

    const lettersArray = Array.from(firstLetters).sort((a, b) => {
      if (a === '0-9') return 1; // '0-9' завжди в кінці
      if (b === '0-9') return -1;
      return a.localeCompare(b, lang !== 'ru' ? 'uk' : 'en'); // Сортування за мовою
    });

    return lettersArray;
  }, [realBrands, lang]);

  // --- Сортовані бренди з вибраними на початку ---
  const sortedBrandsWithSelectedFirst = useMemo(() => {
    const selected = realBrands.filter((brand) => selectedBrands[brand.id]);
    const unselected = realBrands.filter((brand) => !selectedBrands[brand.id]);

    // Сортуємо вибрані бренди за алфавітом
    selected.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      return nameA.localeCompare(nameB, lang !== 'ru' ? 'uk' : 'en');
    });

    // Сортуємо невибрані бренди за алфавітом
    unselected.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (/^\d/.test(nameA) && !/^\d/.test(nameB)) return 1;
      if (!/^\d/.test(nameA) && /^\d/.test(nameB)) return -1;
      return nameA.localeCompare(nameB, lang !== 'ru' ? 'uk' : 'en');
    });

    // Об'єднуємо: спочатку вибрані, потім невибрані
    return [...selected, ...unselected];
  }, [realBrands, selectedBrands, lang]);

  // Обробник кліку на букву
  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter); // Встановлюємо активну літеру
    const list = scrollContainerRef.current;
    if (list) {
      let targetElement: HTMLElement | undefined;

      // Спробуємо знайти перший НЕВИБРАНИЙ елемент, що відповідає літері
      targetElement = Array.from(list.children).find((child) => {
        const brandId = parseInt((child as HTMLElement).dataset.brandId || ''); // Отримуємо ID бренду з data-brand-id
        if (isNaN(brandId) || selectedBrands[brandId]) return false; // Пропускаємо, якщо вже вибраний

        const brandNameElement = (child as HTMLElement).querySelector('.brand-name');
        if (!brandNameElement) return false;

        const brandName = brandNameElement.textContent?.trim() || '';
        if (!brandName) return false;

        const firstChar = brandName.charAt(0);
        if (letter === '0-9') return /\d/.test(firstChar);
        return firstChar.toUpperCase() === letter;
      }) as HTMLElement | undefined;

      // Якщо невибраний елемент не знайдено, шукаємо перший (будь-який) елемент, що відповідає літері
      if (!targetElement) {
        targetElement = Array.from(list.children).find((child) => {
          const brandNameElement = (child as HTMLElement).querySelector('.brand-name');
          if (!brandNameElement) return false;

          const brandName = brandNameElement.textContent?.trim() || '';
          if (!brandName) return false;

          const firstChar = brandName.charAt(0);
          if (letter === '0-9') return /\d/.test(firstChar);
          return firstChar.toUpperCase() === letter;
        }) as HTMLElement | undefined;
      }

      if (targetElement) {
        // Прокручуємо до знайденого елемента
        list.scrollTo({
          top: (targetElement as HTMLElement).offsetTop - list.offsetTop - 2,
          behavior: 'smooth',
        });
      } else {
        // Якщо немає елементів для цієї літери взагалі, прокручуємо на початок
        list.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="brands-container">
      <div className="brands-header" onClick={toggleDropdown}>
        <span>БРЕНД</span>
        <span className={`arrow-icon ${isDropdownOpen ? 'open' : ''}`}>
          {isDropdownOpen ? <UpSVG /> : <DownSVG />}
        </span>
      </div>
      {((isDropdownOpen && !isMobile) || nameOpen == open) && (
        <div style={{ left: '15px' }} className={isMobile ? 'dropdownFilterMobile dropdown' : ''}>
          {realBrands.length > 10 && (
            <div className="brands-alphabet">
              {dynamicAlphabet.map((letter) => (
                <button
                  key={letter}
                  className={`alphabet-button ${selectedLetter === letter ? 'active' : ''}`}
                  onClick={() => handleLetterClick(letter)}
                >
                  {letter}
                </button>
              ))}
            </div>
          )}
          <ul className="brands-list filter-scroll" ref={scrollContainerRef}>
            {sortedBrandsWithSelectedFirst.map((brand) => (
              <li key={brand.id} className="brand-item" data-brand-id={brand.id}>
                {' '}
                {/* Додано data-brand-id */}
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={selectedBrands[brand.id] || false}
                    onChange={() => handleCheckboxChange(brand.id)}
                    style={{ display: 'none' }}
                  />
                  <span className="custom-checkbox"></span>
                  <span className="brand-name">{brand.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Brands;
