'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './PriceSelector.scss';
import UpSVG from '../../../assest/Filters/Up.svg';
import DownSVG from '../../../assest/Filters/Down.svg';
import { Slider } from '@mui/material';
import { Locale } from '@/i18n.config'; // Імпортуємо Locale
import { sortSearchParams } from './SortSerchParams';
import { getLocalizedPath } from '../../utils/getLocalizedPath';

type Props = {
  minAvailablePrice: number; // Мінімальна ціна, доступна з бекенду
  maxAvailablePrice: number; // Максимальна ціна, доступна з бекенду
  lang: Locale;
  currentSearchParams: URLSearchParams; // Поточні параметри URL
  brand?: string;
  currentPathname?: string;
  nameOpen: string;
  open: string;
  setOpen: any;
  isMob: boolean;
};

const PriceSelector = ({
  minAvailablePrice,
  maxAvailablePrice,
  lang,
  brand,
  currentPathname,
  nameOpen,
  open,
  setOpen,
  isMob,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(isMob);

  // Внутрішній стан для діапазону цін, який відображається на слайдері та в полях
  const [priceRange, setPriceRange] = useState<number[]>([minAvailablePrice, maxAvailablePrice]);

  // Референс для таймера дебаунсу
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Визначення мобільної версії
  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth >= 1024);
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Ініціалізація priceRange з URL або доступних цін при першому рендері
  // та при зміні minAvailablePrice/maxAvailablePrice або searchParams
  useEffect(() => {
    const minPriceFromUrl = parseFloat(searchParams.get('minprice') || '');
    const maxPriceFromUrl = parseFloat(searchParams.get('maxprice') || '');

    let newMin = minAvailablePrice;
    let newMax = maxAvailablePrice;

    // Якщо в URL є minprice/maxprice і вони валідні, використовуємо їх
    if (
      !isNaN(minPriceFromUrl) &&
      minPriceFromUrl >= minAvailablePrice &&
      minPriceFromUrl <= maxAvailablePrice
    ) {
      newMin = minPriceFromUrl;
    }
    if (
      !isNaN(maxPriceFromUrl) &&
      maxPriceFromUrl >= minAvailablePrice &&
      maxPriceFromUrl <= maxAvailablePrice
    ) {
      newMax = maxPriceFromUrl;
    }

    // Перевіряємо, чи min не перевищує max
    if (newMin > newMax) {
      newMin = minAvailablePrice; // Скидаємо, якщо невірний діапазон
      newMax = maxAvailablePrice;
    }

    setPriceRange([newMin, newMax]);
  }, [minAvailablePrice, maxAvailablePrice, searchParams]);

  // Функція для оновлення URL-параметрів
  const updateUrlWithPrice = useCallback(
    (minVal: number, maxVal: number) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      // Округлюємо до двох знаків після коми для URL
      const roundedMin = parseFloat(minVal.toFixed(2));
      const roundedMax = parseFloat(maxVal.toFixed(2));

      // Якщо діапазон відповідає повному доступному діапазону, видаляємо параметри
      if (roundedMin === minAvailablePrice && roundedMax === maxAvailablePrice) {
        newSearchParams.delete('minprice');
        newSearchParams.delete('maxprice');
      } else {
        newSearchParams.set('minprice', roundedMin.toString());
        newSearchParams.set('maxprice', roundedMax.toString());
      }

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
    },
    [router, searchParams, lang, minAvailablePrice, maxAvailablePrice]
  );

  // Обробник зміни слайдера (з дебаунсом)
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setPriceRange(newValue);

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      debounceTimeoutRef.current = setTimeout(() => {
        updateUrlWithPrice(newValue[0], newValue[1]);
      }, 500); // Затримка 500мс
    }
  };

  // Обробник зміни вхідних полів (з дебаунсом)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = parseFloat(e.target.value);
    let newMin = priceRange[0];
    let newMax = priceRange[1];

    if (type === 'min') {
      newMin = isNaN(value)
        ? minAvailablePrice
        : Math.max(minAvailablePrice, Math.min(value, newMax));
    } else {
      newMax = isNaN(value)
        ? maxAvailablePrice
        : Math.min(maxAvailablePrice, Math.max(value, newMin));
    }

    setPriceRange([newMin, newMax]);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    debounceTimeoutRef.current = setTimeout(() => {
      updateUrlWithPrice(newMin, newMax);
    }, 500); // Затримка 500мс
  };

  // Обробник зміни радіокнопок
  const handleRangeOptionChange = (minVal: number, maxVal: number) => {
    setPriceRange([minVal, maxVal]);
    updateUrlWithPrice(minVal, maxVal);
  };

  const toggleOpen = () => {
    setIsOpen((prev) => !prev);
    setOpen(nameOpen);
  };

  // Динамічні опції цін на основі minAvailablePrice та maxAvailablePrice
  const priceOptions = [
    {
      name: lang == 'ru' ? 'Вся цена' : 'Вся ціна',
      min: minAvailablePrice,
      max: maxAvailablePrice,
    },
    { name: lang == 'ru' ? 'Меньше 50 ₴' : 'Менше 50 ₴', min: 0, max: 50 },
    { name: '50 - 100 ₴', min: 50, max: 100 },
    { name: '100 - 200 ₴', min: 100, max: 250 },
    { name: '250 - 500 ₴', min: 200, max: 500 },
    { name: '500 - 750 ₴', min: 500, max: 750 },
    { name: '750 - 1000 ₴', min: 750, max: 1000 },
    { name: '1000 - 5000 ₴', min: 1000, max: 5000 },
    {
      name: lang == 'ru' ? 'Болле 5000 ₴' : 'Більше 5000 ₴',
      min: 5000,
      max: maxAvailablePrice,
    },
  ].filter((option) => option.min <= maxAvailablePrice && option.max >= minAvailablePrice); // Фільтруємо неактуальні опції

  // Визначення, яка радіокнопка активна
  const getSelectedRangeName = () => {
    const currentMin = parseFloat(searchParams.get('minprice') || minAvailablePrice.toString());
    const currentMax = parseFloat(searchParams.get('maxprice') || maxAvailablePrice.toString());

    const foundOption = priceOptions.find((option) => {
      // Порівнюємо з округленням, щоб уникнути проблем з плаваючою точкою
      return (
        parseFloat(option.min.toFixed(2)) === parseFloat(currentMin.toFixed(2)) &&
        parseFloat(option.max.toFixed(2)) === parseFloat(currentMax.toFixed(2))
      );
    });

    return foundOption ? foundOption.name : null;
  };

  return (
    <div className="price-selector-container">
      <div className="price-selector-header" onClick={toggleOpen}>
        <h3>{lang == 'ru' ? 'ЦЕНА' : 'ЦІНА'}</h3>
        <span className={`arrow-icon ${isOpen ? 'open' : ''}`}>
          {isOpen ? <UpSVG /> : <DownSVG />}
        </span>
      </div>
      {((isOpen && !isMobile) || nameOpen == open) && (
        <>
          <div
            className={`price-slider-container ${isMobile ? 'dropdownFilterMobile dropdown' : ''}`}
          >
            <div className="price-slider">
              <Slider
                value={priceRange}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                min={minAvailablePrice} // Використовуємо minAvailablePrice з пропсів
                max={maxAvailablePrice} // Використовуємо maxAvailablePrice з пропсів
                step={1} // Крок 1 для ціни
                disableSwap
              />
            </div>
            <div className="price-inputs">
              <input
                type="number" // Змінено на number
                placeholder={lang == 'ru' ? 'Мин' : 'Мін'}
                value={priceRange[0].toFixed(0)} // Округлюємо для відображення
                onChange={(e) => handleInputChange(e, 'min')}
              />
              <input
                type="number" // Змінено на number
                placeholder="Макс"
                value={priceRange[1].toFixed(0)} // Округлюємо для відображення
                onChange={(e) => handleInputChange(e, 'max')}
              />
            </div>
          </div>
          <ul className={`price-options ${isMobile ? 'dropdownFilterMobile dropdown' : ''}`}>
            {priceOptions.map((option, index) => (
              <li key={index} className="price-option">
                <label>
                  <input
                    type="radio"
                    name="price"
                    value={option.name}
                    checked={getSelectedRangeName() === option.name} // Використовуємо функцію для визначення checked
                    onChange={() => handleRangeOptionChange(option.min, option.max)}
                  />
                  <span className="custom-radio"></span>
                  <span className="price-option-text">{option.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default PriceSelector;
