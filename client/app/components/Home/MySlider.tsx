'use client';

import { useEffect, useState } from 'react';
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

const MySlider = ({
  images,
  lang,
}: {
  images: SliderImage[];
  lang: Locale;
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="my-swiper-container">
      <div className="swiper">
        <div
          className="swiper-wrapper"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {images.map((item, idx) => {
            const mobileUrl =
              process.env.NEXT_PUBLIC_SERVER +
              item[`mobileImg_${lang === 'ru' ? 'ru' : 'uk'}`];

            const desktopUrl =
              process.env.NEXT_PUBLIC_SERVER +
              item[`pcImg_${lang === 'ru' ? 'ru' : 'uk'}`];

            const content = (
              <picture>
                <source media="(max-width: 768px)" srcSet={mobileUrl} />

                <img
                  src={desktopUrl}
                  alt={`Slide ${idx + 1}`}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  fetchPriority={idx === 0 ? 'high' : 'low'}
                  className="slider-image"
                />
              </picture>
            );

            return (
              <div className="swiper-slide" key={item.id}>
                {item.href ? (
                  <Link
                    href={getLocalizedPath(
                      `/${lang}/${item.href}`,
                      lang
                    ).replace('//', '/')}
                  >
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </div>
            );
          })}
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
