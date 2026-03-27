import BreadCrumbs from '@/app/components/utils/BreadCrumbs';
import { Locale } from '@/i18n.config';
import React from 'react';
import './AboutUs.scss';
import AboutForm from '@/app/components/AboutUs/AboutForm';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';
import { getDictionary } from '@/lib/dictionary';

type Props = {
  params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const urlPath = lang === 'ua' ? '' : `/ru`;
  const canonicalUrl = `${baseUrl}${urlPath}/about-us`;

  // Тексти для кожної мови
  const titles = {
    ua: 'Про нас — Baylap',
    ru: 'О нас — Baylap',
  };

  const descriptions = {
    ua: 'Дізнайтесь більше про інтернет-магазин Baylap. Наша історія, цінності та мета.',
    ru: 'Узнайте больше об интернет-магазине Baylap. Наша история, ценности и цель.',
  };

  return {
    title: titles[lang] || titles.ua,
    description: descriptions[lang] || descriptions.ua,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': `${baseUrl}/about-us`,
        uk: `${baseUrl}/about-us`,
        ru: `${baseUrl}/ru/about-us`,
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
  const { aboutUs } = await getDictionary(lang);
  return (
    <div className="about-us-cont">
      <div className="about-us">
        <BreadCrumbs
          listUrles={[{ url: 'about-us', name: lang == 'ru' ? 'О нас' : 'Про нас' }]}
          lang={lang}
        />
        <div className="main-title">
          <h1>{aboutUs.title}</h1>
        </div>

        <div className="block">
          <p dangerouslySetInnerHTML={{ __html: aboutUs.description }} />
        </div>
        <AboutForm />

        <div className="map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2594.3259799289667!2d32.06140620000001!3d49.4405556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d14b7eeb1523e7%3A0x4572aa0fc206404e!2z0LLRg9C70LjRhtGPINCT0L7Qs9C-0LvRjywgMjY5LCDQp9C10YDQutCw0YHQuCwg0KfQtdGA0LrQsNGB0YzQutCwINC-0LHQu9Cw0YHRgtGMLCAxODAwMA!5e0!3m2!1suk!2sua!4v1757777497693!5m2!1suk!2sua"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>{' '}
    </div>
  );
};

export default page;
