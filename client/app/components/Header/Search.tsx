'use client';
import { Locale } from '@/i18n.config';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link'; // Імпортуємо Link для навігації
import { useRouter } from 'next/navigation'; // Імпортуємо useRouter для програмної навігації
import './Search.scss';
import SearchSVG from '../../assest/Header/Search.svg';
import { $host } from '@/app/http'; // Переконайтеся, що $host правильно налаштований
import { getLocalizedPath } from '../utils/getLocalizedPath';

// Типизація для структурованих результатів пошуку
interface SearchSuggestionItem {
  id: number;
  nameuk: string;
  nameru: string;
  link: string;
  art?: string; // Артикул тільки для товарів
}

interface SearchResults {
  products: SearchSuggestionItem[];
  categories: SearchSuggestionItem[];
  subcategories: SearchSuggestionItem[];
  countries: SearchSuggestionItem[];
  // Додайте інші типи, якщо вони з'являться (наприклад, brands)
}

type Props = {
  lang: Locale; // 'ua' | 'ru'
  dictionary: any; // Словник для перекладів інтерфейсу (залишаємо, але не використовуємо для текстів)
};

const Search = ({ lang, dictionary }: Props) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [suggestions, setSuggestions] = useState<SearchResults | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null); // Референс для контейнера пошуку
  const router = useRouter(); // Ініціалізуємо useRouter

  // Функція для отримання результатів пошуку з дебаунсом
  const getSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions(null);
      return;
    }
    try {
      const res = await $host.get<SearchResults>(
        'search/search?query=' + query,
      );
      setSuggestions(res.data);
      setShowSuggestions(true); // Показуємо підказки після отримання даних
    } catch (err) {
      console.error('Помилка при отриманні пошукових підказок:', err);
      setSuggestions(null);
    }
  }, []);

  // Дебаунс ефект для searchValue
  useEffect(() => {
    const handler = setTimeout(() => {
      getSuggestions(searchValue);
    }, 300); // Затримка 300мс після останнього введення

    return () => {
      clearTimeout(handler); // Очищаємо таймер при зміні searchValue або розмонтуванні компонента
    };
  }, [searchValue, getSuggestions]);

  // Обробник кліку поза контейнером пошуку для закриття підказок
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Функція для обробки відправки пошуку (натискання Enter або клік на іконку)
  const handleSearchSubmit = () => {
    if (searchValue.trim().length > 0) {
      // Перенаправляємо на сторінку результатів пошуку
      router.push(
        getLocalizedPath(
          `/${lang}/goods/1?search=${encodeURIComponent(searchValue.trim())}`,
          lang,
        ),
      );
      //setSearchValue('') // Очищаємо поле пошуку
      setSuggestions(null); // Приховуємо підказки
      setShowSuggestions(false); // Приховуємо випадаючий список
    } else {
      // Перенаправляємо на сторінку результатів пошуку
      router.push(getLocalizedPath(`/${lang}/goods/1`, lang));
      //setSearchValue('') // Очищаємо поле пошуку
      setSuggestions(null); // Приховуємо підказки
      setShowSuggestions(false); // Приховуємо випадаючий список
    }
  };

  // Обробник натискання клавіш в полі введення
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // Функція для обробки кліку на посилання в підказках
  const handleLinkClick = () => {
    setSearchValue(''); // Очищаємо поле пошуку
    setSuggestions(null); // Приховуємо підказки
    setShowSuggestions(false); // Приховуємо випадаючий список
  };

  const hasSuggestions =
    suggestions &&
    (suggestions.products.length > 0 ||
      suggestions.categories.length > 0 ||
      suggestions.subcategories.length > 0 ||
      suggestions.countries.length > 0);

  return (
    <div className="header-search" ref={searchContainerRef}>
      <input
        value={searchValue}
        onChange={(e) => {
          setSearchValue(e.target.value);
          // Показуємо підказки одразу, якщо запит достатньо довгий
          if (e.target.value.length >= 2) {
            setShowSuggestions(true);
          } else {
            setShowSuggestions(false); // Приховуємо, якщо запит занадто короткий
            setSuggestions(null); // Очищаємо, якщо запит занадто короткий
          }
        }}
        onFocus={() => {
          // Показуємо підказки при фокусі, якщо вже є результати або запит достатньо довгий
          if (searchValue.length >= 2 && suggestions) {
            setShowSuggestions(true);
          }
        }}
        onBlur={() => {
          // Не закриваємо одразу, даємо час для кліку на підказку
          setTimeout(() => setShowSuggestions(false), 100);
        }}
        onKeyDown={handleKeyDown} // Додаємо обробник натискання клавіш
        placeholder={dictionary.placeholder} // Замінено на український текст
      />
      <div className="search-svg" onClick={handleSearchSubmit}>
        {' '}
        {/* Додаємо обробник кліку */}
        <SearchSVG />
      </div>

      {/* Випадаючий список підказок */}
      {showSuggestions && hasSuggestions && (
        <div className="search-dropdown">
          {/* Категорії */}
          {suggestions.categories.length > 0 && (
            <div className="search-section">
              <div className="search-section-title">Категорії</div>
              <ul>
                {suggestions.categories.map((item) => (
                  <li key={item.id} className="search-item">
                    <Link
                      href={getLocalizedPath(`/${lang}` + item.link, lang)}
                      onClick={handleLinkClick}
                    >
                      {dictionary.productInCategory} &quot;
                      {lang !== 'ru' ? item.nameuk : item.nameru}&quot;
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {suggestions.subcategories.length > 0 && (
            <div className="search-section">
              <div className="search-section-title">
                {dictionary.subcategory}
              </div>
              <ul>
                {suggestions.subcategories.map((item) => (
                  <li key={item.id} className="search-item">
                    <Link
                      href={getLocalizedPath(`/${lang}` + item.link, lang)}
                      onClick={handleLinkClick}
                    >
                      {dictionary.productInSubcategory} &quot;
                      {lang !== 'ru' ? item.nameuk : item.nameru}&quot;
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {suggestions.countries.length > 0 && (
            <div className="search-section">
              <div className="search-section-title">
                {dictionary.countryMade}
              </div>
              <ul>
                {suggestions.countries.map((item) => (
                  <li key={item.id} className="search-item">
                    <Link
                      href={getLocalizedPath(`/${lang}` + item.link, lang)}
                      onClick={handleLinkClick}
                    >
                      {dictionary.productMade}&quot;
                      {lang !== 'ru' ? item.nameuk : item.nameru}&quot;
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {suggestions.products.length > 0 && (
            <div className="search-section">
              <div className="search-section-title">{dictionary.products}</div>
              <ul>
                {suggestions.products.map((item) => (
                  <li key={item.id} className="search-item">
                    <Link
                      href={getLocalizedPath(`/${lang}` + item.link, lang)}
                      onClick={handleLinkClick}
                    >
                      {lang !== 'ru' ? item.nameuk : item.nameru}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
