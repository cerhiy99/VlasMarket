import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import React from 'react';
import './ReturnGoods.scss';
import BreadCrumbs from '@/app/components/utils/BreadCrumbs';

type Props = {
  params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  const urlPath = lang === 'ua' ? '' : '/ru';
  const canonicalUrl = `${baseUrl}${urlPath}/return-goods`;

  const titles = {
    ua: 'Повернення товарів — VlasMarket',
    ru: 'Возврат товаров — VlasMarket',
  };

  const descriptions = {
    ua: 'Інформація про повернення товарів в інтернет-магазині VlasMarket.',
    ru: 'Информация о возврате товаров в интернет-магазине VlasMarket.',
  };

  return {
    title: titles[lang] || titles.ua,
    description: descriptions[lang] || descriptions.ua,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': `${baseUrl}/return-goods`,
        uk: `${baseUrl}/return-goods`,
        ru: `${baseUrl}/ru/return-goods`,
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

const Page = async ({ params }: Props) => {
  const { lang } = await params;
  const { returnGoods } = await getDictionary(lang);

  return (
    <div className="return-goods-container">
      <BreadCrumbs
        listUrles={[{ url: 'return-goods', name: returnGoods.name }]}
        lang={lang}
      />

      <div className="return-goods-main">
        <div className="main-title">
          <h1>{returnGoods.title}</h1>
        </div>

        <div className="block">
          <p dangerouslySetInnerHTML={{ __html: returnGoods.description1 }} />
        </div>

        <div className="block">
          <h3>{returnGoods.minititle2}</h3>
          <ul className="return-rules-list">
            {returnGoods.ul.map((item, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        </div>

        <div className="block">
          <h3>{returnGoods.minititle3}</h3>
          <p dangerouslySetInnerHTML={{ __html: returnGoods.description3 }} />

          <ul className="non-return-list">
            {returnGoods.ul2.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="block">
          <div className="add-info">{returnGoods.additionalInfo}</div>
        </div>
      </div>
    </div>
  );
};

export default Page;