import React from 'react';
import '../delivery/Delivery.scss';
import BreadCrumbs from '@/app/components/utils/BreadCrumbs';
import { Locale } from '@/i18n.config';
import FormCooperation from './FormCooperation';
import { getDictionary } from '@/lib/dictionary';

type Props = {
  params: Promise<{ lang: Locale }>;
};

export async function generateMetadata({ params }: Props) {
  const { lang } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const urlPath = lang === 'ua' ? '' : '/ru';
  const canonicalUrl = `${baseUrl}${urlPath}/cooperation`;

  // Локалізовані тексти
  const titles = {
    ua: 'Співпраця — Baylap',
    ru: 'Сотрудничество — Baylap',
  };

  const descriptions = {
    ua: 'Дізнайтесь, як почати співпрацю з інтернет-магазином Baylap.',
    ru: 'Узнайте, как начать сотрудничество с интернет-магазином Baylap.',
  };

  return {
    title: titles[lang] || titles.ua,
    description: descriptions[lang] || descriptions.ua,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'x-default': `${baseUrl}/cooperation`,
        uk: `${baseUrl}/cooperation`,
        ru: `${baseUrl}/ru/cooperation`,
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
  const { cooperation } = await getDictionary(lang);
  return (
    <div className="delivery-container">
      <BreadCrumbs
        lang={lang}
        listUrles={[
          {
            name: lang == 'ru' ? 'Поставщикам' : 'Постачальникам',
            url: 'cooperation',
          },
        ]}
      />
      <div className="delivery-main">
        <div className="main-title">
          <h1>{cooperation.title}</h1>
        </div>
        <div className="block">
          <h3>{cooperation.miniTitle}</h3>
          <p>
            {cooperation.description1}
            <span style={{ display: 'block', marginTop: '5px' }}>
              {cooperation.description3}
            </span>
            <span style={{ display: 'block', marginTop: '5px' }}>
              {cooperation.description4}
            </span>
          </p>
        </div>
        <FormCooperation dictionary={cooperation.form} />
      </div>
    </div>
  );
};

export default page;
