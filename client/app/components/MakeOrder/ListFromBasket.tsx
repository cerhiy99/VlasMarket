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
  addToBasket,
  addToBasketNoOpenBasket,
  removeFromBasket,
} from '@/app/store/reducers/cartReducer';
import BasketSVG from '../../assest/MakeOrder/Basket.svg';
import { PromokodFromDBInterface } from '@/app/[lang]/(admin-layout)/admin/promokods/GetPromokods';
import { $host } from '@/app/http';
import BonusSVG from '../../assest/Goods/Bonus.svg';

type Props = {
  isFinishFillDate: boolean;
  setFinishOrder: Function;
  lang: Locale;
  countBonus: number;
  userUseBonus: number;
  setUserUseBonus: any;
  isAuth: any;
  isPromokod: boolean;
  promokod: PromokodFromDBInterface | null;
  setPromokod: any;
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
  promokod,
  setPromokod,
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

  const [maxBonusAllowed, setMaxBonusAllowed] = useState(0);
  const [limitText, setLimitText] = useState('');

  useEffect(() => {
    const byOrder = Math.ceil(sumWithDiscount / 2);
    const allowed = Math.min(byOrder, countBonus || 0);

    setMaxBonusAllowed(allowed);

    // 🧠 текст логіки
    if (countBonus > byOrder) {
      setLimitText(
        lang === 'ru'
          ? `Лимит использования: 50% от заказа (${byOrder} бонусов)`
          : `Ліміт використання: 50% від замовлення (${byOrder} бонусів)`
      );
    } else {
      setLimitText(
        lang === 'ru'
          ? `У вас ${countBonus} бонусов`
          : `У вас ${countBonus} бонусів`
      );
    }
  }, [sumWithDiscount, countBonus, lang]);

  const [sum, setSum] = useState(0);
  const [finalSum, setFinalSum] = useState(0);

  const [promoModal, setPromoModal] = useState<null | {
    type: 'min_price' | 'missing_product';
    message: string;
    product?: any;
  }>(null);

  const calculateBaseSum = () => {
    return basket.reduce(
      (acc, x) => acc + x.volume.priceWithDiscount * x.count,
      0
    );
  };

  const [promokodText, setPromokodText] = useState('');

  useEffect(() => {
    setPromokodText('');
    const getSum = async () => {
      let tempSum = basket.reduce(
        (acc, x) => acc + x.volume.priceWithDiscount * x.count,
        0
      );

      setSum(tempSum);

      let discountedSum = tempSum;

      // бонуси
      if (userUseBonus > 0) {
        discountedSum -= userUseBonus;
      }

      // промокод
      if (promokod) {
        if (promokod.min_price && tempSum < promokod.min_price) {
          setPromoModal({
            type: 'min_price',
            message:
              lang === 'ru'
                ? `Этот промокод действует от ${promokod.min_price} грн. Добавьте товаров минимум на ${promokod.min_price - tempSum} грн или выберите другой промокод.`
                : `Цей промокод діє від ${promokod.min_price} грн. Додайте товарів ще на ${promokod.min_price - tempSum} грн або виберіть інший промокод.`,
          });
          return;
        }

        if (promokod.type === 'procent') {
          discountedSum -= (discountedSum / 100) * (promokod.procent as any);
          setPromokodText(`-${promokod.procent}%`);
        } else if (promokod.type === 'price') {
          discountedSum -= promokod.price_discount as any;
          setPromokodText(`-${promokod.price_discount} грн`);
        } else {
          try {
            const res = await $host.get(
              'goods/getForVolumeMini/' + promokod.selectVolumeArt
            );

            const product = res.data.goods;

            const isInBasket = basket.some(
              (x) => x.volume.id === product.volumes[0].id
            );

            if (!isInBasket) {
              setPromoModal({
                type: 'missing_product',
                message:
                  lang === 'ru'
                    ? `Промокод действует только на товар с артикулом ${promokod.selectVolumeArt}. Добавить его в корзину?`
                    : `Промокод діє тільки на товар з артикулом ${promokod.selectVolumeArt}. Додати його в кошик?`,
                product: product,
              });
              return;
            } else {
              if (promokod.type == 'select_goods_free') {
                discountedSum -= product.volumes[0].priceWithDiscount;
                setPromokodText(
                  lang == 'ru' ? `1 товар в подарок.` : `1 товар в подарунок.`
                );
              } else if (promokod.type == 'select_goods_discount_procent') {
                const price = product.volumes[0].priceWithDiscount;
                const discount = (price / 100) * (promokod.procent as any);

                discountedSum -= discount;
                setPromokodText(
                  lang == 'ru'
                    ? `Для одного товара -${promokod.procent}%.`
                    : `Для одного товару -${promokod.procent}%.`
                );
              } else {
                discountedSum -= promokod.price_discount as any;

                setPromokodText(
                  lang == 'ru'
                    ? `-${promokod.price_discount} грн.`
                    : `-${promokod.price_discount} грн.`
                );
              }
            }
          } catch (err) {
            console.log(err);
          }
        }
      }

      setFinalSum(discountedSum);
    };

    getSum();
  }, [basket, userUseBonus, promokod]);

  const addBasket = (product: any) => {
    if (product !== null) {
      dispatch(
        addToBasketNoOpenBasket({
          id: product.id,
          nameUA: product.nameuk,
          nameRU: product.nameru,
          count: 1,
          volume: {
            id: product.volumes[0].id,
            img: product.volumes[0].imgs[0].img,
            price: product.volumes[0].price,
            volume: product.volumes[0].volume,
            discount: product.volumes[0].discount,
            priceWithDiscount: product.volumes[0].priceWithDiscount,
            url: product.volumes[0].url,
          },
        })
      );
    }
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
                  e.preventDefault();
                  remove(x.id);
                  return null;
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
            <div className="bonus-info-row">
              <div className="bonus-inf">Доступно: </div>

              <div className="message">
                {limitText}

                <br />

                {countBonus != maxBonusAllowed &&
                  (lang === 'ru'
                    ? `Можно использовать до ${maxBonusAllowed} бонусов`
                    : `Можна використати до ${maxBonusAllowed} бонусів`)}
              </div>
            </div>
            <div className="bonus-inf">1 бонус = 1 ₴</div>
            <input
              type="text"
              value={userUseBonus.toString()}
              onChange={(e) => {
                let value = e.target.value;

                value = value.replace(/^0+(?=\d)/, '');

                let num = Number(value);

                if (num > maxBonusAllowed) num = maxBonusAllowed;
                if (num < 0 || isNaN(num)) num = 0;

                setUserUseBonus(num);
              }}
              className="input-bonus"
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
        <div className="sum">
          {finalSum != sum && (
            <div className="discount-container">
              <div className="row-fatty">
                <p>{lang == 'ru' ? 'Сумма без скидки:' : 'Сума без знижки:'}</p>
                <span>{sum.toFixed(2)} ₴</span>
              </div>
              {userUseBonus > 0 && (
                <div className="row">
                  <p>
                    {lang == 'ru'
                      ? 'Использовано бонусов:'
                      : 'Використано бонусів:'}
                  </p>
                  <span className="fatty">
                    <BonusSVG /> {userUseBonus}
                  </span>
                </div>
              )}
              {promokod !== null && (
                <div className="row">
                  <p>Промокод</p>
                  <span className="fatty">{promokodText}</span>
                </div>
              )}
            </div>
          )}

          <div className="to-pay">
            <p>{lang == 'ru' ? 'Сумма к оплате' : 'Сума до оплати:'}</p>
            <span>{finalSum.toFixed(2)} ₴</span>
          </div>
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

      {promoModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">
              {lang === 'ru' ? 'Внимание' : 'Увага'}
            </div>

            <div className="modal-body">{promoModal.message}</div>

            <div className="modal-actions">
              <button
                onClick={() => {
                  setPromoModal(null);
                  setPromokod(null);
                }}
              >
                {lang === 'ru' ? 'Понятно' : 'Зрозуміло'}
              </button>

              {promoModal.type === 'missing_product' && (
                <button
                  onClick={() => {
                    addBasket(promoModal.product);
                    setPromoModal(null);
                  }}
                >
                  {lang === 'ru' ? 'Добавить' : 'Додати'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListFromBasket;
