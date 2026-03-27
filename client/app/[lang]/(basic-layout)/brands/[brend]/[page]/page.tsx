import React from 'react';
import '../Goods.scss';
import { getDictionary } from '@/lib/dictionary';
import BreadCrumbs from '@/app/components/utils/BreadCrumbs';
import Sort from '@/app/components/goods/Sort/Sort';
import { GoodInterface } from '@/app/interfaces/goods';
import ListGoods from '@/app/components/goods/ListGoods';
import MyPagination from '@/app/components/MyPagination/MyPagination';
import { Locale } from '@/i18n.config'; // Імпортуємо Locale
import { Metadata } from 'next';
import IsAdmin from '@/app/components/utils/IsAdmin';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';
import Filters from '@/app/components/goods/Filters/Filters';
import { headers } from 'next/headers';

type Props = {
  params: Promise<{ lang: Locale; page: string; brend: string }>;
  // searchParams ТЕЖ має бути Promise
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  //const { lang } = await params;
  const resolvedSearchParams = await searchParams; // Це тепер реальний об'єкт
  // Перетворюємо searchParams в URLSearchParams для зручності
  const currentSearchParams = new URLSearchParams();
  for (const key in resolvedSearchParams) {
    const value = resolvedSearchParams[key];
    if (Array.isArray(value)) {
      value.forEach((v) => currentSearchParams.append(key, v));
    } else if (value !== undefined) {
      currentSearchParams.set(key, value);
    }
  }

  const { lang, brend, page } = await params;

  const {
    goods: data,
    totalGoods,
    totalPages,
    filters,
    realNameBrend,
  }: {
    goods: GoodInterface[];
    totalGoods: number;
    totalPages: number;
    filters: any;
    realNameBrend: string;
  } = await getData(page, limit, currentSearchParams, brend, lang == 'ru' ? 'uk' : 'ru', lang);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const urlPath = lang === 'ua' ? '' : '/ru';

  // Створюємо рядок параметрів, якщо вони існують
  const searchParamsString = currentSearchParams.toString();
  const queryString = searchParamsString ? `?${searchParamsString}` : '';

  // Формуємо повну канонічну URL з параметрами
  const canonicalUrl = `${baseUrl}${urlPath}/brands/${brend}/${1}`;
  const uaUrl = `${baseUrl}/brands/${brend}/${page}`;
  const ruUrl = `${baseUrl}/ru/brands/${brend}/${page}`;

  // Локалізовані тексти
  const titles = {
    ua: `${realNameBrend}. Купити косметику ${realNameBrend}`,
    ru: `${realNameBrend}. Купить косметику ${realNameBrend}`,
  };

  const descriptions = {
    ua: `Вся лінійка продукції ${realNameBrend}. Великий каталог, ціни на косметику ${realNameBrend} в інтернет-магазині в Харкові, Києві`,
    ru: ` Вся линейка продукции ${realNameBrend}. Большой каталог, цены на косметику ${realNameBrend} в интернет-магазине в Харькове, Киеве`,
  };
  const isIndexAndFollow = queryString.toString() == '';

  return {
    title: titles[lang] || titles.ua,
    description: descriptions[lang] || descriptions.ua,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': uaUrl,
        uk: uaUrl,
        ru: ruUrl,
      },
    },
    robots: {
      index: isIndexAndFollow,
      follow: isIndexAndFollow,
      googleBot: {
        index: isIndexAndFollow,
        follow: isIndexAndFollow,
      },
    },
    openGraph: {
      title: titles[lang] || titles.ua,
      description: descriptions[lang] || descriptions.ua,
      url: canonicalUrl,
      type: 'website',
      siteName: 'Baylap',
    },
  };
}

const limit = 20;

// Оновлена функція getData для прийому searchParams
const getData = async (
  page: string,
  limit: number = 20,
  searchParams: URLSearchParams,
  brendName: string,
  delLeng: 'uk' | 'ru',
  lang: Locale
) => {
  try {
    // Формуємо рядок запиту з searchParams
    const queryParams = new URLSearchParams(searchParams);
    queryParams.set('page', page); // Встановлюємо поточну сторінку
    queryParams.set('limit', limit.toString()); // Встановлюємо ліміт

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER}goods/get?brendName=${brendName}&${queryParams.toString()}&delLeng=${delLeng}`,
      { cache: 'no-cache' }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    const { totalGoods, totalPages, filters, realNameBrend, realDescriptionBrend } = data;
    const goods = data.goods.map((x: any) => ({
      id: x.id,
      [`name${lang == 'ru' ? 'ru' : 'uk'}`]: x[`name${lang == 'ru' ? 'ru' : 'uk'}`],
      isDiscount: x.isDiscount,
      isBestseller: x.isBestseller,
      isNovetly: x.isNovetly,
      isHit: x.isHit,
      isFreeDelivery: x.isFreeDelivery,
      [`nameType${lang == 'ru' ? 'ru' : 'uk'}`]: x[`nameType${lang == 'ru' ? 'ru' : 'uk'}`],
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
    return {
      totalGoods,
      totalPages,
      filters,
      realNameBrend,
      realDescriptionBrend,
      goods,
    };
  } catch (err) {
    console.error('Fetch error:', err);
    return {
      goods: [],
      totalGoods: 0,
      totalPages: 0,
      filters: {},
      realNameBrend: '',
      realDescriptionBrend: '',
    }; // Повертаємо порожні дані у випадку помилки
  }
};

const Page = async ({ params, searchParams }: Props) => {
  const { lang, page, brend } = await params;
  const { miniGoods } = await getDictionary(lang);
  const resolvedSearchParams = await searchParams; // Це тепер реальний об'єкт

  // Перетворюємо searchParams в URLSearchParams для зручності
  const currentSearchParams = new URLSearchParams();
  for (const key in resolvedSearchParams) {
    const value = resolvedSearchParams[key];
    if (Array.isArray(value)) {
      value.forEach((v) => currentSearchParams.append(key, v));
    } else if (value !== undefined) {
      currentSearchParams.set(key, value);
    }
  }

  const {
    goods: data,
    totalGoods,
    totalPages,
    filters,
    realNameBrend,
    realDescriptionBrend,
  }: {
    goods: GoodInterface[];
    totalGoods: number;
    totalPages: number;
    filters: any;
    realNameBrend: string;
    realDescriptionBrend: string | null;
  } = await getData(page, limit, currentSearchParams, brend, lang == 'ru' ? 'uk' : 'ru', lang); // Передаємо currentSearchParams

  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';

  // Проста перевірка на мобільний пристрій
  const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);

  return (
    <div className="goods-container">
      <BreadCrumbs
        lang={lang}
        listUrles={[
          {
            name: lang == 'ru' ? 'бренды' : 'бренди',
            url: getLocalizedPath(`/${lang}/brands`, lang),
          },
          {
            name: realNameBrend,
            url: getLocalizedPath(`/${lang}/brands/${brend}/1`, lang),
          },
        ]}
      />
      <div className="goods-main">
        {/* Передаємо фільтри, отримані з бекенду, та поточні searchParams */}
        <Filters
          filters={filters}
          lang={lang}
          currentSearchParams={currentSearchParams}
          noBrands
          brand={brend}
          realName={realNameBrend}
          isMob={isMobile}
        />
        <div className="sore-and-goods">
          <h1>{realNameBrend}</h1>

          <IsAdmin>
            <div style={{ fontSize: '15px', fontWeight: '400' }}>
              {totalGoods} товаров
              <br />
              <br />
            </div>
          </IsAdmin>
          <Sort brend={brend} lang={lang} />
          <br />

          <ListGoods data={data} isFilter={true} lang={lang} dictionary={miniGoods} />
          {totalPages > 1 && (
            <MyPagination
              totalPages={totalPages}
              currentPage={parseInt(page)}
              currentPathname={`/${lang}/brands/${brend}`}
              currentSearchParams={currentSearchParams} // Передаємо очищені searchParams
              lang={lang}
            />
          )}
        </div>
      </div>
      {realDescriptionBrend && page == '1' && (
        <p className="desc" dangerouslySetInnerHTML={{ __html: realDescriptionBrend }} />
      )}
    </div>
  );
};

export default Page;
