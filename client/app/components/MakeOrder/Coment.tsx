'use client';
import React, { useState } from 'react';
import './Coment.scss';
import ArrowDown from '../../assest/MakeOrder/ArrowDown.svg'; // У разі використання SVG як React-компонента
import { useTranslation } from '@/context/TranslationProvider';

type Props = {
  coment: string;
  setComent: Function;
  isOpen: boolean;
  setIsOpen: Function;
};

const Coment = ({ coment, setComent, isOpen, setIsOpen }: Props) => {
  const { t } = useTranslation();
  return (
    <div className="coment-container">
      <div onClick={() => setIsOpen(!isOpen)} className="coment-tile">
        <p>{t('makeOrder.comment.title')}</p>
        <div
          className={`coment-title-svg ${isOpen ? 'rotate' : ''}`} // Додаємо клас для обертання
        >
          <ArrowDown />
        </div>
      </div>
      <div className={`open ${isOpen ? 'visible' : ''}`}>
        <textarea
          value={coment}
          onChange={(e) => setComent(e.target.value)}
          placeholder={t('makeOrder.comment.yourComment') as string}
          rows={2}
        />

        <button
          style={{ opacity: coment.length > 3 ? 1 : 0.6, cursor: 'pointer' }}
          type="button"
          onClick={() => setIsOpen(false)}
        >
          {t('makeOrder.comment.save')}
        </button>
      </div>
    </div>
  );
};

export default Coment;
