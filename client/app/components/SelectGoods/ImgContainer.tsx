'use client';
import React, { useEffect, useState } from 'react';
import { MdOutlineChevronLeft } from 'react-icons/md';
import { MdOutlineChevronRight } from 'react-icons/md';
import Image from 'next/image';
import { ImgInterface } from '@/app/interfaces/goods';
import { Locale } from '@/i18n.config';
import { useTranslation } from '@/context/TranslationProvider';

type Props = {
  listImg: ImgInterface[];
  isFreeDelivery: boolean;
  lang: Locale;
  isDiscount: boolean;
  isNovetly: boolean;
  isHit: boolean;
};

const ImgContainer = ({
  listImg,
  isFreeDelivery,
  lang,
  isDiscount,
  isNovetly,
  isHit,
}: Props) => {
  const [selectUrl, setSelectUrl] = useState(listImg[0]);
  const [showImg, setShowImg] = useState(false);
  const [indexShowImg, setIndexShowImg] = useState(0);

  const left = () => indexShowImg != 0 && setIndexShowImg(indexShowImg - 1);

  const right = () =>
    listImg.length - 1 != indexShowImg && setIndexShowImg(indexShowImg + 1);

  const close = () => {
    setShowImg(false);
    setIndexShowImg(0);
  };
  useEffect(() => {
    setSelectUrl(listImg[0]);
  }, [listImg]);

  const { t } = useTranslation();
  let isPadding = false;
  if (isFreeDelivery) isPadding = true;
  if (isDiscount) isPadding = true;
  if (isNovetly) isPadding = true;
  if (isHit) isPadding = true;

  return (
    <div className="select-goods-img-container">
      <div className="discount-or-hit">
        {isDiscount && (
          <div className="discount">{lang == 'ru' ? 'Акция' : 'Акція'}</div>
        )}
        {isHit && <div className="is-hit">Топ продаж</div>}
        {isFreeDelivery && (
          <div className="is-free-delivery">{t('miniGoods2.freeDelivery')}</div>
        )}
        {isNovetly && <div className="is-hit">Новинка</div>}
      </div>
      <div className="select-img">
        <Image
          onClick={() => setShowImg(!showImg)}
          src={process.env.NEXT_PUBLIC_SERVER + selectUrl.img}
          width={888}
          height={888}
          unoptimized
          alt={lang == 'ru' ? selectUrl.volumeru : selectUrl.volumeuk}
          style={{ paddingTop: isPadding ? '40px' : 0 }}
          loading="eager"
          priority
        />
      </div>
      <div className="list-img">
        {listImg.map((x) => (
          <Image
            key={x.id}
            onClick={() => setSelectUrl(x)}
            className={selectUrl === x ? 'select-mini-img' : ''}
            width={60}
            height={60}
            alt={lang == 'ru' ? x.volumeru : x.volumeuk}
            src={process.env.NEXT_PUBLIC_SERVER + x.img}
            loading="eager"
            priority
          />
        ))}
      </div>
      {showImg && (
        <div className="show-img" onClick={close}>
          <div className="show-img-container">
            <div
              style={{ opacity: indexShowImg != 0 ? 1 : 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                left();
              }}
              className="arrow left"
            >
              <MdOutlineChevronLeft size={60} />
            </div>
            <Image
              width={888}
              height={888}
              alt={
                [selectUrl, ...listImg.filter((x) => x.id != selectUrl.id)][
                  indexShowImg
                ][`volume${lang == 'ru' ? 'ru' : 'uk'}`]
              }
              src={
                process.env.NEXT_PUBLIC_SERVER +
                [selectUrl, ...listImg.filter((x) => x.id != selectUrl.id)][
                  indexShowImg
                ].img
              }
              loading="eager"
              priority
            />
            <div
              style={{ opacity: listImg.length - 1 != indexShowImg ? 1 : 0.2 }}
              onClick={(e) => {
                e.stopPropagation();
                right();
              }}
              className="arrow right"
            >
              <MdOutlineChevronRight size={60} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImgContainer;
