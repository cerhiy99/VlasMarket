'use client';
import React, { useEffect, useState } from 'react';
import './SelectGoodsTextContainer.scss';
import ReviewsSVG from '../../assest/Goods/Revies.svg';
import BasketSVG from '../../assest/Goods/BasketBig.svg';
import LikeSVG from '../../assest/Goods/LikeBig.svg';
import NewPostSVG from '../../assest/Goods/NewPost.svg';
import UkrPostSVG from '../../assest/Goods/UkrPost.svg';
import MyRating from './MyRating';
import { Locale } from '@/i18n.config';
import Link from 'next/link';
import AvailabilityTrue from '../../assest/Goods/AvailubutlyTrue.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { addToBasket, addToLike, removeFromLike } from '@/app/store/reducers/cartReducer';
import { GoodInterface } from '@/app/interfaces/goods';
import { toSlug } from '../utils/addittional';
import FastBuy from '../FastBuy/FastBuy';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/context/TranslationProvider';
import { $host } from '@/app/http';
import { IoCloseCircle } from 'react-icons/io5';

type Props = {
  selectGoods: GoodInterface;
  dictionary: any;
  setVolume: any;
  selectVolume: number;
  selectVolumeId: number | string;
  lang: Locale;
  reviews: any;
};

const SelectGoodsTextContainer = ({
  selectGoods,
  dictionary,
  setVolume,
  selectVolume,
  lang,
  selectVolumeId,
  reviews,
}: Props) => {
  const { t } = useTranslation();
  const [isInLike, setisInLike] = useState(false);
  const { like } = useSelector((state: RootState) => state.BasketAndLike);
  const dispatch = useDispatch();
  useEffect(() => {
    setisInLike(like.findIndex((x: any) => x.id == selectGoods.id) != -1);
  }, [like]);

  const inLike = async (e: any) => {
    e.preventDefault();
    if (!isInLike) {
      const goods: any = await getGoods(selectGoods.volumes[selectVolume].id, selectGoods.id);
      dispatch(
        addToLike({
          id: goods.id,
          nameUA: goods.nameuk,
          nameRU: goods.nameru,
          volume: {
            id: goods.volumes[0].id,
            img: goods.volumes[0].imgs[0].img,
            price: goods.volumes[0].price,
            volume: goods.volumes[0].volume + goods.volumes[0].nameVolume,
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
  const [isInBasket, setIsInBasket] = useState(false);
  const { basket } = useSelector((state: RootState) => state.BasketAndLike);

  useEffect(() => {
    setIsInBasket(basket.findIndex((x: any) => x.id == selectGoods.id) != -1);
  }, [basket]);

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

  const inBasket = async (e: any) => {
    e.preventDefault();
    if (!isInBasket) {
      const goods: any = await getGoods(selectGoods.volumes[selectVolume].id, selectGoods.id);
      dispatch(
        addToBasket({
          id: goods.id,
          nameUA: goods.nameuk,
          nameRU: goods.nameru,
          volume: {
            id: goods.volumes[0].id,
            img: goods.volumes[0].imgs[0].img,
            price: goods.volumes[0].price,
            volume: goods.volumes[0].volume + goods.volumes[0].nameVolume,
            discount: goods.volumes[0].discount,
            priceWithDiscount: goods.volumes[0].priceWithDiscount,
            url: goods.volumes[0].url,
          },
          count: 1,
        })
      );
    }
  };

  const hoverVolume = (idx: number) => {
    setVolume(idx);
  };

  const unHoverVolume = () => {
    const searchSelectVolumeId = selectGoods.volumes.findIndex((x) => x.id == selectVolumeId);
    //setVolume(clickedVolumeIdx)
  };
  const [fastBuy, setFastBuy] = useState(false);
  const fastBuyOpen = () => {
    setFastBuy(true);
  };

  const pathname = usePathname();
  const [realSelectId, setRealSelectId] = useState<string | null>(null);

  useEffect(() => {
    if (pathname) {
      setRealSelectId(pathname.split('/').pop() || null);
    }
  }, [pathname]);

  return (
    <>
      <FastBuy
        nameProduct={selectGoods.nameuk}
        idVolume={selectGoods.volumes[selectVolume].url}
        idGoods={selectGoods.id}
        lang={lang}
        fastBuy={fastBuy}
        setFastBuy={setFastBuy}
        realIdVolume={selectGoods.volumes[selectVolume].id}
      />
      <div className="text-container">
        <div className="text-container-card rating-reviews-and-other-and-art">
          <div className="rating-and-reviews">
            <MyRating rating={parseFloat(reviews.avarge) || 0} />
            <Link href={'#listReviews'} className="reviews">
              <ReviewsSVG />
              <span>
                {dictionary.reviews} {selectGoods.reviews.length}
              </span>
            </Link>
            <Link href="#addReview" className="write-review">
              {dictionary.writeReview}
            </Link>
            <div
              style={{
                backgroundColor:
                  selectGoods.volumes[selectVolume].isAvailability === 'inStock'
                    ? '#edf8ea' // зелений фон для в наявності
                    : selectGoods.volumes[selectVolume].isAvailability === 'customMade'
                      ? '#fff4e5' // оранжевий фон для під замовлення
                      : '#ffe5e5', // червоний фон для відсутності
                color:
                  selectGoods.volumes[selectVolume].isAvailability === 'inStock'
                    ? '#43b02a' // зелений текст
                    : selectGoods.volumes[selectVolume].isAvailability === 'customMade'
                      ? '#ff8c00' // оранжевий текст
                      : '#ff0000', // червоний текст
              }}
              className="is-availability"
            >
              {selectGoods.volumes[selectVolume].isAvailability === 'inStock' ? (
                <AvailabilityTrue />
              ) : selectGoods.volumes[selectVolume].isAvailability === 'customMade' ? (
                <></>
              ) : (
                <IoCloseCircle size={21} />
              )}
              <p>{t('stock.' + selectGoods.volumes[selectVolume].isAvailability)}</p>
            </div>
          </div>
          <div className="art">Артикул: {selectGoods.volumes[selectVolume].art}</div>
        </div>
        <div className="text-container-card list-info-for-made">
          <div className="info-for-made producer">
            <div className="title">{dictionary.producer}</div>
            <div className="line" />
            <div className="info">
              <Link
                style={{ whiteSpace: 'nowrap' }}
                href={getLocalizedPath(`/${lang}/brands/${toSlug(selectGoods.brend.name)}/1`, lang)}
              >
                {selectGoods.brend.name}
              </Link>
            </div>
          </div>
          <div className="info-for-made country">
            <div style={{ whiteSpace: 'nowrap' }} className="title">
              {dictionary.countryProducer}
            </div>
            <div className="line" />
            <div className="info" style={{ whiteSpace: 'nowrap' }}>
              <Link
                style={{ whiteSpace: 'nowrap' }}
                href={getLocalizedPath(
                  `/${lang}/goods/1?country=${selectGoods.countryMade.id}`,
                  lang
                )}
              >
                {lang == 'ru' ? selectGoods.countryMade.nameru : selectGoods.countryMade.nameuk}
              </Link>
            </div>
          </div>
          {selectGoods.nameTypeuk && (
            <div className="info-for-made list-masa">
              <div className="title">
                {lang == 'ru' ? selectGoods.nameTyperu : selectGoods.nameTypeuk}:
              </div>
              <div className="line" />
              <div className="info" onMouseLeave={() => unHoverVolume()}>
                {selectGoods.volumes.map((x, idx) => {
                  if (selectVolume == idx) {
                    return (
                      <div
                        key={x.id}
                        onMouseEnter={() => hoverVolume(idx)}
                        onClick={() => setVolume(idx)}
                        className={`masa ${selectVolume == idx && 'masa-select'}`}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {x.volume.split('||')[lang == 'ru' ? 1 : 0]} {x.nameVolume}
                      </div>
                    );
                  } else
                    return (
                      <div
                        key={x.id}
                        onMouseEnter={() => hoverVolume(idx)}
                        className={`masa ${selectVolume == idx && 'masa-select'}`}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {x.volume.split('||')[lang == 'ru' ? 1 : 0]} {x.nameVolume}
                      </div>
                    );
                })}
              </div>
            </div>
          )}
        </div>
        <div id="selectGoodsText" className="text-container-card buy">
          <div className="price-container-with-width">
            <div className="price-container">
              <div className="price-no-discount-and-discount">
                {selectGoods.volumes[selectVolume].discount > 0 && (
                  <>
                    <div className="price-no-discount">
                      {selectGoods.volumes[selectVolume].price} <span>₴</span>
                    </div>
                    <div className="discount">-{selectGoods.volumes[selectVolume].discount}%</div>
                  </>
                )}
              </div>
              <div className="price-with-discount">
                {selectGoods.volumes[selectVolume].priceWithDiscount} <span>₴</span>
              </div>
            </div>
            <div className={`like ${isInLike ? 'isLike' : ''}`} onClick={inLike}>
              <LikeSVG />
            </div>
          </div>
          <div className="button-buy">
            <button className={isInBasket ? 'inBasket' : ''} onClick={inBasket}>
              {!isInBasket ? (
                <>
                  <BasketSVG /> {dictionary.buy}
                </>
              ) : (
                <>
                  <BasketSVG /> {lang == 'ru' ? 'В корзине' : 'У кошику'}
                </>
              )}
            </button>
          </div>
          <div onClick={fastBuyOpen} className="fast-buy">
            <button>{dictionary.fastBuy}</button>
          </div>
          <div className={`like ${isInLike ? 'isLike' : ''}`} onClick={inLike}>
            <LikeSVG />
          </div>
        </div>
        <div className="text-container-card delivery">
          <h4>{dictionary.delivery}</h4>
          <div className="list-post">
            <div className="title">
              <NewPostSVG />
              <h4>{dictionary.newPost}</h4>
            </div>
            <ul>
              <li>{dictionary.department}</li>
              <li>{dictionary.inPostmat}</li>
              <li>{dictionary.curuer}</li>
            </ul>
          </div>
          <div className="list-post">
            <div className="title">
              <UkrPostSVG />
              <h4>{dictionary.urkPost}</h4>
            </div>
            <ul>
              <li>{dictionary.deliveryUrkPost}</li>
            </ul>
          </div>
          <div className="info">{dictionary.deliveryInfo}</div>
        </div>
        <div className="pay">
          <h4>{dictionary.pay}</h4>
          <div className="info">{dictionary.payInfo}</div>
        </div>
      </div>
    </>
  );
};

export default SelectGoodsTextContainer;
