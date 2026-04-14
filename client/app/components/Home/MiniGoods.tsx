'use client';
import React, { useState } from 'react';
import './MiniGoods.scss';
import DiscountOrFreeShippingOrOther from './DiscountOrFreeShippingOrOther';
import Like from './Like';
import Link from 'next/link';
import { Locale } from '@/i18n.config';
import InBasket from './InBasket';
import Image from 'next/image';
import { GoodInterface } from '@/app/interfaces/goods';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { useTranslation } from '@/context/TranslationProvider';
import ComparisonSVG from '../../assest/Goods/comparison.svg';
import BonusSVG from '../../assest/Goods/Bonus.svg';
import Comparison from './Comparison';
import MyRating from '../SelectGoods/MyRating';

type Props = {
  goods: GoodInterface;
  dictionary?: any;
  lang: Locale;
};

const MiniGoods = ({ goods, dictionary, lang }: Props) => {
  const countBonus = 100;
  const [selectVolumeIdx, setSelectVolumeIdx] = useState(0);

  const [clickedVolumeIdx, setClickedVolumeIdx] = useState(0);

  const clickToVolume = (idx: number) => {
    setSelectVolumeIdx(idx);
    setClickedVolumeIdx(idx);
  };

  const hoverVolume = (idx: number) => {
    setSelectVolumeIdx(idx);
  };

  const unHoverVolume = () => {
    setSelectVolumeIdx(clickedVolumeIdx);
  };
  const { t } = useTranslation();
  if (goods.id == 26388) {
    console.log(goods);
  }
  return (
    <Link
      href={getLocalizedPath(`/${lang}/goods/${goods.volumes[0].url}`, lang)}
      className="mini-goods-container"
    >
      <div className="mini-goods-main1">
        <div className="img-with-add">
          <div className="like-and-discount-or-other">
            <DiscountOrFreeShippingOrOther
              isNovetly={goods.isNovetly}
              isBestseller={goods.isBestseller}
              isFreeShipping={goods.volumes[selectVolumeIdx].isFreeDelivery}
              isDiscount={goods.isDiscount}
              isHit={goods.isHit}
            />
            <div className="like-svg-container">
              <Like selectVolumeIdx={selectVolumeIdx} goods={goods} />
              <Comparison goods={goods} selectVolumeIdx={selectVolumeIdx} />
            </div>
          </div>
          <div className="img-container">
            {/*<img
            alt={
              lang == 'ru'
                ? goods.volumes[selectVolumeIdx].imgs[0].volumeru
                : goods.volumes[selectVolumeIdx].imgs[0].volumeuk
            }
            src={
              process.env.NEXT_PUBLIC_SERVER +
              goods.volumes[selectVolumeIdx].imgs[0].img
            }
          />*/}
            <Image
              src={`${process.env.NEXT_PUBLIC_SERVER}${goods.volumes[selectVolumeIdx].imgs[0].img}`}
              fill
              alt={lang === 'ru' ? goods.nameru : goods.nameuk}
              // На мобілці (до 768px) — фото займає 50vw (пів екрану), на ПК — близько 300px
              sizes="(max-width: 768px) 50vw, 300px"
              // 3. Якість 75 — це золота середина між вагою та чіткістю
              quality={75}
              className="object-contain" // або object-cover, щоб зберегти пропорції
            />
          </div>
        </div>

        <div className="bonus-container bonus-container-mob">
          <div className="bonus">
            <div className="svg">
              <BonusSVG />
            </div>
            <span>+ {countBonus}</span>
            {lang == 'ru' ? 'бонусов' : 'бонусів '}
          </div>
        </div>
        <h3>{lang == 'ru' ? goods.nameru : goods.nameuk}</h3>
        <div className="rating-and-art">
          <div className="rating">
            <MyRating rating={parseFloat(goods.averageRating)} />
            <span>
              ({goods.reviews?.length || 0}){' '}
              {lang == 'ru' ? 'Отзивов' : 'Відгуків'}
              {/*goods.countReview*/}
            </span>
          </div>
          <div className="art-mini-goods">
            Артикул: {goods.volumes[selectVolumeIdx].art}
          </div>
        </div>
        <div className="list-volume" onMouseLeave={() => unHoverVolume()}>
          {goods.volumes.map((x, idx) => (
            <div
              key={x.id}
              onClick={(e) => {
                e.preventDefault();
                clickToVolume(idx);
              }}
              onMouseEnter={() => hoverVolume(idx)}
              className={
                selectVolumeIdx == idx ? 'volume select-volume' : 'volume'
              }
            >
              {x.volume.split('||')[lang == 'ru' ? 1 : 0]} {x.nameVolume}
            </div>
          ))}
        </div>
        <div className="price-and-basket">
          <div className="price-container">
            <div className="bonus-container bonus-container-pc">
              <div className="bonus">
                <div className="svg">
                  <BonusSVG />
                </div>
                <span>+ {countBonus}</span>
                {lang == 'ru' ? 'бонусов' : 'бонусів '}
              </div>
            </div>
            {goods.volumes[selectVolumeIdx].discount != 0 && (
              <>
                <div className="price-and-discount">
                  <div className="price">
                    {goods.volumes[selectVolumeIdx].price} ₴
                  </div>

                  <div className="discount">
                    -{goods.volumes[selectVolumeIdx].discount}%
                  </div>
                </div>
              </>
            )}

            <div className="price-with-discount">
              {goods.volumes[selectVolumeIdx].priceWithDiscount} <span>₴</span>
            </div>
          </div>
          <InBasket selectGoods={goods} selectVolumeIdx={selectVolumeIdx} />
        </div>
      </div>
    </Link>
  );
};

export default MiniGoods;
