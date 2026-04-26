'use client';
import React, { useEffect, useState } from 'react';
import './ListFromBasket.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import Link from 'next/link';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { Locale } from '@/i18n.config';
import { useTranslation } from '@/context/TranslationProvider';
import { removeFromBasket } from '@/app/store/reducers/cartReducer';
import BasketSVG from '../../assest/MakeOrder/Basket.svg';

type Props = {
  isFinishFillDate: boolean;
  setFinishOrder: Function;
  lang: Locale;
  countBonus: number;
  userUseBonus: number;
  setUserUseBonus: any;
  isAuth: any;
  isPromokod: boolean;
};

const ListFromBasket = ({
  isFinishFillDate,
  setFinishOrder,
  lang,
  countBonus,
  userUseBonus,
  setUserUseBonus,
  isAuth,
  isPromokod,
}: Props) => {
  const { t } = useTranslation();
  const { basket } = useSelector((state: RootState) => state.BasketAndLike);
  const [count, setCount] = useState(0);
  const [sumNoDiscount, setSumNoDiscount] = useState(0);
  const [sumWithDiscount, setSumWithDiscount] = useState(0);
  const [discount, setDiscount] = useState(0);
  useEffect(() => {
    let sumCount = 0;
    let sumForSumNoDiscount = 0;
    let sumForSumWithDiscount = 0;
    basket.forEach((x) => {
      sumCount += x.count;
      sumForSumNoDiscount += x.volume.price * x.count;
      sumForSumWithDiscount += x.volume.priceWithDiscount * x.count;
    });
    setCount(sumCount);
    setSumNoDiscount(sumForSumNoDiscount);
    setSumWithDiscount(sumForSumWithDiscount);
    setDiscount(sumForSumNoDiscount - sumForSumWithDiscount);
  }, [basket]);

  const dispatch = useDispatch();

  const remove = (id: number) => {
    dispatch(removeFromBasket(id));
  };

  return (
    <div className="list-from-basket-container">
      <div className="list-from-basket">
        <div className="title">
          {lang == 'ru' ? 'Ваш заказ' : 'Ваше замовлення'}{' '}
          <span>
            ({basket.length} {lang == 'ru' ? 'товаров' : 'товари'})
          </span>
        </div>
        <div className="listBasket">
          {basket.map((x, idx) => (
            <Link
              href={getLocalizedPath(`/${lang}/goods/${x.volume.url}`, lang)}
              key={x.volume.id}
              className="goods-make-order"
              style={{ borderWidth: idx == basket.length - 1 ? 0 : '1px' }}
            >
              <img
                width={90}
                height={90}
                src={process.env.NEXT_PUBLIC_SERVER + x.volume.img}
              />
              <div className="text">
                <div className="name">{lang == 'ru' ? x.nameRU : x.nameUA}</div>
                <div className="row23">
                  <div className="col">
                    <div className="count">x{x.count}</div>
                    {x.volume.discount != 0 && (
                      <div className="price-no-discount">
                        {x.volume.price} <span>₴</span> /{' '}
                        {x.volume.volume.split('||')[lang == 'ru' ? 1 : 0]}
                      </div>
                    )}
                    <div className="price">
                      {x.volume.priceWithDiscount} <span>₴</span> /{' '}
                      {x.volume.volume.split('||')[lang == 'ru' ? 1 : 0]}
                    </div>
                  </div>
                </div>
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  remove(x.id);
                }}
                className="del"
              >
                <BasketSVG />
              </div>
            </Link>
          ))}
        </div>
        {!isAuth ? (
          <div className="promokod">
            <div className="message">
              {lang === 'ru'
                ? 'Авторизуйтесь, чтобы накапливать бонусы и оплачивать ими будущие заказы.'
                : 'Авторизуйтесь, щоб накопичувати бонуси та оплачувати ними майбутні замовлення.'}
            </div>
          </div>
        ) : isPromokod ? (
          <div className="promokod">
            <div className="message">
              {lang === 'ru'
                ? 'При использовании промокода бонусы нельзя списать, но они будут начислены.'
                : 'При використанні промокоду бонуси не можна списати, але вони будуть нараховані.'}
            </div>
          </div>
        ) : countBonus > 0 ? (
          <div className="promokod">
            <div className="message">
              {lang === 'ru'
                ? `У вас ${countBonus} бонусов. Вы можете использовать до ${Math.ceil(sumWithDiscount / 2)} грн (это 50% от стоимости заказа).`
                : `У вас ${countBonus} бонусів. Ви можете використати до ${Math.ceil(sumWithDiscount / 2)} грн (це 50% від вартості замовлення).`}
            </div>
            <input
              type="number"
              value={userUseBonus}
              onChange={(e) => setUserUseBonus(e.target.value)}
            />
          </div>
        ) : (
          <div className="promokod">
            <div className="message">
              {lang === 'ru'
                ? 'У вас пока нет бонусов.'
                : 'У вас поки немає бонусів.'}
            </div>
          </div>
        )}
        <div className="additional-info">
          <ul>
            {discount > 0 && (
              <>
                <li>
                  <span>{t('listFromBasket.costTitle')}</span>
                  <p>{sumNoDiscount} ₴</p>
                </li>
                <li>
                  <span>{t('listFromBasket.discountTitle')}</span>
                  <p>-{discount} ₴</p>
                </li>
              </>
            )}
          </ul>
        </div>
        <div className="button-form-order">
          <button
            style={{
              cursor: isFinishFillDate ? 'pointer' : 'default',
              opacity: isFinishFillDate ? 1 : 0.3,
            }}
            onClick={() => setFinishOrder()}
          >
            {t('listFromBasket.submitButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListFromBasket;
