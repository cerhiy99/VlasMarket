'use client';
import React from 'react';
import './DiscountOrFreeShippingOrOther.scss';
import { useTranslation } from '@/context/TranslationProvider';

type Props = {
  isDiscount: boolean;
  isFreeShipping: boolean;
  isBestseller: boolean; //Хит продаж
  isNovetly: boolean;
  isHit: boolean;
};

const DiscountOrFreeShippingOrOther = ({
  isDiscount,
  isBestseller,
  isFreeShipping,
  isNovetly,
  isHit,
}: Props) => {
  const { t } = useTranslation();
  return (
    <div className="discount-or-free-container">
      {isFreeShipping && (
        <div style={{ backgroundColor: 'green' }} className="discount">
          {t('miniGoods2.freeDelivery')}
        </div>
      )}
      {isDiscount && (
        <div style={{ backgroundColor: 'red' }} className="discount">
          {t('miniGoods2.discount')}
        </div>
      )}

      {isNovetly && (
        <div style={{ backgroundColor: 'red' }} className="discount">
          Новинка
        </div>
      )}
      {isHit && (
        <div style={{ backgroundColor: 'red' }} className="discount">
          Топ
        </div>
      )}
    </div>
  );
};

export default DiscountOrFreeShippingOrOther;
