'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

import './MySlider.scss';

import Link from 'next/link';

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
  return (
    <div className="my-swiper-container">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 10000,
          disableOnInteraction: false,
        }}
        loop={images.length > 1}
        preloadImages={false}
        lazyPreloadPrevNext={1}
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
            <SwiperSlide key={item.id}>
              {item.href ? (
                <Link
                  href={getLocalizedPath(`/${lang}/${item.href}`, lang).replace(
                    '//',
                    '/'
                  )}
                >
                  {content}
                </Link>
              ) : (
                content
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default MySlider;
