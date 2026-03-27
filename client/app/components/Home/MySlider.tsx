'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import './MySlider.scss';

import { Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';
import Link from 'next/link';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { Locale } from '@/i18n.config';

const MySlider = ({
  images,
  lang,
}: {
  images: {
    id: number;
    mobileImg_uk: string;
    mobileImg_ru: string;
    href: string | null;
    pcImg_ru: string;
    pcImg_uk: string;
  }[];
  lang: Locale;
}) => {
  return (
    <div className="my-swiper-container">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 10000, // Автоматичне перемикання кожні 10 секунд
          disableOnInteraction: false, // Слайдер продовжує автоплей після взаємодії
        }}
      >
        {images.map((x, idx) => (
          <SwiperSlide key={idx}>
            {!x.href ? (
              <>
                <Image
                  style={{ objectFit: 'cover' }}
                  src={
                    process.env.NEXT_PUBLIC_SERVER + x[`mobileImg_${lang == 'ru' ? 'ru' : 'uk'}`]
                  }
                  fill
                  alt={`Slide ${idx + 1}`}
                  className="mob-img"
                  priority={idx === 0}
                  unoptimized={true}
                />
                <Image
                  style={{ objectFit: 'cover' }}
                  src={process.env.NEXT_PUBLIC_SERVER + x[`pcImg_${lang == 'ru' ? 'ru' : 'uk'}`]}
                  fill
                  alt={`Slide ${idx + 1}`}
                  className="pc-img"
                  priority={idx === 0}
                  unoptimized={true}
                />
              </>
            ) : (
              <Link href={getLocalizedPath(`/${lang}/${x.href}`, lang).replace('//', '/')}>
                <Image
                  style={{ objectFit: 'cover' }}
                  src={
                    process.env.NEXT_PUBLIC_SERVER + x[`mobileImg_${lang == 'ru' ? 'ru' : 'uk'}`]
                  }
                  fill
                  alt={`Slide ${idx + 1}`}
                  className="mob-img"
                  priority={idx === 0}
                  unoptimized={true}
                />
                <Image
                  style={{ objectFit: 'cover' }}
                  src={process.env.NEXT_PUBLIC_SERVER + x[`pcImg_${lang == 'ru' ? 'ru' : 'uk'}`]}
                  fill
                  alt={`Slide ${idx + 1}`}
                  className="pc-img"
                  priority={idx === 0}
                  unoptimized={true}
                />
              </Link>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MySlider;
