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

type Props = {
  goods: GoodInterface;
  dictionary: any;
  lang: Locale;
};

const MiniGoods = ({ goods, dictionary, lang }: Props) => {
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
  return (
    <Link
      href={getLocalizedPath(`/${lang}/goods/${goods.volumes[0].url}`, lang)}
      className="mini-goods-container"
    >
      <div className="mini-goods-main1">
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
        <h3>{lang == 'ru' ? goods.nameru : goods.nameuk}</h3>
        <div className="rating-and-reviews">
          <div className="rating">
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={star <= Math.round(parseFloat(goods.averageRating)) ? '#fe680a' : '#e1e6ee'}
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
            <span>
              {/*goods.countStar*/}
              {goods.averageRating ? parseFloat(goods.averageRating) : 0}
            </span>
          </div>
          <div className="reviews">
            {t('miniGoods.reviews')} ({/*goods.countReview*/}
            {goods.reviews?.length || 0})
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
              className={selectVolumeIdx == idx ? 'volume select-volume' : 'volume'}
            >
              {x.volume.split('||')[lang == 'ru' ? 1 : 0]} {x.nameVolume}
            </div>
          ))}
        </div>
        <div className="price-and-basket">
          <div className="price-container">
            {goods.volumes[selectVolumeIdx].discount != 0 && (
              <>
                <div className="price-and-discount">
                  <div className="price">{goods.volumes[selectVolumeIdx].price} ₴</div>

                  <div className="discount">-{goods.volumes[selectVolumeIdx].discount}%</div>
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
