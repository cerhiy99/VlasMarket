import React from 'react';
import { notFound } from 'next/navigation';
import './Brands.scss';
import { getDictionary } from '@/lib/dictionary';
import { Locale } from '@/i18n.config';
import BreadCrumbs from '@/app/components/utils/BreadCrumbs';
import Link from 'next/link';
import { toSlug } from '@/app/components/utils/addittional';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';

type Props = {
  params: Promise<{ lang: Locale }>;
};

// Функція для отримання даних
const getData = async () => {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_SERVER + 'brend/getForListBrends'
  );
  if (!res.ok) return notFound();
  const data = await res.json();
  return data.res;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const urlPath = lang === 'ua' ? '' : '/ru';
  const canonicalUrl = `${baseUrl}${urlPath}/brands`;

  // Тексти для кожної мови
  const titles = {
    ua: 'Бренди від інтернет-магазину Baylap',
    ru: 'Бренды от интернет-магазина Baylap',
  };

  const descriptions = {
    ua: 'Каталог представлених брендів від інтернет-магазину Baylap. Великий асортимент продукції від різних виробників',
    ru: ' Каталог представленных брендов от интернет-магазина Baylap. Большой ассортимент продукции от разных производителей',
  };

  return {
    title: titles[lang] || titles.ua,
    description: descriptions[lang] || descriptions.ua,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': `${baseUrl}/brands`,
        uk: `${baseUrl}/brands`,
        ru: `${baseUrl}/ru/brands`,
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

// Алфавіти для різних мов
const alphabets: Record<Locale, string[]> = {
  ua: 'АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ'.split(''),
  ru: 'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ'.split(''),
};

const englishAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').concat(['0-9']);

const page = async ({ params }: Props) => {
  const { lang } = await params;
  const brends = await getData();

  const { listBrends } = await getDictionary(lang);

  // Вибір українського або російського алфавіту
  const selectedAlphabet = alphabets[lang] || alphabets.ua;
  const trueAlphabet = brends.slice(0).map((x: any) => x.startWith);
  return (
    <div className="list-brands-container">
      <div className="list-brands-title">
        <BreadCrumbs
          listUrles={[{ url: `brands`, name: listBrends.title }]}
          lang={lang}
        />
        <h1>{listBrends.title}</h1>
      </div>
      <div className="list-letter-Brand-container">
        <div className="list-letter-Brand">
          {[...trueAlphabet /*...englishAlphabet,...alphabets[lang]*/].map(
            (x) => (
              <Link className="list-url" key={x} href={'#' + x}>
                {x}
              </Link>
            )
          )}
        </div>
      </div>
      <div className="list-brands">
        {brends.map((x: any, index: number) => (
          <div id={x.startWith} key={x.id} className="brands-and-title-letter">
            <p>{x.startWith}</p>
            <div className="brands">
              {x.brends.map((brend: any) => (
                <Link
                  href={getLocalizedPath(
                    `/${lang}/brands/${toSlug(brend.name)}/1`,
                    lang
                  )}
                  key={brend.id}
                  className="brand"
                >
                  {brend.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
