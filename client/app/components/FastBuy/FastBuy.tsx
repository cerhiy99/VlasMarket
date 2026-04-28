'use client';
import { Locale } from '@/i18n.config';
import React, { useEffect, useRef, useState } from 'react';
import './FastBuy.scss';
import CloseSVG from '../../assest/Goods/Close.svg';
import Inputmask from 'inputmask';
import { $host } from '@/app/http';
import { useTranslation } from '@/context/TranslationProvider';

type Props = {
  lang: Locale;
  fastBuy: boolean;
  setFastBuy: Function;
  idGoods: number;
  idVolume: string;
  nameProduct: string;
  realIdVolume: number;
};

const FastBuy = ({
  lang,
  fastBuy,
  setFastBuy,
  idGoods,
  idVolume,
  nameProduct,
  realIdVolume,
}: Props) => {
  const { t } = useTranslation();
  const phoneInputRef = useRef<HTMLInputElement>(null);

  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (phoneInputRef.current) {
      Inputmask('+380 (99) 999-99-99').mask(phoneInputRef.current);
    }
  }, [fastBuy]);

  const sumbit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setMessage('');
      setError('');

      await $host.post('order/fastOrder', {
        name,
        phone: number,
        goodsID: idGoods,
        realIdVolumeAndCountArray: [{ realIdVolume, count: 1 }],
      });

      setMessage('Заявка успішно надіслана.');
      setError('');
    } catch (err) {
      setError(
        'Сталася помилка, спробуйте пізніше або зателефонуйте за номером ' +
          process.env.NEXT_PUBLIC_PHONE_1
      );
      setMessage('');
      console.log(err);
    }
  };

  if (!fastBuy) return null;

  return (
    <div className="fast-buy-container">
      <div className="fast-buy-form">
        <div className="title">
          <h3>{t('fastBuy.title')}</h3>
          <div className="close" onClick={() => setFastBuy(false)}>
            <CloseSVG />
          </div>
        </div>

        <form onSubmit={sumbit} className="other">
          <div className="row">
            <label>
              {t('fastBuy.name')} <span>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('fastBuy.name') as string}
              required
            />
          </div>

          <div className="row">
            <label>
              {t('fastBuy.phone')} <span>*</span>
            </label>
            <input
              ref={phoneInputRef}
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder={t('fastBuy.phone') as string}
              pattern="^\+380 \(\d{2}\) \d{3}-\d{2}-\d{2}$"
              required
            />
          </div>

          <p className="fast-buy-text">
            {lang == 'ru'
              ? 'Все детали заказа, такие как оплата, доставка и другие условия, мы согласуем с вами во время телефонного разговора.'
              : 'Усі деталі замовлення, такі як оплата, доставка та інші умови, ми погодимо з вами під час телефонної розмови.'}
          </p>

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <div className="but">
            <button type="submit">{t('fastBuy.buy')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FastBuy;
