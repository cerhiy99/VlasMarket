import { Locale } from '@/i18n.config';
import SliderClient from './SliderClient'; // Створимо нижче
import './MySlider.scss'

type SliderImage = { id: number; mobileImg_uk: string; mobileImg_ru: string; pcImg_ru: string; pcImg_uk: string; href: string | null; };

export default function MySlider({ images, lang }: { images: SliderImage[], lang: Locale }) {
  if (!images || images.length === 0) return null;

  const firstSlide = images[0];

  return (
    <div className="my-swiper-container">
      <link
        rel="preload"
        as="image"
        href={process.env.NEXT_PUBLIC_SERVER + images[0][`pcImg_${lang=='ru'?'ru':'uk'}`]}
        fetchpriority="high"
      />
      <div className="swiper">
        <div className="swiper-wrapper">
          {/* Рендеримо перший слайд статично для миттєвого відображення */}
          <div className="swiper-slide" style={{ flex: '0 0 100%' }}>
            <img 
              src={process.env.NEXT_PUBLIC_SERVER + (lang === 'ru' ? firstSlide.pcImg_ru : firstSlide.pcImg_uk)} 
              alt="banner" 
              className="pc-img"
            />
            {/* Додайте аналогічно мобільну версію, якщо потрібно */}
          </div>
        </div>
      </div>
      
      {/* Клієнтська логіка для перемикання слайдів */}
      <SliderClient images={images} lang={lang} />
    </div>
  );
}