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

type Props = {
  goods: GoodInterface;
  dictionary: any;
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
              <div className="comparison">
                <ComparisonSVG />
              </div>
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
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill={
                    star <= Math.round(parseFloat(goods.averageRating))
                      ? '#fe680a'
                      : '#ffffff'
                  }
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4.44348 0.621094C4.59077 0.325891 5.01298 0.32589 5.16028 0.621094L6.03235 2.37109C6.20708 2.72138 6.54167 2.96462 6.92883 3.02246L8.86243 3.31152C9.18851 3.36061 9.31844 3.76097 9.08313 3.99219L7.6886 5.3623C7.40949 5.63668 7.28225 6.02998 7.3468 6.41602L7.66907 8.34473C7.72317 8.67003 7.38259 8.917 7.08997 8.76465L5.35559 7.8623C5.00849 7.68175 4.59527 7.68175 4.24817 7.8623L2.51379 8.76465C2.22117 8.91699 1.88059 8.67003 1.93469 8.34473L2.25696 6.41602C2.32151 6.02998 2.19427 5.63668 1.91516 5.3623L0.52063 3.99219C0.285323 3.76097 0.415249 3.36061 0.741333 3.31152L2.67493 3.02246C3.06209 2.96462 3.39668 2.72138 3.57141 2.37109L4.44348 0.621094Z"
                    stroke="#7F7F7F"
                    stroke-width="0.8"
                  />
                </svg>
              ))}
            </div>
            <span>
              ({goods.reviews?.length || 0}) {t('miniGoods.reviews')}
              {/*goods.countReview*/}
            </span>
          </div>
          <div className="art">
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
        <div className="bonus-container bonus-container-pc">
          <div className="bonus">
            <div className="svg">
              <BonusSVG />
            </div>
            <span>+ {countBonus}</span>
            {lang == 'ru' ? 'бонусов' : 'бонусів '}
          </div>
        </div>
        <div className="price-and-basket">
          <div className="price-container">
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
