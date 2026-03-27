import React from 'react';
import '../Goods.scss';
import { getDictionary } from '@/lib/dictionary';
import BreadCrumbs from '@/app/components/utils/BreadCrumbs';
import Sort from '@/app/components/goods/Sort/Sort';
import { GoodInterface } from '@/app/interfaces/goods';
import ListGoods from '@/app/components/goods/ListGoods';
import MyPagination from '@/app/components/MyPagination/MyPagination';
import { Locale } from '@/i18n.config'; // Імпортуємо Locale
import { notFound } from 'next/navigation';
import { UkrToEng } from '@/app/components/utils/UkrToEng';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';
import SelectGoods from '../../select-goods/[id]/SelectGoods';
import Filters from '@/app/components/goods/Filters/Filters';
import { headers } from 'next/headers';

type Props = {
  params: Promise<{ lang: Locale; slug: string[] }>;
  searchParams: Promise<any>;
};

const getDataSelectGoods = async (id: string, lang: Locale) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER}goods/getForVolumeId/${id}?lang=${lang}`,
      { cache: 'no-cache' }
    );

    if (!res.ok) {
      return notFound();
    }

    const data = await res.json();
    return data; // Повертаємо розпарсені дані (товари)
  } catch (err) {
    console.error('Fetch error:', err);
    return notFound();
  }
};

export async function generateMetadata({ params, searchParams }: Props) {
  const { lang, slug } = await params;
  const searchParams2 = await searchParams;
  if (slug.length == 0) return notFound();
  else if (slug.length == 1 && isNaN(parseInt(slug[0]))) {
    const id = slug[0];
    const baseUrl = new URL(process.env.NEXT_PUBLIC_BASE_URL!);
    const { good: product, indexVolume } = await getDataSelectGoods(id, lang); // твоя функція

    if (!product) {
      return notFound();
    }

    const volume = product.volumes[indexVolume] || product.volumes[0];

    // Title та description з урахуванням мови і мета полів, fallback на name/description
    const title =
      volume[`metaTitle${lang === 'ru' ? 'ru' : 'uk'}`] ||
      (lang === 'ru'
        ? product.nameru + ' - купить с доставкой по Украине'
        : product.nameuk + ' - купити з доставкою по Україні');

    const rawDescription =
      volume[`metaDescription${lang === 'ru' ? 'ru' : 'uk'}`] ||
      (lang === 'ru' ? product.descriptionru : product.descriptionuk) ||
      '';

    // Обрізаємо description до 200 символів без HTML тегів
    const plainDescription = rawDescription.replace(/<[^>]+>/g, '').slice(0, 200);

    const canonicalUrl = `${baseUrl}${lang === 'ru' ? 'ru/' : ''}goods/${id}`;

    // Зображення (перший img у volume)
    const imageUrl = volume.imgs?.[0]?.img
      ? `${process.env.NEXT_PUBLIC_SERVER}${volume.imgs[0].img}`
      : '';

    // SKU та бренд
    const sku = product.art || '';
    const brandName = product.brend?.name || '';

    // Категорія
    const categoryName = lang === 'ru' ? product.category.nameru : product.category.nameuk;

    // Ціна
    const price = (volume.priceWithDiscount?.toString() as number | null) || 0;

    return {
      title,
      description: plainDescription,
      metadataBase: new URL(baseUrl), // Переконайтеся, що це об'єкт URL
      alternates: {
        canonical: lang == 'ru' ? `${baseUrl}ru/goods/${id}` : `${baseUrl}goods/${id}`,
        languages: {
          'x-default': `${baseUrl}goods/${id}`,
          uk: `${baseUrl}goods/${id}`,
          ru: `${baseUrl}ru/goods/${id}`,
        },
      },
      openGraph: {
        title,
        description: plainDescription,
        url: canonicalUrl,
        type: 'website',
        siteName: 'Baylap',
        images: [
          {
            url: imageUrl, // Сюди підставиться https://... автоматично, якщо imageUrl відносний
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        locale: lang === 'ru' ? 'ru_RU' : 'uk_UA', // Корисно для SEO
      },
      // Додайте це для кращого відображення всюди
      twitter: {
        card: 'summary_large_image',
        images: [imageUrl],
      },
    };
  } else {
    const pageStr = slug.pop() as string;
    const { miniGoods } = await getDictionary(lang);
    const page = Number(pageStr);
    if (isNaN(page)) return notFound();
    // Перетворюємо searchParams в URLSearchParams для зручності
    const currentSearchParams = new URLSearchParams();
    for (const key in searchParams2) {
      const value = searchParams2[key];
      if (Array.isArray(value)) {
        value.forEach((v) => currentSearchParams.append(key, v));
      } else if (value !== undefined) {
        currentSearchParams.set(key, value);
      }
    }
    let category: string = '';
    if (slug.length > 0) {
      category = slug[0];
    }
    let subcategory: string = '';
    if (slug.length > 1) {
      subcategory = slug[1];
    }

    const {
      goods: data,
      totalGoods,
      totalPages,
      filters,
      selectCategory,
      selectSubcategory,
    }: {
      goods: GoodInterface[];
      totalGoods: number;
      totalPages: number;
      filters: any;
      selectCategory?: any;
      selectSubcategory?: any;
    } = await getData(
      pageStr,
      limit,
      currentSearchParams,
      category,
      subcategory,
      lang == 'ru' ? 'uk' : 'ru',
      lang,
      false
    ); // Передаємо currentSearchParams

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const urlPath = lang === 'ua' ? '' : '/ru';

    // Створюємо рядок параметрів, якщо вони існують
    const searchParamsString = new URLSearchParams(
      searchParams2 as Record<string, string>
    ).toString();

    const canonicalUrl = `${baseUrl}${urlPath}/goods/${slug.join('/')}/1`.replace('//1', '/1');
    const uaUrl = `${baseUrl}/goods/${slug.join('/')}/${page}`.replace(`//${page}`, `/${page}`);
    const ruUrl = `${baseUrl}/ru/goods/${slug.join('/')}/${page}`.replace(`//${page}`, `/${page}`);

    const getName = (item: any, lang: 'ua' | 'ru') =>
      item ? item[`name${lang == 'ru' ? 'ru' : 'uk'}`] : '';
    let titles: { ua: string; ru: string };
    let descriptions: { ua: string; ru: string };

    if (selectCategory && !selectSubcategory) {
      titles = {
        ua: `${selectCategory.nameuk} - купити в Україні за найкращою ціною | BayLap`,
        ru: `${selectCategory.nameru} - купить в Украине по лучшей цене | BayLap`,
      };
      descriptions = {
        ua: `${selectCategory.nameuk} від інтернет-магазину BayLap. Великий асортимент, замовити продукцію у наявності з доставкою по всій Україні`,
        ru: `${selectCategory.nameru} от интернет-магазина BayLap. Большой каталог, заказать продукцию в наличии с доставкой по всей Украине`,
      };
    } else if (selectSubcategory) {
      titles = {
        ua: `${selectSubcategory.nameuk} - купити в Україні за найкращою ціною | BayLap`,
        ru: `${selectSubcategory.nameru} - купить в Украине по лучшей цене | BayLap`,
      };
      descriptions = {
        ua: `${selectSubcategory.nameuk} від інтернет-магазину BayLap. Великий асортимент, замовити продукцію у наявності з доставкою по всій Україні`,
        ru: `${selectSubcategory.nameru} от интернет-магазина BayLap. Большой каталог, заказать продукцию в наличии с доставкой по всей Украине`,
      };
    } else {
      titles = {
        ua: `Каталог товарів — сторінка ${page} | Baylap`,
        ru: `Каталог товаров — страница ${page} | Baylap`,
      };
      descriptions = {
        ua: `Перегляньте сторінку ${page} каталогу товарів інтернет-магазину Baylap.`,
        ru: `Посмотрите страницу ${page} каталога товаров интернет-магазина Baylap.`,
      };
    }
    const queryString = searchParamsString ? `?${searchParamsString}` : '';
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
      openGraph: {
        title: titles[lang] || titles.ua,
        description: descriptions[lang] || descriptions.ua,
        url: canonicalUrl,
        type: 'website',
        siteName: 'Baylap',
      },
      robots: {
        index: isIndexAndFollow,
        follow: isIndexAndFollow,
        googleBot: {
          index: isIndexAndFollow,
          follow: isIndexAndFollow,
        },
      },
    };
  }
}

const limit = 20;

// Оновлена функція getData для прийому searchParams
const getData = async (
  page: string,
  limit: number = 20,
  searchParams: URLSearchParams,
  category: string,
  subcategory: string,
  delLeng: 'uk' | 'ru',
  lang: Locale,
  isCatalog: boolean
) => {
  try {
    // Формуємо рядок запиту з searchParams
    const queryParams = new URLSearchParams(searchParams);
    queryParams.set('page', page); // Встановлюємо поточну сторінку
    queryParams.set('limit', limit.toString()); // Встановлюємо ліміт
    if (category) queryParams.set('category', category);
    if (subcategory) queryParams.set('subcategory', subcategory);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER}goods/get?${queryParams.toString()}&delLeng=${delLeng}&isLeaveCategoryAndSubcategory=true`,
      { cache: 'no-cache' }
    );

    if (!res.ok) {
      return notFound();
    }
    const data = await res.json();
    const {
      filters,
      totalGoods,
      totalPages,
      realNameBrend,
      selectCategory,
      selectSubcategory,
      realDescriptionBrend,
    } = data;

    const goods = data.goods.map((x: any) => ({
      id: x.id,
      [`name${lang == 'ru' ? 'ru' : 'uk'}`]: x[`name${lang == 'ru' ? 'ru' : 'uk'}`],
      isDiscount: x.isDiscount,
      isBestseller: x.isBestseller,
      isNovetly: x.isNovetly,
      isHit: x.isHit,
      isFreeDelivery: x.isFreeDelivery,
      [`nameType${lang == 'ru' ? 'ru' : 'uk'}`]: x[`nameType${lang == 'ru' ? 'ru' : 'uk'}`],
      volumes: x.volumes.map((volume: any) => ({
        id: volume.id,
        nameVolume: volume.nameVolume,
        volume: volume.volume,
        price: volume.price,
        discount: volume.discount,
        priceWithDiscount: volume.priceWithDiscount,
        isAvailability: volume.isAvailability,
        url: volume.url,
        isFreeDelivery: volume.isFreeDelivery,
        art: volume.art,
        imgs: volume.imgs,
      })),
    }));

    return {
      filters,
      totalGoods,
      goods,
      totalPages,
      realNameBrend,
      selectCategory,
      selectSubcategory,
      realDescriptionBrend,
    };
  } catch (err) {
    console.error('Fetch error:', err);
    return { goods: [], totalGoods: 0, totalPages: 0, filters: {} }; // Повертаємо порожні дані у випадку помилки
  }
};

const Page = async ({ params, searchParams }: Props) => {
  const { slug, lang } = await params;
  const searchParams2 = await searchParams;
  if (slug.length == 0) return notFound();
  else if (isNaN(parseInt(slug[0])) && slug.length == 1) {
    return <SelectGoods params={{ lang: lang, id: slug[0] }} searchParams={{}} />;
  }
  const pageStr = slug.pop() as string;
  const { miniGoods } = await getDictionary(lang);
  const page = Number(pageStr);
  if (isNaN(page)) return notFound();
  // Перетворюємо searchParams в URLSearchParams для зручності
  const currentSearchParams = new URLSearchParams();
  for (const key in searchParams2) {
    const value = searchParams2[key];
    if (Array.isArray(value)) {
      value.forEach((v) => currentSearchParams.append(key, v));
    } else if (value !== undefined) {
      currentSearchParams.set(key, value);
    }
  }
  let category: string = '';
  if (slug.length > 0) {
    category = slug[0];
  }
  let subcategory: string = '';
  if (slug.length > 1) {
    subcategory = slug[1];
  }

  const {
    goods: data,
    totalGoods,
    totalPages,
    filters,
    selectCategory,
    selectSubcategory,
  }: {
    goods: GoodInterface[];
    totalGoods: number;
    totalPages: number;
    filters: any;
    selectCategory?: any;
    selectSubcategory?: any;
  } = await getData(
    pageStr,
    limit,
    currentSearchParams,
    category,
    subcategory,
    lang == 'ru' ? 'uk' : 'ru',
    lang,
    true
  ); // Передаємо currentSearchParams

  const listUrles = [
    {
      name: lang == 'ru' ? 'каталог' : 'каталог',
      url: getLocalizedPath(`/goods/1`, lang),
    },
  ];

  if (selectCategory && selectCategory[`name${lang == 'ru' ? 'ru' : 'uk'}`]) {
    listUrles.push({
      name: selectCategory[`name${lang == 'ru' ? 'ru' : 'uk'}`],
      url: getLocalizedPath(`/${lang}/goods/${UkrToEng(selectCategory.nameru)}/1`, lang),
    });
  }
  1;
  if (selectSubcategory) {
    listUrles.push({
      name: selectSubcategory[`name${lang == 'ru' ? 'ru' : 'uk'}`],
      url: ``,
    });
  }
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';

  // Проста перевірка на мобільний пристрій
  const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);

  return (
    <div className="goods-container">
      <BreadCrumbs lang={lang} listUrles={listUrles} />
      <div className="goods-main">
        {/* Передаємо фільтри, отримані з бекенду, та поточні searchParams */}
        <Filters
          filters={filters}
          lang={lang}
          currentSearchParams={currentSearchParams}
          currentPathname={`/${lang}/goods/${slug.join('/')}`}
          isMob={isMobile}
        />
        <div className="sore-and-goods">
          {selectSubcategory ? (
            <h1>{selectSubcategory[`name${lang == 'ru' ? 'ru' : 'uk'}`]}</h1>
          ) : selectCategory ? (
            <h1>{selectCategory[`name${lang == 'ru' ? 'ru' : 'uk'}`]}</h1>
          ) : (
            <h1>{lang == 'ru' ? 'Каталог товаров' : 'Каталог товарів'}</h1>
          )}
          <Sort lang={lang} />
          <br />
          <ListGoods data={data} isFilter={true} lang={lang} dictionary={miniGoods} />
          {totalPages > 1 && (
            <MyPagination
              totalPages={totalPages}
              currentPage={parseInt(pageStr)}
              currentPathname={`/${lang}/goods/${slug.join('/')}`}
              currentSearchParams={currentSearchParams} // Передаємо очищені searchParams
              lang={lang}
            />
          )}
        </div>
      </div>

      {!selectSubcategory &&
        selectCategory &&
        page == 1 &&
        selectCategory[`description${lang == 'ru' ? 'ru' : 'uk'}`] && (
          <p
            className="desc"
            dangerouslySetInnerHTML={{
              __html: selectCategory[`description${lang == 'ru' ? 'ru' : 'uk'}`],
            }}
          />
        )}
      {selectSubcategory &&
        page == 1 &&
        selectSubcategory[`description${lang == 'ru' ? 'ru' : 'uk'}`] && (
          <p
            className="desc"
            dangerouslySetInnerHTML={{
              __html: selectSubcategory[`description${lang == 'ru' ? 'ru' : 'uk'}`],
            }}
          />
        )}
    </div>
  );
};

export default Page;
