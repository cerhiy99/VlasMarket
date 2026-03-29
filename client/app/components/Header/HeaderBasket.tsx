'use client';
import React, { useState, useEffect, useRef } from 'react';
import './HeaderBasket.scss';
import BasketSVG from '../../assest/Header/Basket.svg';
import DelSVG from '../../assest/Header/Del.svg';
import { Locale } from '@/i18n.config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import Image from 'next/image';
import {
  decrementItemCount,
  incrementItemCount,
  removeFromBasket,
  setIsOpenBasket,
} from '@/app/store/reducers/cartReducer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { useTranslation } from '@/context/TranslationProvider';

type Props = {
  lang: Locale;
};

const HeaderBasket = ({ lang }: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  const dispatch = useDispatch();
  const { basket, isOpenBasket } = useSelector(
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

  return (
    <div
      onMouseEnter={toggleDropdownOpen}
      onMouseLeave={toggleDropdownClose}
      id="header-basket-container"
      ref={dropdownRef}
    >
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
        {basket.length === 0 ? (
          <>
            <p>{t('headerBasket.emptyTitle')}</p>
            <span>{t('headerBasket.emptyDescription')}</span>
          </>
        ) : (
          <div className="basket-list">
            <p>{t('headerBasket.cart')}</p>
            {basket.map((x) => (
              <div key={x.id} className="itemWrapper">
                <Link
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
                      <div className="add-or-minus-or-basket">
                        <div className="add-or-minus">
                          <div
                            className="arrow minus"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              if (x.count > 1) minus(x.id);
                            }}
                          >
                            <svg
                              width="14"
                              height="2"
                              viewBox="0 0 14 2"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0 1H14"
                                stroke="white"
                                strokeWidth="2"
                              />
                            </svg>
                          </div>
                          <div className="count">{x.count}</div>
                          <div
                            className="arrow plus"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              plus(x.id);
                            }}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 14 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0 7L14 7"
                                stroke="white"
                                strokeWidth="2"
                              />
                              <path
                                d="M7 0L7 14"
                                stroke="white"
                                strokeWidth="2"
                              />
                            </svg>
                          </div>
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
                      <div className="price-count-volume">
                        <div className="volume-and-count">
                          <div className="count">
                            {x.volume.volume.split('||')[lang == 'ru' ? 1 : 0]}
                          </div>
                        </div>
                        <div className="price-container">
                          {x.volume.price !== x.volume.priceWithDiscount && (
                            <div
                              style={{ color: '#000' }}
                              className="price-no-discount"
                            >
                              {x.volume.price} ₴
                            </div>
                          )}
                          <div className="price-with-discount">
                            {x.volume.priceWithDiscount} ₴
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
        {basket.length > 0 && (
          <div className="footer-basket">
            <div className="text">
              <span>{t('headerBasket.totalPrice')}:</span>
              <p>
                {sum} <span>₴</span>
              </p>
            </div>
            <div className="row-button">
              <div className="button-make-order button-continue">
                <button
                  onClick={() => {
                    dispatch(setIsOpenBasket(false));
                  }}
                >
                  {lang == 'ru' ? 'продолжить покупки' : 'продовжити покупки'}
                </button>
              </div>
              <div className="button-make-order">
                <button
                  onClick={() => {
                    dispatch(setIsOpenBasket(false));

                    router.push(getLocalizedPath(`/${lang}/make-order`, lang));
                  }}
                >
                  {t('headerBasket.checkoutButton')}
                </button>
              </div>
            </div>
          </div>
        )}
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
