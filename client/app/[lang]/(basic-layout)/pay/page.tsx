import { Locale } from '@/i18n.config';
import React from 'react';
import '../delivery/Delivery.scss';
import { getDictionary } from '@/lib/dictionary';
import BreadCrumbs from '@/app/components/utils/BreadCrumbs';
import PaySVG from '@/app/assest/DeliveryCookiesAndOther/Pay.svg';

type Props = {
  params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const urlPath = lang === 'ua' ? '' : '/ru';
  const canonicalUrl = `${baseUrl}${urlPath}/pay`;

  const titles = {
    ua: 'Оплата — Baylap',
    ru: 'Оплата — Baylap',
  };

  const descriptions = {
    ua: 'Інформація про способи оплати в інтернет-магазині Baylap.',
    ru: 'Информация о способах оплаты в интернет-магазине Baylap.',
  };

  return {
    title: titles[lang] || titles.ua,
    description: descriptions[lang] || descriptions.ua,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': `${baseUrl}/pay`,
        uk: `${baseUrl}/pay`,
        ru: `${baseUrl}/ru/pay`,
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

const Page = async ({ params }: Props) => {
  const { lang } = await params;
  const { pay } = await getDictionary(lang);
  return (
    <div className="delivery-container">
      <BreadCrumbs lang={lang} listUrles={[{ name: pay.title, url: 'pay' }]} />
      <div className="delivery-main">
        <div className="main-title">
          <h1>{pay.title}</h1>
        </div>
        <div className="block">
          <h3>{pay.miniTitle2}</h3>
          <p>{pay.description2}</p>
        </div>
        <div className="block">
          <h3>{pay.miniTitle3}</h3>
          <p>{pay.description3}</p>
        </div>
        <div className="block">
          <h3>{pay.miniTitle4}</h3>
          <p>{pay.description4}</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
