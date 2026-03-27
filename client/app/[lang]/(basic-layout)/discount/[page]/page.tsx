import { Locale } from '@/i18n.config';
import React from 'react';
import './Discount.scss';
import { getDictionary } from '@/lib/dictionary';
import BreadCrumbs from '@/app/components/utils/BreadCrumbs';
import Sort from '@/app/components/goods/Sort/Sort';
import { GoodInterface } from '@/app/interfaces/goods';
import ListGoods from '@/app/components/goods/ListGoods';
import dynamic from 'next/dynamic';
import MyPagination from '@/app/components/MyPagination/MyPagination';

type Props = {
  params: Promise<{ lang: Locale; page: string }>;
  searchParams: Promise<any>;
};

export async function generateMetadata({ params }: Props) {
  const { lang, page } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const urlPath = lang === 'ua' ? '' : '/ru';
  const canonicalUrl = `${baseUrl}${urlPath}/discount/${page}`;

  const titles = {
    ua: `Акційні товари від інтернет-магазину Baylap`,
    ru: `Акционные товары —  от интернет-магазина Baylap`,
  };

  const descriptions = {
    ua: `Каталог акційних товарів та спецпропозицій від інтернет-магазину Baylap.`,
    ru: `Каталог акционных товаров и спецпредложений от интернет-магазина Baylap.`,
  };

  return {
    title: titles[lang] || titles.ua,
    description: descriptions[lang] || descriptions.ua,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': `${baseUrl}/discount/${page}`,
        uk: `${baseUrl}/discount/${page}`,
        ru: `${baseUrl}/ru/discount/${page}`,
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

const getData = async (page: string, limit: number = 20, delLeng: 'uk' | 'ru') => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER}goods/get?page=${page}&limit=${limit}&isDiscount=true&delLang=${delLeng}`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data; // Повертаємо розпарсені дані (товари)
  } catch (err) {
    console.error('Fetch error:', err);
    return null; // або можна кидати далі throw err, якщо хочеш обробляти вище
  }
};

const page = async ({ params }: Props) => {
  const { lang, page } = await params;
  const { miniGoods } = await getDictionary(lang);
  const {
    goods: data,
    totalGoods,
    totalPages,
  }: {
    goods: GoodInterface[];
    totalGoods: number;
    totalPages: number;
  } = await getData(page, limit, lang == 'ru' ? 'uk' : 'ru');

  return (
    <div className="goods-container goods-container-discount2">
      <BreadCrumbs
        lang={lang}
        listUrles={[
          {
            name: lang == 'ru' ? 'Акции' : 'Акції',
            url: `discount/${page}`,
          },
        ]}
      />
      <h1>{lang == 'ru' ? 'Акции' : 'Акції'}</h1>
      <div className="goods-main2">
        <ListGoods data={data} isFilter={false} lang={lang} dictionary={miniGoods} />
        {totalPages !== 1 ? (
          <MyPagination
            totalPages={totalPages}
            currentPage={parseInt(page)}
            currentPathname={`/${lang}/discount`}
            currentSearchParams={{}}
            lang={lang}
          />
        ) : (
          <>
            <br />
            <br />
          </>
        )}
      </div>
    </div>
  );
};

export default page;
