'use client';
import Link from 'next/link';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { Locale } from '@/i18n.config';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import Image from 'next/image';
import BonusSVG from '../../assest/Bonus.svg';
import MinusSVG from '../../assest/Header/Basket/Minus.svg';
import PlusSVG from '../../assest/Header/Basket/Plus.svg';
import {
  addToLike,
  BasketItem,
  decrementItemCount,
  incrementItemCount,
  removeFromBasket,
  removeFromLike,
} from '@/app/store/reducers/cartReducer';
import DelSVG from '../../assest/Header/Del.svg';
import LikeSVG from '../../assest/Header/Like.svg';
import './BasketItemComponent.scss';

type Props = {
  lang: Locale;
  noList?: boolean;
};

const BasketItemComponent = ({ lang, noList }: Props) => {
  const dispatch = useDispatch();
  const { basket, like } = useSelector(
    (state: RootState) => state.BasketAndLike
  );
  const delWithBasket = (id: number) => {
    dispatch(removeFromBasket(id));
  };

  const plus = (id: number) => {
    dispatch(incrementItemCount(id));
  };

  const minus = (id: number) => {
    dispatch(decrementItemCount(id));
  };
  const clickLike = (product: BasketItem) => {
    if (like.some((x) => x.id == product.id)) {
      dispatch(removeFromLike(product.id));
    } else {
      const { count, ...productWithoutCount } = product;
      dispatch(addToLike(productWithoutCount));
    }
  };
  return (
    <div
      className={`itemWrapper-container ${noList ? 'itemWrapper-container-no-list' : ''}`}
    >
      {basket.map((x: any) => (
        <Link
          key={x.id}
          href={getLocalizedPath(`/${lang}/goods/${x.volume.url}`, lang)}
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
                    <div className="old-price">{x.volume.price} ₴</div>
                    <div className="discount">
                      -
                      {(
                        100 -
                        (x.volume.priceWithDiscount * 100) / x.volume.price
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
  );
};

export default BasketItemComponent;
