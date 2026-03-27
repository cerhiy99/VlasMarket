'use client';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './Brends.scss'; // Залишаємо Brends.scss для загальних стилів, якщо потрібно
import UpSVG from '../../../assest/Filters/Up.svg';
import DownSVG from '../../../assest/Filters/Down.svg';
import { Locale } from '@/i18n.config';
import { sortSearchParams } from './SortSerchParams';
import { getLocalizedPath } from '../../utils/getLocalizedPath';

// Типізація CountryMade на основі desc country_made
type Country = {
  id: number;
  nameuk: string;
  nameru: string;
};

type Props = {
  lang: Locale;
  realCountries: Country[]; // Тепер це реальні країни, що приходять з бекенду
  currentSearchParams: URLSearchParams; // Поточні параметри URL
  brand?: string;
  currentPathname?: string;
  nameOpen: string;
  open: string;
  setOpen: any;
  isMob: boolean;
};

const CountryMade: React.FC<Props> = ({
  lang,
  realCountries,
  brand,
  currentPathname,
  nameOpen,
  open,
  setOpen,
  isMob,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Стан для відстеження вибраних країн (може бути кілька)
  const [selectedCountries, setSelectedCountries] = useState<Record<number, boolean>>({});
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

  // Ініціалізація та оновлення selectedCountries з URL-параметрів
  useEffect(() => {
    const currentCountryIdsInUrl = searchParams.get('country');
    const newSelectedState: Record<number, boolean> = {};

    // Ініціалізуємо всі країни як не вибрані
    realCountries.forEach((country) => {
      newSelectedState[country.id] = false;
    });

    // Встановлюємо вибрані країни з URL, якщо вони є
    if (currentCountryIdsInUrl) {
      const ids = currentCountryIdsInUrl
        .split(',')
        .map((idStr) => parseInt(idStr.trim()))
        .filter((id) => !isNaN(id) && realCountries.some((country) => country.id === id)); // Перевірка на валідність ID

      ids.forEach((id) => {
        newSelectedState[id] = true;
      });
    }
    setSelectedCountries(newSelectedState);
  }, [searchParams, realCountries]); // Залежимо від searchParams та realCountries

  // Обробник зміни чекбоксу
  const handleCheckboxChange = (countryId: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    let currentCountryIds = searchParams.get('country')
      ? searchParams
          .get('country')!
          .split(',')
          .map((idStr) => parseInt(idStr.trim()))
          .filter((id) => !isNaN(id))
      : [];

    const isCurrentlySelected = currentCountryIds.includes(countryId);

    if (isCurrentlySelected) {
      // Якщо країна вже вибрана, знімаємо вибір
      currentCountryIds = currentCountryIds.filter((id) => id !== countryId);
    } else {
      // Якщо країна не вибрана, додаємо її
      currentCountryIds.push(countryId);
    }

    if (currentCountryIds.length > 0) {
      newSearchParams.set('country', currentCountryIds.join(','));
    } else {
      newSearchParams.delete('country'); // Видаляємо параметр, якщо немає вибраних країн
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
  // --- Динамічне формування алфавіту ---
  const dynamicAlphabet = useMemo(() => {
    const firstLetters = new Set<string>();
    realCountries.forEach((country) => {
      const nameToUse = lang !== 'ru' ? country.nameuk.trim() : country.nameru.trim();
      const firstChar = nameToUse.charAt(0);
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
  }, [realCountries, lang]);

  // --- Сортовані країни з вибраними на початку ---
  const sortedCountriesWithSelectedFirst = useMemo(() => {
    const selected = realCountries.filter((country) => selectedCountries[country.id]);
    const unselected = realCountries.filter((country) => !selectedCountries[country.id]);

    // Сортуємо вибрані країни за алфавітом
    selected.sort((a, b) => {
      const nameA = (lang !== 'ru' ? a.nameuk : a.nameru).toLowerCase();
      const nameB = (lang !== 'ru' ? b.nameuk : b.nameru).toLowerCase();
      return nameA.localeCompare(nameB, lang !== 'ru' ? 'uk' : 'en');
    });

    // Сортуємо невибрані країни за алфавітом
    unselected.sort((a, b) => {
      const nameA = (lang !== 'ru' ? a.nameuk : a.nameru).toLowerCase();
      const nameB = (lang !== 'ru' ? b.nameuk : b.nameru).toLowerCase();
      if (/^\d/.test(nameA) && !/^\d/.test(nameB)) return 1;
      if (!/^\d/.test(nameA) && /^\d/.test(nameB)) return -1;
      return nameA.localeCompare(nameB, lang !== 'ru' ? 'uk' : 'en');
    });

    // Об'єднуємо: спочатку вибрані, потім невибрані
    return [...selected, ...unselected];
  }, [realCountries, selectedCountries, lang]);

  // Обробник кліку на букву
  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter); // Встановлюємо активну літеру
    const list = scrollContainerRef.current;
    if (list) {
      let targetCountryId: number | undefined;

      // 1. Спробуємо знайти ID першої НЕВИБРАНОЇ країни, що відповідає літері
      const unselectedTargetCountry = sortedCountriesWithSelectedFirst.find((country) => {
        const isSelected = selectedCountries[country.id];
        if (isSelected) return false; // Пропускаємо вибрані країни

        const nameToCompare = lang !== 'ru' ? country.nameuk.trim() : country.nameru.trim();
        const firstChar = nameToCompare.charAt(0);
        if (!firstChar) return false;

        if (letter === '0-9') return /\d/.test(firstChar);
        return firstChar.toUpperCase() === letter;
      });

      if (unselectedTargetCountry) {
        targetCountryId = unselectedTargetCountry.id;
      } else {
        // 2. Якщо невибрана країна не знайдена (тобто всі країни на цю літеру вже вибрані),
        // шукаємо ID першої (будь-якої) країни, що відповідає літері
        const anyTargetCountry = sortedCountriesWithSelectedFirst.find((country) => {
          const nameToCompare = lang !== 'ru' ? country.nameuk.trim() : country.nameru.trim();
          const firstChar = nameToCompare.charAt(0);
          if (!firstChar) return false;

          if (letter === '0-9') return /\d/.test(firstChar);
          return firstChar.toUpperCase() === letter;
        });
        if (anyTargetCountry) {
          targetCountryId = anyTargetCountry.id;
        }
      }

      if (targetCountryId !== undefined) {
        // Знаходимо DOM-елемент за data-country-id
        const targetElement = list.querySelector(
          `[data-country-id="${targetCountryId}"]`
        ) as HTMLElement;
        if (targetElement) {
          list.scrollTo({
            top: targetElement.offsetTop - list.offsetTop - 2,
            behavior: 'smooth',
          });
        } else {
          // Fallback, якщо DOM елемент не знайдено (не повинно статися, якщо data-country-id коректний)
          list.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else {
        // Якщо немає елементів для цієї літери взагалі, прокручуємо на початок
        list.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="brands-container">
      {' '}
      {/* Залишаємо brands-container */}
      <div className="brands-header" onClick={toggleDropdown}>
        {' '}
        {/* Залишаємо brands-header */}
        <span>{lang == 'ru' ? 'СТРАНА ПРОИЗВОДИТЕЛЬ' : 'КРАЇНА ВИРОБНИК'}</span>
        <span className={`arrow-icon ${isDropdownOpen ? 'open' : ''}`}>
          {isDropdownOpen ? <UpSVG /> : <DownSVG />}
        </span>
      </div>
      {((isDropdownOpen && !isMobile) || nameOpen == open) && (
        <div style={{ left: '15px' }} className={isMobile ? 'dropdownFilterMobile dropdown' : ''}>
          {' '}
          {realCountries.length > 10 && (
            <div className="brands-alphabet">
              {' '}
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
            {' '}
            {/* Залишаємо brands-list */}
            {sortedCountriesWithSelectedFirst.map(
              (
                country // Використовуємо новий відсортований масив
              ) => (
                <li key={country.id} className="brand-item" data-country-id={country.id}>
                  {' '}
                  {/* Додано data-country-id */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCountries[country.id] || false}
                      onChange={() => handleCheckboxChange(country.id)}
                      style={{ display: 'none' }}
                    />
                    <span className="custom-checkbox"></span>
                    <span className="brand-name">
                      {' '}
                      {/* Залишаємо brand-name */}
                      {lang !== 'ru' ? country.nameuk : country.nameru}
                    </span>
                  </label>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CountryMade;
