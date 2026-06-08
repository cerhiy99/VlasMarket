'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import './MySlider.scss';

import { getLocalizedPath } from '../utils/getLocalizedPath';
import { Locale } from '@/i18n.config';

type SliderImage = {
  id: number;
  mobileImg_uk: string;
  mobileImg_ru: string;
  pcImg_ru: string;
  pcImg_uk: string;
  href: string | null;
};

const getUrl = (item: SliderImage, lang: Locale, type: 'mobile' | 'pc') => {
  const key =
    type === 'mobile'
      ? `mobileImg_${lang === 'ru' ? 'ru' : 'uk'}`
      : `pcImg_${lang === 'ru' ? 'ru' : 'uk'}`;

  return process.env.NEXT_PUBLIC_SERVER + item[key];
};

const MySlider = ({
  images,
  lang,
}: {
  images: SliderImage[];
  lang: Locale;
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const current = images[currentSlide];
  const next = images[(currentSlide + 1) % images.length];

  // авто-слайд
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [images.length]);

  // preload next slide (ВАЖНО)
  useEffect(() => {
    if (!next) return;

    const img = new Image();
    img.src = getUrl(next, lang, 'pc');

    const mobile = new Image();
    mobile.src = getUrl(next, lang, 'mobile');
  }, [currentSlide]);

  const renderSlide = (item: SliderImage, idx: number, isActive: boolean) => {
    if (!item) return null;

    const mobileUrl = getUrl(item, lang, 'mobile');
    const desktopUrl = getUrl(item, lang, 'pc');

    const content = (
      <picture>
        <source media="(max-width: 768px)" srcSet={mobileUrl} />
        <img
          src={desktopUrl}
          alt={`Slide ${idx + 1}`}
          loading={isActive ? 'eager' : 'lazy'}
          fetchPriority={isActive ? 'high' : 'low'}
          className="slider-image"
        />
      </picture>
    );

    return (
      <div
        className="swiper-slide"
        style={{ flex: '0 0 100%' }}
        key={item.id}
      >
        {item.href ? (
          <Link
            href={getLocalizedPath(`/${lang}/${item.href}`, lang).replace('//', '/')}
          >
            {content}
          </Link>
        ) : (
          content
        )}
      </div>
    );
  };

  return (
    <div className="my-swiper-container">
      <div className="swiper">
        <div
          className="swiper-wrapper"
          style={{
            display: 'flex',
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: 'transform 0.5s ease',
          }}
        >
          {renderSlide(current, currentSlide, true)}
        </div>
      </div>

      {images.length > 1 && (
        <div className="swiper-pagination">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              className={
                currentSlide === index
                  ? 'swiper-pagination-bullet swiper-pagination-bullet-active'
                  : 'swiper-pagination-bullet'
              }
              onClick={() => setCurrentSlide(index)}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MySlider;