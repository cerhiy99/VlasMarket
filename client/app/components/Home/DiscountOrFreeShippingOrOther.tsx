'use client';
import React from 'react';
import './DiscountOrFreeShippingOrOther.scss';
import { useTranslation } from '@/context/TranslationProvider';
import DeliverySVG from '../../assest/FreeDelivery.svg';
import { Locale } from '@/i18n.config';

type Props = {
  isDiscount: boolean;
  isFreeShipping: boolean;
  isBestseller: boolean; //Хит продаж
  isNovetly: boolean;
  isHit: boolean;
  lang: Locale;
};

const DiscountOrFreeShippingOrOther = ({
  isDiscount,
  isBestseller,
  isFreeShipping,
  isNovetly,
  isHit,
  lang,
}: Props) => {
  const { t } = useTranslation();
  return (
    <div className="discount-or-free-container">
      {isFreeShipping && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.8px solid #09C926',
            color: '#000000',
            display: 'flex',
            flexDirection: 'row',
            gap: '5px',
            alignItems: 'center',
          }}
          className="discount"
        >
          <DeliverySVG /> {lang == 'ru' ? 'Бесплатно' : 'Безкоштовно'}
        </div>
      )}
      {isDiscount && (
        <div className="discount">{lang == 'ru' ? 'Акции' : 'Акції'}</div>
      )}

      {isNovetly && <div className="discount">Новинка</div>}
      {isHit && <div className="discount">Топ</div>}
    </div>
  );
};

export default DiscountOrFreeShippingOrOther;
