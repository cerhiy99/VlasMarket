'use client';
import { useTranslation } from '@/context/TranslationProvider';
import { Locale } from '@/i18n.config';
import React, { use } from 'react';
import './Basket.scss';
import BasketItemComponent from '@/app/components/Header/BasketItem';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import BonusSVG from '../../../assest/Bonus.svg';
import { useRouter } from 'next/navigation';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';

type Props = {
  params: Promise<{ lang: Locale }>;
};

const Page = ({ params }: Props) => {
  const { lang } = use(params);
  const { t } = useTranslation();
  const { basket } = useSelector((state: RootState) => state.BasketAndLike);
  const router = useRouter();
  return (
    <div className="basket-page-container">
      <h1>{t('headerBasket.cart')}</h1>
      <div className="list-and-info">
        <BasketItemComponent noList lang={lang} />
        <div className="info-container">
          <div className="info">
            <h2>
              {t('selectGoods.inBasket')} {basket.length} товара
            </h2>
            <div className="buttons-and-price">
              <div className="price">
                <p>{lang == 'ru' ? 'Сумма к оплате:' : 'Сума до оплати:'}</p>
                <span>
                  {basket.reduce(
                    (acc: number, x) =>
                      (acc += x.volume.priceWithDiscount * x.count),
                    0
                  )}{' '}
                  ₴
                </span>
              </div>
              <div className="bonus">
                <p>За покупку:</p>
                <span>
                  <div className="bonus-svg">
                    <BonusSVG />
                  </div>
                  <span> + 300</span> {lang == 'ru' ? 'бонусов' : 'бонусів'}
                </span>
              </div>
              <div className="buttons">
                <button
                  onClick={() =>
                    router.push(getLocalizedPath(`/${lang}/make-order`, lang))
                  }
                  className="fomr-order"
                >
                  {t('listFromBasket.submitButton')}
                </button>
                <button className="buy-one-click">
                  {lang == 'ru'
                    ? 'Заказать в один клик'
                    : 'Замовити в один клік'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
