import { Locale } from '@/i18n.config';
import { getDictionary } from '@/lib/dictionary';
import React from 'react';
import '../delivery/Delivery.scss';
import BreadCrumbs from '@/app/components/utils/BreadCrumbs';

type Props = {
  params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const urlPath = lang === 'ua' ? '' : '/ru';
  const canonicalUrl = `${baseUrl}${urlPath}/return-goods`;

  const titles = {
    ua: 'Повернення товарів — Baylap',
    ru: 'Возврат товаров — Baylap',
  };

  const descriptions = {
    ua: 'Інформація про повернення товарів в інтернет-магазині Baylap.',
    ru: 'Информация о возврате товаров в интернет-магазине Baylap.',
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
      siteName: 'Baylap',
    },
  };
}

const page = async ({ params }: Props) => {
  const { lang } = await params;
  const { returnGoods, urls } = await getDictionary(lang);
  return (
    <div className="delivery-container">
      <BreadCrumbs listUrles={[{ url: `return-goods`, name: returnGoods.name }]} lang={lang} />
      <div className="delivery-main">
        <div className="main-title">
          <h1>{returnGoods.title}</h1>
        </div>
        <div className="block">
          <p dangerouslySetInnerHTML={{ __html: returnGoods.description1 }} />
        </div>
        <div className="block">
          <h3>{returnGoods.minititle2}</h3>
          <ul>
            {returnGoods.ul.map((x, idx) => (
              <li key={idx} dangerouslySetInnerHTML={{ __html: x }} />
            ))}
          </ul>
        </div>{' '}
        <div className="block">
          <h3>{returnGoods.minititle3}</h3>
          <p dangerouslySetInnerHTML={{ __html: returnGoods.description3 }} />
          <ul>
            {returnGoods.ul2.map((x, idx) => (
              <li key={idx}>{x}</li>
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

export default page;
