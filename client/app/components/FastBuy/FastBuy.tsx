'use client';
import { Locale } from '@/i18n.config';
import React, { useEffect, useRef, useState } from 'react';
import './FastBuy.scss';
import { IoClose } from 'react-icons/io5';
import Inputmask from 'inputmask';
import { $host } from '@/app/http';
import { useTranslation } from '@/context/TranslationProvider';

type Props = {
  lang: Locale;
  fastBuy: boolean;
  setFastBuy: Function;
  idGoods: number;
  idVolume: string; //url замовлення*
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
    // Ініціалізація маски для телефону через реф
    if (phoneInputRef.current) {
      Inputmask('+380 (99) 999-99-99').mask(phoneInputRef.current);
    }
  }, [fastBuy]);

  const sumbit = async (e: any) => {
    try {
      if (message || error) return;
      e.preventDefault();
      const res = await $host.post('order/fastOrder', {
        name,
        phone: number,
        goodsID: idGoods,
        idVolume,
        nameProduct,
        realIdVolume,
      });
      setMessage('Заявка успішно надіслана.');
    } catch (err) {
      setError(
        'Сталася помилка, спробуйте пізніше або зателефонуйте за номером' +
          process.env.NEXT_PUBLIC_PHONE_1
      );
      console.log(err);
    }
  };

  if (!fastBuy) {
    return false;
  }

  return (
    <div className="fast-buy-container">
      <div className="fast-buy-form">
        <div className="title">
          <h3>{t('fastBuy.title')}</h3>
          <div className="close" onClick={() => setFastBuy(false)}>
            <IoClose size={25} />
          </div>
        </div>
        <form onSubmit={sumbit} className="other">
          <div className="row">
            <label>
              {t('fastBuy.phone')} <span>*</span>
            </label>
            <input
              ref={phoneInputRef}
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="phone-input"
              placeholder="+380 (__) ___-__-__"
              pattern="^\+380 \(\d{2}\) \d{3}-\d{2}-\d{2}$"
              required
            />
          </div>
          <div className="row">
            <label>
              {t('fastBuy.name')}
              <span>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="phone-input"
              placeholder={t('fastBuy.name') as string}
              required
            />
          </div>
          {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <div className="but">
            <button>{t('fastBuy.buy')}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FastBuy;
