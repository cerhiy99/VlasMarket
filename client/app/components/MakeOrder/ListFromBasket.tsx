'use client';
import React, { useEffect, useState } from 'react';
import './ListFromBasket.scss';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import Link from 'next/link';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { Locale } from '@/i18n.config';
import { useTranslation } from '@/context/TranslationProvider';
import {
  decrementItemCount,
  incrementItemCount,
  removeFromBasket,
} from '@/app/store/reducers/cartReducer';

type Props = {
  isFinishFillDate: boolean;
  setFinishOrder: Function;
  lang: Locale;
  personal: number;
};

const ListFromBasket = ({ isFinishFillDate, setFinishOrder, lang, personal }: Props) => {
  const { t } = useTranslation();
  const { basket } = useSelector((state: RootState) => state.BasketAndLike);
  const [count, setCount] = useState(0);
  const [sumNoDiscount, setSumNoDiscount] = useState(0);
  const [sumWithDiscount, setSumWithDiscount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [sumWithPersonalDiscount, setSumWithPersonalDiscount] = useState(0);
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
    setSumWithPersonalDiscount(sumForSumWithDiscount - (sumForSumWithDiscount * personal) / 100);
  }, [basket, personal]);

  const dispatch = useDispatch();

  const editCount = (isAdd: boolean, id: number, count: number) => {
    if (isAdd) {
      dispatch(incrementItemCount(id));
    } else {
      if (count == 1) {
        dispatch(removeFromBasket(id));
      } else dispatch(decrementItemCount(id));
    }
  };

  return (
    <div className="list-from-basket-container">
      <div className="list-from-basket">
        <div className="title">
          {t('listFromBasket.title')}{' '}
          <span>
            {count}{' '}
            {count == 1 ? t('listFromBasket.itemCountOne') : t('listFromBasket.itemCountMany')}
          </span>
        </div>
        <div className="listBasket">
          {basket.map((x) => (
            <Link
              href={getLocalizedPath(`/${lang}/goods/${x.volume.url}`, lang)}
              key={x.volume.id}
              className="goods-make-order"
            >
              <img width={90} height={90} src={process.env.NEXT_PUBLIC_SERVER + x.volume.img} />
              <div className="text">
                <div className="name">{lang == 'ru' ? x.nameRU : x.nameUA}</div>
                <div className="row23">
                  <div className="col">
                    <div className="count">{x.count} товар</div>
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
                  <div className="count-cont">
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        editCount(false, x.id, x.count);
                      }}
                      style={{ fontSize: '20px' }}
                      className="minus"
                    >
                      -
                    </span>
                    <div className="count">{x.count}</div>
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        editCount(true, x.id, x.count);
                      }}
                      className="plus"
                    >
                      +
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
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
            {personal > 0 && (
              <li>
                <span>{lang == 'ru' ? 'Персональная скидка' : 'Персональна знижка'}</span>
                <p>{personal} %</p>
              </li>
            )}
            <li>
              <span>{t('listFromBasket.toPayWithoutDelivery')}</span>
              {personal == 0 ? (
                <p>{sumWithDiscount} ₴</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'row', gap: '4px' }}>
                  <p style={{ textDecoration: 'line-through' }}>{sumWithDiscount} ₴</p>
                  <p>{sumWithPersonalDiscount} ₴</p>
                </div>
              )}
            </li>
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
