'use client';
import React, { useEffect, useRef, useState } from 'react';
import InBasket from './InBasket';
import Image from 'next/image';
import LikeSVG from '../../assest/Goods/LikeBig.svg';
import BasketBig from '../../assest/Goods/BasketBig.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import {
  addToBasket,
  addToComparisont,
  addToLike,
  removeFromComparisont,
  removeFromLike,
} from '@/app/store/reducers/cartReducer';
import { GoodInterface } from '@/app/interfaces/goods';
import { Locale } from '@/i18n.config';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/context/TranslationProvider';
import { $host } from '@/app/http';
import ComresionSVG from '../../assest/comparison2.svg';
import ComresionBigSVG from '../../assest/comparison.svg';
import DeliverySVG from '../../assest/FreeDelivery2.svg';
import MyRatingSelectGoods from './MyRatingSelectGoods';

//const widthBorderAndShadow = 0;
//const maxWidthScreen = 1600;
const heightHeader = 130;

type Props = {
  selectGoods: GoodInterface;
  dictionary: any;
  selectVolume: number;
  lang: Locale;
  review: any;
  isFreeDelivery: boolean;
  isDiscount: boolean;
  isNovetly: boolean;
  isHit: boolean;
};

const CardSelectGoods = ({
  selectGoods,
  dictionary,
  selectVolume,
  lang,
  review,
  isFreeDelivery,
  isDiscount,
  isNovetly,
  isHit,
}: Props) => {
  const { t } = useTranslation();
  const cardGoods = useRef<any>(null);
  const [isInLike, setisInLike] = useState(false);
  const { like, comparison } = useSelector(
    (state: RootState) => state.BasketAndLike
  );
  const dispatch = useDispatch();
  useEffect(() => {
    setisInLike(like.findIndex((x) => x.id == selectGoods.id) != -1);
  }, [like]);

  const getGoods = async (idVolume: number, idGoods: number) => {
    try {
      const res = await $host.get(
        `goods/GetForBasketOrLike?idVolume=${idVolume}&idGoods=${idGoods}`
      );
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const inLike = async (e: any) => {
    e.preventDefault();
    if (!isInLike) {
      const goods: any = await getGoods(
        selectGoods.volumes[selectVolume].id,
        selectGoods.id
      );
      dispatch(
        addToLike({
          id: goods.id,
          nameUA: goods.nameuk,
          nameRU: goods.nameru,
          volume: {
            id: goods.volumes[0].id,
            img: goods.volumes[0].imgs[0].img,
            price: goods.volumes[0].price,
            volume: goods.volumes[0].volume,
            discount: goods.volumes[0].discount,
            priceWithDiscount: goods.volumes[0].priceWithDiscount,
            url: goods.volumes[0].url,
          },
        })
      );
    } else {
      dispatch(removeFromLike(selectGoods.id));
    }
  };
  const [isInCompresion, setisInCompresion] = useState(false);

  useEffect(() => {
    setisInCompresion(
      comparison.findIndex((x) => x.id == selectGoods.id) != -1
    );
  }, [comparison]);

  const inCompresion = async (e: any) => {
    e.preventDefault();
    if (!isInCompresion) {
      const goods: any = await getGoods(
        selectGoods.volumes[selectVolume].id,
        selectGoods.id
      );
      dispatch(
        addToComparisont({
          id: goods.id,
          nameUA: goods.nameuk,
          nameRU: goods.nameru,
          volume: {
            id: goods.volumes[0].id,
            img: goods.volumes[0].imgs[0].img,
            price: goods.volumes[0].price,
            volume: goods.volumes[0].volume,
            discount: goods.volumes[0].discount,
            priceWithDiscount: goods.volumes[0].priceWithDiscount,
            url: goods.volumes[0].url,
          },
        })
      );
    } else {
      dispatch(removeFromComparisont(selectGoods.id));
    }
  };
  const [isInBasket, setIsInBasket] = useState(false); //тимчасово

  const { basket } = useSelector((state: RootState) => state.BasketAndLike);

  useEffect(() => {
    setIsInBasket(basket.findIndex((x) => x.id == selectGoods.id) != -1);
  }, [basket]);

  const inBasket = async (e: any) => {
    e.preventDefault();
    if (!isInBasket) {
      const goods: any = await getGoods(
        selectGoods.volumes[selectVolume].id,
        selectGoods.id
      );
      dispatch(
        addToBasket({
          id: goods.id,
          nameUA: goods.nameuk,
          nameRU: goods.nameru,
          volume: {
            id: goods.volumes[0].id,
            img: goods.volumes[0].imgs[0].img,
            price: goods.volumes[0].price,
            volume: goods.volumes[0].volume,
            discount: goods.volumes[0].discount,
            priceWithDiscount: goods.volumes[0].priceWithDiscount,
            url: goods.volumes[0].url,
          },
          count: 1,
        })
      );
    }
  };

  const router = useRouter();

  let isPadding = false;
  if (isFreeDelivery) isPadding = true;
  if (isDiscount) isPadding = true;
  if (isNovetly) isPadding = true;
  if (isHit) isPadding = true;
  return (
    <div style={{ top: heightHeader }} ref={cardGoods} className="select-goods">
      <div className="img-container">
        <div className="discount-or-hit">
          {isDiscount && (
            <div className="discount">{lang == 'ru' ? 'Акция' : 'Акція'}</div>
          )}
          {isHit && <div className="is-hit">Топ продаж</div>}
          {isFreeDelivery && (
            <div className="is-free-delivery">
              <DeliverySVG />
              {t('miniGoods2.freeDelivery')}
            </div>
          )}
          {isNovetly && <div className="is-hit">Новинка</div>}
        </div>
        <Image
          src={
            process.env.NEXT_PUBLIC_SERVER +
            selectGoods.volumes[selectVolume].imgs[0].img
          }
          unoptimized={true}
          alt={
            lang == 'ru'
              ? selectGoods.volumes[selectVolume].imgs[0].volumeru
              : selectGoods.volumes[selectVolume].imgs[0].volumeuk
          }
          width={359}
          height={340}
          style={{ paddingTop: isPadding ? '35px' : 0 }}
        />
      </div>
      <div className="text-cont">
        <div className="name">
          {lang == 'ru' ? selectGoods.nameru : selectGoods.nameuk}
        </div>

        <div className="art">
          Артикул: {selectGoods.volumes[selectVolume].art}
        </div>
        <div className="additional-container">
          <div className="additionall">
            <MyRatingSelectGoods rating={review.avarge} />
            <div className="reviews">
              <span onClick={() => router.push('#listReviews')}>
                ({review.listReviews.length}){' '}
                {lang == 'ru' ? 'Отзывов' : 'Відгуків'}
              </span>
            </div>
          </div>

          <div
            onClick={() => router.push('#addReview')}
            className="write-review"
          >
            {lang == 'ru' ? 'Оставить отзыв' : 'Залишити відгук'}
          </div>
        </div>
        <div className="buy">
          <div className="price-with-basket">
            <div className="price">
              {selectGoods.volumes[selectVolume].discount > 0 && (
                <div className="price-no-discount-and-discount">
                  <div className="price-no-discount">
                    {selectGoods.volumes[selectVolume].price}₴
                  </div>
                  <div className="discount">
                    -{selectGoods.volumes[selectVolume].discount}%
                  </div>
                </div>
              )}
              <div className="price-with-discount">
                {selectGoods.volumes[selectVolume].priceWithDiscount}{' '}
                <span>₴</span>
              </div>
            </div>
            <div className="button-buy2">
              <InBasket id={selectGoods.id}>
                <button
                  onClick={inBasket}
                  className={isInBasket ? 'inBasket' : ''}
                  //style={{ backgroundColor: isInBasket ? '#269569' : '#fe680a' }}
                >
                  {!isInBasket ? (
                    <>
                      <BasketBig /> {dictionary.buy}
                    </>
                  ) : (
                    <>
                      <BasketBig /> {t('selectGoods.inBasket')}
                    </>
                  )}{' '}
                </button>
              </InBasket>
            </div>
          </div>
          <div className="like-and-compresion">
            <div
              onClick={inCompresion}
              className={`relative compresion ${isInCompresion ? 'inCompresion' : ''}`}
            >
              <ComresionBigSVG />
              <div className="info-abs">
                {lang == 'ru'
                  ? 'Добавить в сравнение'
                  : 'Добавити у порівняння'}
              </div>
            </div>
            <div
              className={`relative like ${isInLike ? 'isLike' : ''}`}
              onClick={inLike}
            >
              <LikeSVG />
              <div className="info-abs">
                {lang == 'ru' ? 'Избранное' : 'Вибране'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardSelectGoods;
