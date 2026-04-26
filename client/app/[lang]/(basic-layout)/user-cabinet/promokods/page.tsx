'use client';

import React, { use, useEffect, useState } from 'react';
import './Promokods.scss';
import { Locale } from '@/i18n.config';
import { $authHost } from '@/app/http';

type PromoItem = {
  id: number;
  code: string;
  title: string;
  discountText: string;
  icon: string;
  activatedText: string;
};

const mockPromoDatabase: PromoItem[] = [
  {
    id: 1,
    code: 'SAVE10',
    title: 'Промокод на знижку',
    discountText: '-100 грн до суми замовлення',
    icon: '/images/promocode-sale-icon.svg',
    activatedText: 'Цей промокод активований',
  },
  {
    id: 2,
    code: 'WELCOME',
    title: 'Вітальний промокод',
    discountText: '-50 грн до суми замовлення',
    icon: '/images/promocode-gift-icon.svg',
    activatedText: 'Цей промокод активований',
  },
  {
    id: 3,
    code: 'BAYLAP200',
    title: 'Спеціальна пропозиція',
    discountText: '-200 грн до суми замовлення',
    icon: '/images/promocode-percent-icon.svg',
    activatedText: 'Цей промокод активований',
  },
];

const Page = ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = use(params);
  const [promoValue, setPromoValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [statusText, setStatusText] = useState('');
  const [activatedPromos, setActivatedPromos] = useState<PromoItem[]>([]);
  const [myPromokods, setMyPromokods] = useState([]);
  const handleActivatePromo = async () => {
    try {
      const res = await $authHost.get(
        'promokods/checkPromokod?promokodCode=' + promoValue
      );
      setStatus('success');
      setStatusText(
        lang == 'ru'
          ? 'Промокод успешно применен'
          : 'Промокод успішно застосовано'
      );
      setPromoValue('');
      getMyPromokods();
      return;
    } catch (err: any) {
      console.log(4343, err);
      setStatus('error');
      setStatusText(err.response.data.message);
    }
  };

  const getMyPromokods = async () => {
    try {
      const res = await $authHost.get('promokods/getMy');
      console.log(3434, res.data);
      setMyPromokods(res.data.myPromokods);
    } catch (err) {
      console.log(4324, err);
    }
  };

  useEffect(() => {
    getMyPromokods();
  }, []);

  return (
    <div className="promokods-container">
      <h1 className="promokods-title">
        {lang == 'ru' ? 'Промокоды' : 'Промокоди'}
      </h1>

      <div className="promokods-card">
        <div className="promokods-form-block">
          <label htmlFor="promocode" className="promokods-label">
            Промокод
          </label>

          {status !== 'idle' && (
            <p
              className={`promokods-status ${
                status === 'error'
                  ? 'promokods-status--error'
                  : 'promokods-status--success'
              }`}
            >
              {statusText}
            </p>
          )}

          <div className="promokods-form-row">
            <input
              id="promocode"
              type="text"
              className={`promokods-input ${
                status === 'error'
                  ? 'promokods-input--error'
                  : status === 'success'
                    ? 'promokods-input--success'
                    : ''
              }`}
              placeholder={
                lang == 'ru' ? 'Введите промокод' : 'Введіть промокод'
              }
              value={promoValue}
              onChange={(e) => {
                setPromoValue(e.target.value);

                if (status !== 'idle') {
                  setStatus('idle');
                  setStatusText('');
                }
              }}
            />

            <button
              type="button"
              className={`promokods-button ${
                promoValue.trim() ? 'promokods-button--active' : ''
              }`}
              onClick={handleActivatePromo}
            >
              {lang == 'ru' ? 'Активировать' : 'Активувати'}
            </button>
          </div>
        </div>

        {myPromokods.length > 0 ? (
          <div className="promokods-list">
            {myPromokods.map((promo: any) => (
              <div
                className={`promokods-item ${promo.isUse ? 'promo-use' : ''}`}
                key={promo.promokod.id}
              >
                <div className="promokods-item-left">
                  <div className="promokods-item-icon">
                    <img
                      src={process.env.NEXT_PUBLIC_SERVER + promo.promokod.img}
                      alt={
                        lang == 'ru'
                          ? promo.promokod.nameru
                          : promo.promokod.nameuk
                      }
                    />
                  </div>

                  <div className="promokods-item-info">
                    <p className="promokods-item-discount">
                      {lang == 'ru'
                        ? promo.promokod.nameru
                        : promo.promokod.nameuk}
                    </p>
                  </div>
                </div>

                <div className="promokods-item-status">
                  {promo.isUse
                    ? lang == 'ru'
                      ? 'Использовано'
                      : 'Використано'
                    : lang == 'ru'
                      ? 'Этот промокод активирован'
                      : 'Цей промокод активований'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="promokods-empty-state">
            <img
              src="/images/promocode-icon.svg"
              alt="Промокод"
              className="promokods-image"
            />
            <p className="promokods-empty-text">
              {lang == 'ru'
                ? 'Проверьте электронную почту – там вы найдете свои активные промокоды'
                : 'Перевірте електронну пошту — там ви знайдете свої активні промокоди'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
