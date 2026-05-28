'use client';
import React, { useEffect, useState } from 'react';
import './SelectGoodsTextContainer.scss';
import BasketSVG from '../../assest/Goods/BasketBig.svg';
import CompresionSVG from '../../assest/Goods/comparison.svg';
import LikeSVG from '../../assest/Goods/LikeBig.svg';
import LikeFattySVG from '../../assest/Goods/LikeFatty.svg';
import NewPostSVG from '../../assest/Goods/NewPost.svg';
import UkrPostSVG from '../../assest/Goods/UkrPost.svg';
import DeliverySVG from '../../assest/Goods/Delivery.svg';
import PaySVG from '../../assest/Goods/Pay.svg';
import { Locale } from '@/i18n.config';
import BonusSVG from '../../assest/Bonus.svg';
import Link from 'next/link';
import AvailabilityTrue from '../../assest/Goods/AvailubutlyTrue.svg';
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
import { toSlug } from '../utils/addittional';
import FastBuy from '../FastBuy/FastBuy';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/context/TranslationProvider';
import { $host } from '@/app/http';
import { IoCloseCircle } from 'react-icons/io5';
import MyRatingSelectGoods from './MyRatingSelectGoods';
import { getCountBonus } from '../utils/getCountBonus';

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
  const [isInCompresion, setisInCompresion] = useState(false);

  const { like, comparison } = useSelector(
    (state: RootState) => state.BasketAndLike
  );
  const dispatch = useDispatch();
  useEffect(() => {
    setisInCompresion(
      comparison.findIndex((x: any) => x.id == selectGoods.id) != -1
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
            volume: goods.volumes[0].volume + goods.volumes[0].nameVolume,
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
  useEffect(() => {
    setisInLike(like.findIndex((x: any) => x.id == selectGoods.id) != -1);
  }, [like]);

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
    const searchSelectVolumeId = selectGoods.volumes.findIndex(
      (x) => x.id == selectVolumeId
    );
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

  console.log(4234234, selectGoods.volumes[selectVolume]);

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
            <div
              style={{
                color:
                  selectGoods.volumes[selectVolume].isAvailability === 'inStock'
                    ? '#43B02A' // зелений текст
                    : selectGoods.volumes[selectVolume].isAvailability ===
                        'customMade'
                      ? '#ff8c00' // оранжевий текст
                      : '#ff0000', // червоний текст
              }}
              className="is-availability"
            >
              {selectGoods.volumes[selectVolume].isAvailability ===
              'inStock' ? (
                <AvailabilityTrue />
              ) : selectGoods.volumes[selectVolume].isAvailability ===
                'customMade' ? (
                <></>
              ) : (
                <IoCloseCircle size={21} />
              )}
              <p
                style={{
                  color:
                    selectGoods.volumes[selectVolume].isAvailability ===
                    'inStock'
                      ? '#43B02A' // зелений текст
                      : selectGoods.volumes[selectVolume].isAvailability ===
                          'customMade'
                        ? '#ff8c00' // оранжевий текст
                        : '#ff0000', // червоний текст
                }}
              >
                {t('stock.' + selectGoods.volumes[selectVolume].isAvailability)}
              </p>
            </div>
            <MyRatingSelectGoods rating={parseFloat(reviews.avarge) || 0} />
            <Link href={'#listReviews'} className="reviews">
              ({selectGoods.reviews.length}) {dictionary.reviews}
            </Link>
            <Link href="#addReview" className="write-review">
              {dictionary.writeReview}
            </Link>
          </div>
          <div className="art23">
            Артикул: {selectGoods.volumes[selectVolume].art}
          </div>
        </div>
        <div className="text-container-card list-info-for-made">
          <div className="info-for-made producer">
            <div className="title">{dictionary.producer}</div>
            <div className="line" />
            <div className="info">
              <Link
                style={{ whiteSpace: 'nowrap' }}
                href={getLocalizedPath(
                  `/${lang}/brands/${toSlug(selectGoods.brend.name)}/1`,
                  lang
                )}
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
                /*href={getLocalizedPath(
                  `/${lang}/goods/1?country=${selectGoods.countryMade.id}`,
                  lang
                )}*/
                href={getLocalizedPath(`/${lang}`, lang)}
              >
                {lang == 'ru'
                  ? selectGoods.countryMade.nameru
                  : selectGoods.countryMade.nameuk}
              </Link>
            </div>
          </div>
          {selectGoods.nameTypeuk && (
            <div className="info-for-made list-masa no-select">
              <div className="title">
                {lang == 'ru' ? selectGoods.nameTyperu : selectGoods.nameTypeuk}
                :
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
                        className={`masa no-select ${selectVolume == idx ? 'masa-select' : ''} ${selectGoods.volumes[idx].isAvailability == 'inStock' ? '' : 'no-avaibility'}`}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {x.volume.split('||')[lang == 'ru' ? 1 : 0]}{' '}
                        {x.nameVolume}
                      </div>
                    );
                  } else
                    return (
                      <div
                        key={x.id}
                        onMouseEnter={() => hoverVolume(idx)}
                        className={`masa no-select ${selectVolume == idx && 'masa-select'}  ${selectGoods.volumes[idx].isAvailability == 'inStock' ? '' : 'no-avaibility'}`}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {x.volume.split('||')[lang == 'ru' ? 1 : 0]}{' '}
                        {x.nameVolume}
                      </div>
                    );
                })}
              </div>
            </div>
          )}
        </div>
        <div id="selectGoodsText" className="text-container-card buy">
          <div className="price-container-with-width">
            <div className="prices-and-bonus">
              <div className="price-container">
                <div className="price-no-discount-and-discount">
                  {selectGoods.volumes[selectVolume].discount > 0 && (
                    <>
                      <div className="price-no-discount">
                        {selectGoods.volumes[selectVolume].price} <span>₴</span>
                      </div>
                      <div className="discount">
                        -{selectGoods.volumes[selectVolume].discount}%
                      </div>
                    </>
                  )}
                </div>
                <div className="price-with-discount">
                  {selectGoods.volumes[selectVolume].priceWithDiscount}{' '}
                  <span>₴</span>
                </div>
              </div>
              <div className="bonus">
                <BonusSVG />{' '}
                <span>
                  +
                  {getCountBonus(
                    selectGoods.volumes[selectVolume].priceWithDiscount
                  )}
                </span>{' '}
                {dictionary.bonus}
              </div>
            </div>

            <div
              className={`like ${isInLike ? 'isLike' : ''}`}
              onClick={inLike}
            >
              <LikeSVG />
            </div>
          </div>
          <div className="buttons">
            <div className="button-buy">
              <button
                className={isInBasket ? 'inBasket' : ''}
                onClick={inBasket}
              >
                {!isInBasket ? (
                  <>
                    <BasketSVG /> {lang == 'ru' ? 'Купити' : 'Купить'}
                  </>
                ) : (
                  <>
                    <BasketSVG /> {lang == 'ru' ? 'В корзине' : 'У кошику'}
                  </>
                )}
              </button>
            </div>
            <div onClick={fastBuyOpen} className="fast-buy">
              <button>
                {lang == 'ru' ? 'Купить в 1 клик' : 'Купити в 1 клік'}
              </button>
            </div>
          </div>
          <div className="compresion-and-like">
            <div
              className={`compresion relative ${isInCompresion ? 'isCompresion' : ''}`}
              onClick={inCompresion}
            >
              <div className="info-abs">
                {lang == 'ru'
                  ? 'Добавить в сравнение'
                  : 'Добавити у порівняння'}
              </div>

              <CompresionSVG />
            </div>
            <div
              className={`like relative ${isInLike ? 'isLike' : ''}`}
              onClick={inLike}
            >
              <div className="info-abs">
                {lang == 'ru' ? 'Избранное' : 'Вибране'}
              </div>

              <LikeFattySVG />
            </div>
          </div>
        </div>
        <div className="text-container-card delivery">
          <h4>{dictionary.delivery}</h4>
          <div className="list-post">
            <div className="title">
              <NewPostSVG />
              <h5>{dictionary.newPost}</h5>
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
              <h5>{dictionary.urkPost}</h5>
            </div>
            <ul style={{ listStyle: 'none' }}>
              <li style={{ marginLeft: 0 }}>{dictionary.deliveryUrkPost}</li>
            </ul>
          </div>
          <div className="info">
            <DeliverySVG />
            {dictionary.deliveryInfo}
          </div>
        </div>
        <div className="pay">
          <h4>{dictionary.pay}</h4>
          <div className="info">
            <PaySVG /> {dictionary.payInfo}
          </div>
        </div>
      </div>
    </>
  );
};

export default SelectGoodsTextContainer;
