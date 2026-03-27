import React from 'react';
import './MakeOrder.scss';
import BreadCrumbs from '@/app/components/utils/BreadCrumbs';
import { Locale } from '@/i18n.config';
import MakeOrder from '@/app/components/MakeOrder/MakeOrder';
import { getDictionary } from '@/lib/dictionary';

type Props = {
  params: Promise<{ lang: Locale }>;
};

const page = async ({ params }: Props) => {
  const { lang } = await params;
  const { makeOrder } = await getDictionary(lang);
  return (
    <div className="make-order-container">
      <BreadCrumbs lang={lang} listUrles={[{ url: 'make-order', name: makeOrder.title }]} />
      <MakeOrder lang={lang} />
    </div>
  );
};

export default page;
