'use client';

import { Locale } from '@/i18n.config';
import './discountPage.scss';
import DiscountLevel from './components/discountComponent';
import TabNavigation from '../components/tabNavigation';
import { use, useEffect, useState } from 'react';
import { $authHost } from '@/app/http';
import { useTranslation } from '@/context/TranslationProvider';

const SelectedProductsPage = ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = use(params);
  const [discount, setDiscount] = useState<number>(0);
  const getData = async () => {
    try {
      const res = await $authHost.get('user/getDiscountAndOrders');
      setDiscount(res.data.sum);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const { t } = useTranslation();
  return (
    <div className="PageDiscount">
      <div className="PageDiscount__title">{t('discountPage.title')}</div>
      <div className="PageDiscount__container">
        <DiscountLevel currentAmount={discount} lang={lang} />
      </div>
      <TabNavigation lang={lang} />
    </div>
  );
};
export default SelectedProductsPage;
