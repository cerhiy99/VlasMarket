'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './MySlider.scss';

import { getLocalizedPath } from '../utils/getLocalizedPath';
import { Locale } from '@/i18n.config';
import ImageNext from 'next/image';

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

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [images.length]);

  // preload next (залишаємо обов'язково)
  useEffect(() => {
    if (!next) return;

    new Image().src = getUrl(next, lang, 'pc');
    new Image().src = getUrl(next, lang, 'mobile');
  }, [currentSlide]);

  const renderSlide = (item: SliderImage, idx: number, isActive: boolean) => {
    const mobileUrl = getUrl(item, lang, 'mobile');
    const desktopUrl = getUrl(item, lang, 'pc');

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
            <div className="img-wrap">
              {/* DESKTOP */}
              <ImageNext
                fill
                src={desktopUrl}
                alt="baner"
                className={`pc-img ${isActive ? 'active' : ''}`}
                loading={isActive ? 'eager' : 'lazy'}
                unoptimized
              />

              {/* MOBILE */}
              <ImageNext
                fill
                src={mobileUrl}
                alt="baner"
                className={`mob-img ${isActive ? 'active' : ''}`}
                loading="lazy"
                unoptimized
              />
            </div>
          </Link>
        ) : (
          <div className="img-wrap">
            <img
              src={desktopUrl}
              className={`pc-img ${isActive ? 'active' : ''}`}
              loading={isActive ? 'eager' : 'lazy'}
            />

            <img
              src={mobileUrl}
              className={`mob-img ${isActive ? 'active' : ''}`}
              loading="lazy"
            />
          </div>
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
          {images.map((item, idx) =>
            renderSlide(item, idx, idx === currentSlide)
          )}
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MySlider;