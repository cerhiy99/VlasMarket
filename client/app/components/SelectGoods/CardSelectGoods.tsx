'use client';
import React, { useEffect, useRef, useState } from 'react';
import InBasket from './InBasket';
import Image from 'next/image';
import LikeSVG from '../../assest/Goods/LikeBig.svg';
import BasketBig from '../../assest/Goods/BasketBig.svg';
import MyRating from './MyRating';
import ReviewsSVG from '../../assest/Goods/Revies.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { addToBasket, addToLike, removeFromLike } from '@/app/store/reducers/cartReducer';
import { GoodInterface } from '@/app/interfaces/goods';
import { Locale } from '@/i18n.config';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/context/TranslationProvider';
import { $host } from '@/app/http';

//const widthBorderAndShadow = 0;
//const maxWidthScreen = 1600;
const heightHeader = 112;

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

const revie: any = {
  countImgs: 8,
  avarge: 4.1,
  countReviews: 51,
  count5: 32,
  count4: 7,
  count3: 2,
  count2: 1,
  count1: 7,
  listReviews: [
    {
      id: 1,
      name: 'Ольга Михайловская',
      description:
        '3.08.24 придбала в магазині Comfi мультиварку Perfezza PMC-013. При першому використанні мультиварка перестала працювати. Її відправляють на ремонт на срок до місяця. Гроші заплатила, мультиварки немає. Шкода, що продають в Comfi настільки не якісний товар.',
      countStar: 4,
      img: 'image5.png',
      disadvantages: '15 хвилин роботи і зламалася.',
      date: '24 серпня 2024',
    },
    {
      id: 2,
      name: 'Ольга Михайловская',
      description:
        '3.08.24 придбала в магазині Comfi мультиварку Perfezza PMC-013. При першому використанні мультиварка перестала працювати. Її відправляють на ремонт на срок до місяця. Гроші заплатила, мультиварки немає. Шкода, що продають в Comfi настільки не якісний товар.',
      countStar: 4,
      img: 'image5.png',
      disadvantages: '15 хвилин роботи і зламалася.',
      date: '24 серпня 2024',
    },
    {
      id: 3,
      name: 'Ольга Михайловская',
      description:
        '3.08.24 придбала в магазині Comfi мультиварку Perfezza PMC-013. При першому використанні мультиварка перестала працювати. Її відправляють на ремонт на срок до місяця. Гроші заплатила, мультиварки немає. Шкода, що продають в Comfi настільки не якісний товар.',
      countStar: 4,
      img: 'image5.png',
      disadvantages: '15 хвилин роботи і зламалася.',
      date: '24 серпня 2024',
    },
    {
      id: 9,
      name: 'Ольга Михайловская',
      description:
        '3.08.24 придбала в магазині Comfi мультиварку Perfezza PMC-013. При першому використанні мультиварка перестала працювати. Її відправляють на ремонт на срок до місяця. Гроші заплатила, мультиварки немає. Шкода, що продають в Comfi настільки не якісний товар.',
      countStar: 4,
      img: 'image5.png',
      disadvantages: '15 хвилин роботи і зламалася.',
      date: '24 серпня 2024',
    },
    {
      id: 12,
      name: 'Ольга Михайловская',
      description:
        '3.08.24 придбала в магазині Comfi мультиварку Perfezza PMC-013. При першому використанні мультиварка перестала працювати. Її відправляють на ремонт на срок до місяця. Гроші заплатила, мультиварки немає. Шкода, що продають в Comfi настільки не якісний товар.',
      countStar: 4,
      img: 'image5.png',
      disadvantages: '15 хвилин роботи і зламалася.',
      date: '24 серпня 2024',
    },
  ],
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
  const { like } = useSelector((state: RootState) => state.BasketAndLike);
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
  const [isInBasket, setIsInBasket] = useState(false); //тимчасово
  const { basket } = useSelector((state: RootState) => state.BasketAndLike);

  useEffect(() => {
    setIsInBasket(basket.findIndex((x) => x.id == selectGoods.id) != -1);
  }, [basket]);

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

  /*const [topFatherElem, setTopFatherElem] = useState(0);

  useEffect(() => {
    const elem = document.querySelector('#aboutGoodsContainer');
    //console.log(43, elem?.getBoundingClientRect().y)
    setTopFatherElem(elem?.getBoundingClientRect().y || -32);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (cardGoods.current) {
        const elem = document.querySelector('#aboutGoodsContainer');
        if (elem) {
          const borderHeight = 0;
          const topElem = elem.getBoundingClientRect().y;
          const elemHeight = elem.getBoundingClientRect().height;
          const leftElem = elem.getBoundingClientRect().x;
          const heightSelectGoods =
            cardGoods.current.getBoundingClientRect().height;
          const heightHeader = 110;
          const heightMonitor = window.innerHeight;
          if (
            topElem * -1 + heightHeader >
            elemHeight -
              heightMonitor / 2 -
              heightSelectGoods / 2 +
              heightHeader / 2
          ) {
            cardGoods.current.style.position = 'absolute';
            cardGoods.current.style.top = elemHeight - heightSelectGoods + 'px';
            cardGoods.current.style.right = 0;
          } else if (
            topElem &&
            topElem <
              heightMonitor / 2 - heightSelectGoods / 2 + heightHeader / 2
          ) {
            //cardGoods.current.style.top =
              //(topElem * -1 + heightHeader).toString() + 'px'
            cardGoods.current.style.right = leftElem + 'px';

            cardGoods.current.style.position = 'fixed';
            cardGoods.current.style.top = `${
              heightMonitor / 2 - heightSelectGoods / 2 + heightHeader / 2
            }px`;
          } else {
            cardGoods.current.style.position = 'absolute';
            cardGoods.current.style.right = 0;
            cardGoods.current.style.top = -borderHeight + 'px';
          }
        }
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, [cardGoods]);*/
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
          {isDiscount && <div className="discount">{lang == 'ru' ? 'Акция' : 'Акція'}</div>}
          {isHit && <div className="is-hit">Топ продаж</div>}
          {isFreeDelivery && <div className="is-free-delivery">{t('miniGoods2.freeDelivery')}</div>}
          {isNovetly && <div className="is-hit">Новинка</div>}
        </div>
        <Image
          src={process.env.NEXT_PUBLIC_SERVER + selectGoods.volumes[selectVolume].imgs[0].img}
          unoptimized={true}
          alt={
            lang == 'ru'
              ? selectGoods.volumes[selectVolume].imgs[0].volumeru
              : selectGoods.volumes[selectVolume].imgs[0].volumeuk
          }
          width={359}
          height={323}
          style={{ paddingTop: isPadding ? '35px' : 0 }}
        />
      </div>
      <div className="name">{lang == 'ru' ? selectGoods.nameru : selectGoods.nameuk}</div>
      <div className="additional-container">
        <div className="additionall">
          <MyRating rating={review.avarge} />
          <div className="reviews">
            <ReviewsSVG />
            <span onClick={() => router.push('#listReviews')}>
              {t('selectGoods.reviews')}: {review.listReviews.length}
            </span>
          </div>
          <div onClick={() => router.push('#addReview')} className="write-review">
            {t('selectGoods.writeReview')}
          </div>
        </div>
        <div className="art">Артикул: {selectGoods.volumes[selectVolume].art}</div>
      </div>
      <div className="buy">
        <div className="price">
          {selectGoods.volumes[selectVolume].discount > 0 && (
            <div className="price-no-discount-and-discount">
              <div className="price-no-discount">{selectGoods.volumes[selectVolume].price}₴</div>
              <div className="discount">-{selectGoods.volumes[selectVolume].discount}%</div>
            </div>
          )}
          <div className="price-with-discount">
            {selectGoods.volumes[selectVolume].priceWithDiscount} <span>₴</span>
          </div>
        </div>
        <div className="button-buy">
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
        <div className={`like ${isInLike ? 'isLike' : ''}`} onClick={inLike}>
          <LikeSVG />
        </div>
      </div>
    </div>
  );
};

export default CardSelectGoods;
