'use client';
import { useState, useEffect } from 'react';
import './HeaderBasket.scss';
import BasketSVG from '../../assest/Header/Basket.svg';
import { Locale } from '@/i18n.config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { setIsOpenBasket } from '@/app/store/reducers/cartReducer';
import { useRouter } from 'next/navigation';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { useTranslation } from '@/context/TranslationProvider';
import BonusSVG from '../../assest/Bonus.svg';
import CloseSVG from '../../assest/Header/close.svg';
import BasketItemComponent from './BasketItem';
import { getCountBonus } from '../utils/getCountBonus';

type Props = {
  lang: Locale;
};

const HeaderBasket = ({ lang }: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [count, setCount] = useState(0);

  const dispatch = useDispatch();
  const { basket, isOpenBasket } = useSelector(
    (state: RootState) => state.BasketAndLike
  );

  /*useEffect(() => {
    (if (isOpenBasket) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpenBasket]);*/

  useEffect(() => {
    setCount(basket.length);
  }, [basket]);

  const [sum, setSum] = useState(0);
  useEffect(() => {
    let tempSum = 0;
    basket.forEach((x) => (tempSum += x.volume.priceWithDiscount * x.count));
    setSum(tempSum);
  }, [basket]);

  useEffect(() => {
    if (isOpenBasket) dispatch(setIsOpenBasket(true));
  }, [isOpenBasket]);

  return (
    <div
      onClick={() => router.push(getLocalizedPath(`/${lang}/basket`, lang))}
      id="header-basket-container"
    >
      <div id="title-container">
        <div
          onClick={() => {
            router.push(getLocalizedPath(`/${lang}/basket`, lang));
          }}
          className={`title ${isOpenBasket ? 'open' : ''}`}
        >
          <BasketSVG />
          {count > 0 && (
            <div className="count">
              <span>{count}</span>
            </div>
          )}
        </div>

        <p>{t('headerBasket.cart')}</p>
      </div>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className={`dropdown ${isOpenBasket ? 'show' : ''}`}
      >
        <div className="drop">
          {basket.length === 0 ? (
            <>
              <p>{t('headerBasket.emptyTitle')}</p>
              <span>{t('headerBasket.emptyDescription')}</span>
            </>
          ) : (
            <div className="basket-list">
              <h2 className="">
                {lang == 'ru' ? 'Быстрая покупка' : 'Швидка покупка'}
                <div
                  onClick={() => dispatch(setIsOpenBasket(false))}
                  className="close-svg"
                >
                  <CloseSVG />
                </div>
              </h2>
              <BasketItemComponent lang={lang} />
            </div>
          )}
          {basket.length > 0 && (
            <div className="footer-basket">
              <button
                onClick={() => dispatch(setIsOpenBasket(false))}
                className="continue-shop"
              >
                {lang == 'ru' ? 'Продолжить покупки' : 'Продовжити покупки'}
              </button>
              <div className="bonus-and-other">
                <div className="bonus-info">
                  За покупку:
                  <div className="bonus">
                    <BonusSVG />{' '}
                    <span>
                      +{' '}
                      {getCountBonus(
                        basket.reduce(
                          (acc, x) => (acc += x.volume.priceWithDiscount),
                          0
                        )
                      )}
                    </span>{' '}
                    {lang == 'ru' ? 'бонусов' : 'бонусів'}
                  </div>
                </div>
                <div className="sum">
                  <span>
                    {lang == 'ru' ? 'Сумма к оплате:' : 'Сума до оплати:'}
                  </span>
                  <div className="price">
                    {basket.reduce(
                      (acc: any, x) =>
                        (acc += x.count * x.volume.priceWithDiscount),
                      0
                    )}
                    ₴
                  </div>
                </div>
                <div className="buttons">
                  <button
                    onClick={() => {
                      router.push(
                        getLocalizedPath(`/${lang}/make-order`, lang)
                      );
                      dispatch(setIsOpenBasket(false));
                    }}
                    className="button-form-order"
                  >
                    {lang == 'ru' ? 'Оформить заказ' : 'Оформити замовлення'}
                  </button>
                  <button
                    onClick={() => {
                      router.push(getLocalizedPath(`/${lang}/basket`, lang));
                      dispatch(setIsOpenBasket(false));
                    }}
                    className="in-basket"
                  >
                    {lang == 'ru' ? 'Перейти в корзину' : 'Перейти до кошика'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {isOpenBasket && (
        <div
          onClick={() => dispatch(setIsOpenBasket(false))}
          className={`${isOpenBasket ? 'mob' : ''}`}
        />
      )}
    </div>
  );
};

export default HeaderBasket;
