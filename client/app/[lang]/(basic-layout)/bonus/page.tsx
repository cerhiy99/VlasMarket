import { Locale } from '@/i18n.config';
import React from 'react';
import './Bonus.scss';
import BreadCrumbs from '@/app/components/utils/BreadCrumbs';
import { getDictionary } from '@/lib/dictionary';

type Props = {
  params: Promise<{ lang: Locale }>;
};

const page = async ({ params }: Props) => {
  const { lang } = await params;
  const { bonus } = await getDictionary(lang);

  return (
    <div className="bonus-container">
      <BreadCrumbs
        lang={lang}
        listUrles={[{ url: 'bonus', name: bonus.title }]}
      />
      <h1>{bonus.title}</h1>
    </div>
  );
};

export default page;
