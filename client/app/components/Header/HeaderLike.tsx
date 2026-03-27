'use client';
import React, { useState, useEffect, useRef } from 'react';
import './HeaderLike.scss';
import LikeSVG from '../../assest/Header/Like.svg';
import { Locale } from '@/i18n.config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import Image from 'next/image';
import DelSVG from '../../assest/Header/Del.svg';
import { addToBasket, removeFromLike } from '@/app/store/reducers/cartReducer';
import Link from 'next/link';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { useTranslation } from '@/context/TranslationProvider';

type Props = {
  lang: Locale;
};

const HeaderLike = ({ lang }: Props) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);

  const dispatch = useDispatch();

  const { like } = useSelector((state: RootState) => state.BasketAndLike);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    setCount(like.length);
  }, [like]);

  const delWithLike = (id: number) => {
    dispatch(removeFromLike(id));
  };

  const [price, setPrice] = useState(0);

  useEffect(() => {
    let sum = 0;
    like.forEach((x: any) => (sum += x.volume.priceWithDiscount));
    setPrice(sum);
  }, [like]);

  const handlerAddToCart = (id: number) => {
    const currentLike = like.filter((currentItem: any) => currentItem.id === id);
    dispatch(addToBasket({ ...currentLike[0], count: 1 }));
    dispatch(removeFromLike(id));
    setIsOpen(false);
  };

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="header-like-container"
      ref={dropdownRef}
    >
      <div className={`title ${isOpen ? 'open' : ''}`}>
        <LikeSVG />

        {count > 0 && (
          <div className="count">
            <span>{count}</span>
          </div>
        )}
      </div>
      <div className={`dropdown ${isOpen ? 'show' : ''}`}>
        {like.length === 0 ? (
          <>
            <p className="empty-title">{t('headerLike.emptyTitle')}</p>
            <span>{t('headerLike.emptyDescription')}</span>
          </>
        ) : (
          <div className="liked-container">
            <p>{t('headerLike.likedItems')}</p>
            {like.map((x) => (
              <div className="itemWrapper" key={x.id}>
                <Link href={getLocalizedPath(`/${lang}/goods/${x.volume.id}`, lang)}></Link>
                <div className="liked-basket">
                  <div className="basket-goods-img">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SERVER}${x.volume.img}`}
                      width={82}
                      height={82}
                      alt={lang == 'ru' ? x.nameRU : x.nameUA}
                    />
                  </div>
                  <div className="basket-goods-text">
                    <h3>{lang == 'ru' ? x.nameRU : x.nameUA}</h3>
                    <div className="price-count-volume">
                      <div className="volume-and-count">
                        <div className="volume">
                          {x.volume.volume.split('||')[lang == 'ru' ? 1 : 0]}
                        </div>
                      </div>
                      <div className="price-container">
                        {x.volume.price !== x.volume.priceWithDiscount && (
                          <div style={{ color: '#000' }} className="price-no-discount">
                            {x.volume.price} ₴
                          </div>
                        )}
                        <div className="price-with-discount">{x.volume.priceWithDiscount} ₴</div>
                      </div>
                    </div>
                  </div>
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      delWithLike(x.id);
                    }}
                    className="del"
                  >
                    <DelSVG />
                  </div>
                </div>

                <div className="button-with-price">
                  <div className="price">
                    <p>{t('headerLike.totalPrice')}</p>
                    <div className="price-grn">
                      {price} <span className="grn">₴</span>
                    </div>
                  </div>
                  <div className="in-basket">
                    <button onClick={() => handlerAddToCart(x.id)}>
                      {t('headerLike.addToCartButton')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderLike;
