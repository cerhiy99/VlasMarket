'use client';
import { Locale } from '@/i18n.config';
import React, { useState, useRef } from 'react';
import './SeeMore.scss';
import Image from 'next/image';
import BasketSVG from '../../assest/Goods/BasketBig.svg';
import Link from 'next/link';
import LeftSVG from '../../assest/Goods/SeeMoreArrowLeft.svg';
import RightSVG from '../../assest/Goods/SeeMoreArrowRight.svg';
import { getLocalizedPath } from '../utils/getLocalizedPath';

type Props = {
  dictionary: any;
  lang: Locale;
  listGoods: any[];
};

const SeeMore = ({ dictionary, lang, listGoods }: Props) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (listRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = listRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
    }
  };

  const scrollLeft = () => {
    if (
      listRef.current &&
      listRef.current.firstChild &&
      listRef.current.firstChild instanceof HTMLElement // Перевірка на HTML елемент
    ) {
      listRef.current.scrollBy({
        left: -(listRef.current.firstChild.getBoundingClientRect().width + 15),
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (
      listRef.current &&
      listRef.current.firstChild &&
      listRef.current.firstChild instanceof HTMLElement // Перевірка на HTML елемент
    ) {
      listRef.current.scrollBy({
        left: listRef.current.firstChild.getBoundingClientRect().width + 15,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="see-more-container">
      <h2>{dictionary.title}</h2>
      <div className="see-more-list-goods-container">
        <div
          className={`left arrow ${
            canScrollLeft ? 'arrow-active' : 'disabled'
          }`}
          onClick={scrollLeft}
        >
          <LeftSVG />
        </div>
        <div
          className="see-more-list-goods"
          ref={listRef}
          onScroll={handleScroll}
        >
          {listGoods.map((x: any) => (
            <Link
              key={x.id}
              href={getLocalizedPath(`/${lang}/goods/${x.id}`, lang)}
            >
              <div className="see-more-goods">
                <div className="img">
                  <Image
                    src={process.env.NEXT_PUBLIC_SERVER + x.img}
                    alt={x.name}
                    width={225}
                    height={225}
                  />
                </div>
                <div className="name">{x.name}</div>
                <div className="price-and-basket">
                  <div className="price-container">
                    <div className="price-no-discount-and-discount">
                      <div className="price-no-discount">
                        {x.priceNoDiscount}₴
                      </div>
                      <div className="discount">-{x.discount}%</div>
                    </div>
                    <div className="price-with-discount">
                      {x.priceWithDiscount} <span>₴</span>
                    </div>
                  </div>
                  <div className="basket">
                    <button>
                      <BasketSVG />
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div
          className={`right arrow ${
            canScrollRight ? 'arrow-active' : 'disabled'
          }`}
          onClick={scrollRight}
        >
          <RightSVG />
        </div>
      </div>
    </div>
  );
};

export default SeeMore;
