'use client';

import { useEffect, useState } from 'react';
import { Locale } from '@/i18n.config';
import Image from 'next/image';
import './MySlider.scss';

type SliderImage = {
  id: number;
  mobileImg_uk: string;
  mobileImg_ru: string;
  pcImg_ru: string;
  pcImg_uk: string;
  href: string | null;
};

export default function MySlider({
  images,
  lang,
}: {
  images: SliderImage[];
  lang: Locale;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;

    // Автоматичне гортання кожні 4 секунди
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [images]);

  if (!images || images.length === 0) return null;

  const firstSlide = images[0];
  const firstPcSrc =
    process.env.NEXT_PUBLIC_SERVER +
    (lang === 'ru' ? firstSlide.pcImg_ru : firstSlide.pcImg_uk);

  return (
    <div className="my-swiper-container">
      {/* Preload першого слайду для швидкості */}
      <link rel="preload" as="image" href={firstPcSrc} />

      <div className="custom-slider-track">
        {images.map((slide, index) => {
          const pcSrc =
            process.env.NEXT_PUBLIC_SERVER +
            (lang === 'ru' ? slide.pcImg_ru : slide.pcImg_uk);
          const mobSrc =
            process.env.NEXT_PUBLIC_SERVER +
            (lang === 'ru' ? slide.mobileImg_ru : slide.mobileImg_uk);

          // Визначаємо клас для активного слайду
          const isActive = index === currentIndex;

          const slideContent = (
            <div
              className={`custom-slide ${isActive ? 'active' : ''}`}
              key={slide.id}
            >
              <Image
                width={888}
                height={500}
                src={pcSrc}
                alt="banner"
                className="pc-img"
                priority={index === 0} // Пріоритет тільки першому
                loading={index === 0 ? 'eager' : 'lazy'}
                unoptimized
              />
              <Image
                width={400}
                height={200}
                src={mobSrc}
                alt="banner"
                className="mob-img"
                priority={index === 0}
                loading={index === 0 ? 'eager' : 'lazy'}
                unoptimized
              />
            </div>
          );

          return slide.href ? (
            <a
              href={slide.href}
              key={slide.id}
              className={`slider-link-wrapper ${isActive ? 'active' : ''}`}
            >
              {slideContent}
            </a>
          ) : (
            slideContent
          );
        })}
      </div>

      {/* Пагінація (крапки) */}
      {images.length > 1 && (
        <div className="swiper-pagination">
          {images.map((_, index) => (
            <button
              key={index}
              className={`swiper-pagination-bullet ${index === currentIndex ? 'swiper-pagination-bullet-active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
