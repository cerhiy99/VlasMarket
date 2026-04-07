import { GoodInterface } from '@/app/interfaces/goods';
import { Locale } from '@/i18n.config';
import React, { useState, useRef } from 'react';
import WatchSVG from '../../../assest/Watch.svg';

type Props = {
  good: GoodInterface;
  lang: Locale;
};

const ShowInfo = ({ good, lang }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const content = lang === 'ru' ? good.descriptionru : good.descriptionuk;

  return (
    <div className="info-for-good">
      <h3>{lang === 'ru' ? 'Описание товара:' : 'Опис товару:'}</h3>

      <div className={`desc-container ${isOpen ? 'open' : 'closed'}`}>
        <div
          className="desc-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {!isOpen && <div className="fade-overlay" />}
      </div>
      <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen
          ? lang === 'ru'
            ? 'Свернуть'
            : 'Згорнути'
          : lang === 'ru'
            ? 'Показать еще'
            : 'Показати ще'}
        <WatchSVG />
      </button>
      <div
        dangerouslySetInnerHTML={{
          __html: lang == 'ru' ? good.characteristicru : good.characteristicuk,
        }}
        className="list-charackteristik"
      />
    </div>
  );
};

export default ShowInfo;
