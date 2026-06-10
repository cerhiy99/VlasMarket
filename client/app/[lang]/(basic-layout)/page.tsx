import React from 'react';
import './App.scss';
import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import MySlider from '@/app/components/Home/MySlider';
import ListArticle from '@/app/components/Home/ListGoods';
import './Home.scss';
import MiniBlog from '@/app/components/Blog/MiniBlog';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';
import Link from 'next/link';
import CatalogHome from '@/app/components/Home/CatalogHome';
import Brends from '@/app/components/Home/Brends';
import CategoryHome from '@/app/components/Home/CategoryHome';

type Props = {
  params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const urlPath = lang === 'ua' ? '/' : '/ru';
  const canonicalUrl = `${baseUrl}${urlPath}`;

  const titles = {
    ua: 'Інтернет-магазин VlasMarket — шампуні та засоби догляду',
    ru: 'Интернет-магазин VlasMarket — шампуни и средства ухода',
  };

  const descriptions = {
    ua: 'VlasMarket - інтернет-магазин професійної косметики для волосся, нігтів, обличчя та тіла. Тільки оригінальна продукція',
    ru: 'VlasMarket - интернет-магазин профессиональной косметики для волос, ногтей, лица и тела. Только оригинальна продукция',
  };

  return {
    title: titles[lang] || titles.ua,
    description: descriptions[lang] || descriptions.ua,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': `${baseUrl}/`,
        uk: `${baseUrl}/`,
        ru: `${baseUrl}/ru`,
      },
    },
    openGraph: {
      title: titles[lang] || titles.ua,
      description: descriptions[lang] || descriptions.ua,
      url: canonicalUrl,
      type: 'website',
      siteName: 'VlasMarket',
    },
  };
}

const getBlog = async (lang: Locale) => {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_SERVER + `blog/get?page=1&limit=5`,
      {
        next: { revalidate: 600 },
      }
    );
    if (!res.ok) {
      return { blog: [] };
    }
    const data = await res.json();
    const blog = data.blog.map((x: any) => ({
      id: x.id,
      img: x.img,
      url: x.url,
      [`name${lang == 'ru' ? 'ru' : 'uk'}`]:
        x[`name${lang == 'ru' ? 'ru' : 'uk'}`],
      [`description${lang == 'ru' ? 'ru' : 'uk'}`]: x[
        `description${lang == 'ru' ? 'ru' : 'uk'}`
      ].slice(0, 600),
      createdAt: x.createdAt,
    }));
    return blog;
  } catch (err) {
    return { blog: [] };
  }
};

const getBaners = async () => {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_API_SERVER + 'slides/get', {
      next: { revalidate: 60*60*12 },
    });
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return data.slides;
  } catch (err) {
    return [];
  }
};

const getGoods = async (query: string, delLeng: 'uk' | 'ru', lang: Locale) => {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_SERVER +
        `goods/get?page=1&limit=5&delLeng=${delLeng}&${query}`,
      { cache: 'no-cache' }
    );
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    const goods = data.goods.map((x: any) => ({
      id: x.id,
      [`name${lang == 'ru' ? 'ru' : 'uk'}`]:
        x[`name${lang == 'ru' ? 'ru' : 'uk'}`],
      isDiscount: x.isDiscount,
      isBestseller: x.isBestseller,
      isNovetly: x.isNovetly,
      isHit: x.isHit,
      isFreeDelivery: x.isFreeDelivery,
      [`nameType${lang == 'ru' ? 'ru' : 'uk'}`]:
        x[`nameType${lang == 'ru' ? 'ru' : 'uk'}`],
      volumes: x.volumes.map((j: any) => ({
        id: j.id,
        nameVolume: j.nameVolume,
        volume: j.volume,
        price: j.price,
        discount: j.discount,
        priceWithDiscount: j.priceWithDiscount,
        isAvailability: j.isAvailability,
        url: j.url,
        isFreeDelivery: j.isFreeDelivery,
        art: j.art,
        imgs: j.imgs,
      })),
    }));
    return goods;
  } catch (err) {
    return [];
  }
};

const getFullCatalog = async (lang: Locale) => {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_SERVER +
        'category/getCategoryAndSubcategoryWithProduct?lang=' +
        lang,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 * 60 * 12 }, // якщо використовуєш Next.js 13+ (app router) з кешуванням
      }
    );

    if (!res.ok) {
      throw new Error('Помилка при завантаженні категорій');
    }

    const data = await res.json();
    return data.category;
  } catch (err) {
    console.error('Помилка запиту getFull:', err);
    return null;
  }
};

const getBrends = async () => {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_SERVER + 'brend/brendWithImgs',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache', // якщо використовуєш Next.js 13+ (app router) з кешуванням
      }
    );
    const data = await res.json();

    return data.brends;
  } catch (err) {
    console.error('Помилка запиту getBrends:', err);
    return null;
  }
};

const getSubcategory = async (lang: Locale) => {
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_SERVER +
        'category/getCategoryAndSubcategoryWithProduct?lang=' +
        lang,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 * 60 * 12 }, // якщо використовуєш Next.js 13+ (app router) з кешуванням
      }
    );

    if (!res.ok) {
      throw new Error('Помилка при завантаженні категорій');
    }
    const data = await res.json();

    const getSubcategories = (data: { category?: any }) => {
      return (
        data.category?.flatMap(
          (cat: any) =>
            cat.subcategories?.map((sub: any) => ({
              ...sub,
              categoryNameRu: cat.nameru,
            })) ?? []
        ) ?? []
      );
    };

    const result = getSubcategories(data);

    return result;
  } catch (err) {
    console.error('Помилка запиту getSubcategory:', err);
    return null;
  }
};

const page = async ({ params }: Props) => {
  const { lang } = await params;
  const { home, miniGoods, header } = await getDictionary(lang);
  const category = await getSubcategory(lang);
  const blog = await getBlog(lang);
  const slides = await getBaners();
  const discount = await getGoods(
    'isDiscount=true',
    lang == 'ru' ? 'uk' : 'ru',
    lang
  );
  const fullCatalog = await getFullCatalog(lang);
  const hit = await getGoods('isHit=true', lang == 'ru' ? 'uk' : 'ru', lang);
  const novetly = await getGoods(
    'isNovetly=true',
    lang == 'ru' ? 'uk' : 'ru',
    lang
  );
  const brends = await getBrends();

  return (
    <>
      <div className="home-container">
        <div className="slider-with-catalog">
          {slides.length > 0 && <MySlider lang={lang} images={slides} />}

          <CatalogHome
            lang={lang}
            dictionary={header.catalog}
            catalog={fullCatalog}
          />
        </div>
        <div className="home-goods">
          <CategoryHome categories={category} lang={lang} />
          <Brends lang={lang} brends={brends} />
          <h2>{home.title1}</h2>
          <ListArticle
            lang={lang}
            dictionary={miniGoods}
            type="discount"
            query="isDiscount"
            startGoods={discount}
          />
          <h2 className="add-margin">{home.title2}</h2>
          <ListArticle
            lang={lang}
            dictionary={miniGoods}
            type="top"
            query="isHit"
            startGoods={hit}
          />
          <h2 className="add-margin">{home.title3}</h2>
          <ListArticle
            lang={lang}
            dictionary={miniGoods}
            type="novetly"
            query="isNovetly"
            startGoods={novetly}
          />
          <div className="row-blog">
            <div className="row">
              <h2 className="add-margin">Блог</h2>
              <Link href={getLocalizedPath(`/${lang}/blog/1`, lang)}>
                <p>
                  {lang == 'ru' ? 'Все статьи' : 'Всі статті'}
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.625 11.25L9.375 7.5L5.625 3.75"
                      stroke="black"
                      stroke-width="1.25"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </p>
              </Link>
            </div>
            <div className="list-blog">
              {blog.map((x: any) => (
                <MiniBlog key={x.id} blog={x} lang={lang} />
              ))}
            </div>
          </div>
          <div className="main-text">
            <h1 style={{ margin: 0 }}>{home.titleMain}</h1>
            <p>{home.description}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default page;
