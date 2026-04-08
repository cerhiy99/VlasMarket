'use client';

import React, { useState } from 'react';
import './Promokods.scss';

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

const Page = () => {
  const [promoValue, setPromoValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'error' | 'success'>('idle');
  const [statusText, setStatusText] = useState('');
  const [activatedPromos, setActivatedPromos] = useState<PromoItem[]>([]);

  const handleActivatePromo = () => {
    const normalizedCode = promoValue.trim().toUpperCase();

    if (!normalizedCode) {
      setStatus('error');
      setStatusText('Промокод не знайдено');
      return;
    }

    const foundPromo = mockPromoDatabase.find(
      (item) => item.code.toUpperCase() === normalizedCode
    );

    if (!foundPromo) {
      setStatus('error');
      setStatusText('Промокод не знайдено');
      return;
    }

    const alreadyActivated = activatedPromos.some(
      (item) => item.code.toUpperCase() === normalizedCode
    );

    if (alreadyActivated) {
      setStatus('success');
      setStatusText('Промокод успішно застосовано');
      return;
    }

    setActivatedPromos((prev) => [...prev, foundPromo]);
    setStatus('success');
    setStatusText('Промокод успішно застосовано');
    setPromoValue('');
  };

  return (
    <div className="promokods-container">
      <h1 className="promokods-title">Промокоди</h1>

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
              placeholder="Введіть промокод"
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
              Активувати
            </button>
          </div>
        </div>

        {activatedPromos.length > 0 ? (
          <div className="promokods-list">
            {activatedPromos.map((promo) => (
              <div className="promokods-item" key={promo.id}>
                <div className="promokods-item-left">
                  <div className="promokods-item-icon">
                    <img src={promo.icon} alt={promo.title} />
                  </div>

                  <div className="promokods-item-info">
                    <p className="promokods-item-discount">
                      {promo.discountText}
                    </p>
                  </div>
                </div>

                <div className="promokods-item-status">
                  {promo.activatedText}
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
              Перевірте електронну пошту — там ви знайдете свої активні
              промокоди
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;