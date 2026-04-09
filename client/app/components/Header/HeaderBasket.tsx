'use client';
import React, { useState, useEffect, useRef } from 'react';
import './HeaderBasket.scss';
import BasketSVG from '../../assest/Header/Basket.svg';
import DelSVG from '../../assest/Header/Del.svg';
import LikeSVG from '../../assest/Header/Like.svg';
import { Locale } from '@/i18n.config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import Image from 'next/image';
import {
  addToLike,
  BasketItem,
  decrementItemCount,
  incrementItemCount,
  removeFromBasket,
  removeFromLike,
  setIsOpenBasket,
} from '@/app/store/reducers/cartReducer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { useTranslation } from '@/context/TranslationProvider';
import BonusSVG from '../../assest/Bonus.svg';
import MinusSVG from '../../assest/Header/Basket/Minus.svg';
import PlusSVG from '../../assest/Header/Basket/Plus.svg';
import CloseSVG from '../../assest/Header/close.svg';

type Props = {
  lang: Locale;
};

const HeaderBasket = ({ lang }: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  const dispatch = useDispatch();
  const { basket, isOpenBasket, like } = useSelector(
    (state: RootState) => state.BasketAndLike
  );

  const toggleDropdownOpen = () => {
    if (window.outerWidth < 768) return;
    dispatch(setIsOpenBasket(true));
  };
  const toggleDropdownClose = () => {
    if (window.outerWidth < 768) return;
    dispatch(setIsOpenBasket(false));
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (window.outerWidth < 768) return;
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      dispatch(setIsOpenBasket(false));
    }
  };

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

  const delWithBasket = (id: number) => {
    dispatch(removeFromBasket(id));
  };

  const plus = (id: number) => {
    dispatch(incrementItemCount(id));
  };

  const minus = (id: number) => {
    dispatch(decrementItemCount(id));
  };

  const [sum, setSum] = useState(0);
  useEffect(() => {
    let tempSum = 0;
    basket.forEach((x) => (tempSum += x.volume.priceWithDiscount * x.count));
    setSum(tempSum);
  }, [basket]);

  useEffect(() => {
    if (isOpenBasket) dispatch(setIsOpenBasket(true));
  }, [isOpenBasket]);

  const clickLike = (product: BasketItem) => {
    if (like.some((x) => x.id == product.id)) {
      dispatch(removeFromLike(product.id));
    } else {
      const { count, ...productWithoutCount } = product;
      dispatch(addToLike(productWithoutCount));
    }
  };

  return (
    <div onClick={() => setIsOpenBasket(true)} id="header-basket-container">
      <div id="title-container">
        <div
          onClick={() => {
            dispatch(setIsOpenBasket(true));
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
        {
          //<p>{t('headerBasket.cart')}</p>
        }
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
              <div className="itemWrapper">
                {basket.map((x) => (
                  <Link
                    key={x.id}
                    href={getLocalizedPath(
                      `/${lang}/goods/${x.volume.url}`,
                      lang
                    )}
                  >
                    <div className="basket-goods2">
                      <div className="basket-goods-img">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_SERVER}${x.volume.img}`}
                          width={82}
                          height={82}
                          alt={lang == 'ru' ? x.nameRU : x.nameUA}
                        />
                      </div>
                      <div className="basket-goods-text23">
                        <h3>{lang == 'ru' ? x.nameRU : x.nameUA}</h3>
                        <div className="bonus">
                          <BonusSVG /> <span>+15</span>{' '}
                          {
                            lang == 'ru'
                              ? 'бонусов' /* за покупку*/
                              : 'бонусів' /* за покупку*/
                          }
                        </div>
                        <div className="art">Артикул: fdsfsdf</div>
                      </div>
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          return false;
                        }}
                        className="add-or-minus-or-basket"
                      >
                        <div className="add-or-minus">
                          <div
                            className="arrow plus"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              plus(x.id);
                            }}
                          >
                            <PlusSVG />
                          </div>
                          <div className="count">{x.count}</div>
                          <div
                            className="arrow minus"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              if (x.count > 1) minus(x.id);
                            }}
                          >
                            <MinusSVG />
                          </div>
                        </div>
                      </div>

                      <div className="like-and-del-and-price">
                        <div className="like-and-del">
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              clickLike(x);
                            }}
                            className={`like ${like.some((j) => j.id == x.id) ? 'liked' : ''}`}
                          >
                            <LikeSVG />
                          </div>
                          <div
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              delWithBasket(x.id);
                            }}
                            className="del"
                          >
                            <DelSVG />
                          </div>
                        </div>
                        <div className="price-container">
                          {x.volume.price != x.volume.priceWithDiscount && (
                            <div className="old-price-and-discount">
                              <div className="old-price">
                                {x.volume.price} ₴
                              </div>
                              <div className="discount">
                                -
                                {(
                                  100 -
                                  (x.volume.priceWithDiscount * 100) /
                                    x.volume.price
                                )
                                  .toFixed(1)
                                  .toString()
                                  .replace('.', ',')}
                                %
                              </div>
                            </div>
                          )}
                          <div className="price-with-discount">
                            {x.volume.priceWithDiscount} <span>₴</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
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
                    <BonusSVG /> <span>+ 90</span>{' '}
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
                    onClick={() =>
                      router.push(getLocalizedPath(`/${lang}/make-order`, lang))
                    }
                    className="button-form-order"
                  >
                    {lang == 'ru' ? 'Оформить заказ' : 'Оформити замовлення'}
                  </button>
                  <button
                    onClick={() => {
                      router.push(getLocalizedPath(`/${lang}/basket`, lang));
                      setIsOpenBasket(false);
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
