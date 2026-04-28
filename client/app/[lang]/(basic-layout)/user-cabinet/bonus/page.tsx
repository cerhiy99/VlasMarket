'use client';
import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import './Bonus.scss';
import { Locale } from '@/i18n.config';
import { $authHost } from '@/app/http';

type Props = {
  params: Promise<{ lang: Locale }>;
};

const Page = ({ params }: Props) => {
  const { lang } = use(params);

  const [info, setInfo] = useState({
    available: 0,
    pending: 0,
    spent: 0,
    daysUntilExpire: 0,
  });

  const getMyBonus = async () => {
    try {
      const res = await $authHost.get('order/getBonusFull');
      setInfo(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMyBonus();
  }, []);

  return (
    <div className="bonus-page-container">
      <h1 className="bonus-page-title">
        {lang == 'ru' ? 'Мои бонусы' : 'Мої бонуси'}
      </h1>

      <div className="bonus-stats-grid">
        <div className="bonus-stat-card">
          <div className="bonus-stat-card__title-row">
            <h3>{lang == 'ru' ? 'Доступно' : 'Доступно'}</h3>
            <div className="bonus-tooltip">
              <img src="/images/bonus-info-icon.svg" alt="" />
              <div className="bonus-tooltip-text">
                {lang == 'ru'
                  ? 'Бонусы можно использовать для оплаты'
                  : 'Бонуси можна використати для оплати'}
              </div>
            </div>
          </div>
          <p>{info.available} грн</p>
        </div>

        <div className="bonus-stat-card">
          <div className="bonus-stat-card__title-row">
            <h3>
              {lang == 'ru' ? 'Ожидают начисления' : 'Очікують нарахування'}
            </h3>
            <div className="bonus-tooltip">
              <img src="/images/bonus-info-icon.svg" alt="" />
              <div className="bonus-tooltip-text">
                {lang == 'ru'
                  ? 'Бонусы становятся доступны через 20 дней после получения заказа'
                  : 'Бонуси стають доступними через 20 днів після отримання замовлення'}
              </div>
            </div>
          </div>
          <p>{info.pending} грн</p>
        </div>

        <div className="bonus-stat-card">
          <div className="bonus-stat-card__title-row">
            <h3>{lang == 'ru' ? 'Моя экономия' : 'Моя економія'}</h3>
            <div className="bonus-tooltip">
              <img src="/images/bonus-info-icon.svg" alt="" />
              <div className="bonus-tooltip-text">
                {lang == 'ru'
                  ? 'Общая сумма использованных бонусов'
                  : 'Загальна сума використаних бонусів'}
              </div>
            </div>
          </div>
          <p>{info.spent} грн</p>
        </div>

        <div className="bonus-stat-card">
          <div className="bonus-stat-card__title-row">
            <h3>
              {lang == 'ru' ? 'Срок действия бонусов' : 'Термін дії бонусів'}
            </h3>
            <div className="bonus-tooltip">
              <img src="/images/bonus-info-icon.svg" alt="" />
              <div className="bonus-tooltip-text">
                {lang == 'ru'
                  ? 'Бонусы аннулируются через 365 дней после последней покупки'
                  : 'Бонуси анулюються через 365 днів після останньої покупки'}
              </div>
            </div>
          </div>
          <p>{info.daysUntilExpire} днів</p>
        </div>
      </div>

      <div className="bonus-bottom-grid">
        <div className="bonus-info-card">
          <h2>
            {lang == 'ru'
              ? 'Как работает программа лояльности?'
              : 'Як працює програма лояльності?'}
          </h2>

          <p>
            {lang == 'ru'
              ? 'Получайте бонусы за каждую покупку и используйте их для оплаты заказов.'
              : 'Отримуйте бонуси за кожну покупку та використовуйте їх для оплати замовлень.'}
          </p>

          <Link href="/bonus" className="bonus-link-btn">
            {lang == 'ru'
              ? 'Подробнее о программе'
              : 'Детальніше про бонусну програму'}
            <span>→</span>
          </Link>
        </div>

        <div className="bonus-more-card">
          <div className="bonus-more-card__content">
            <h2>
              {lang == 'ru'
                ? 'Как получить больше бонусов?'
                : 'Як отримати більше бонусів?'}
            </h2>

            <ul>
              <li>
                <img src="/images/bonus-check-icon.svg" alt="" />
                <span>
                  {lang == 'ru' ? 'Делайте покупки' : 'Робіть покупки'}
                </span>
              </li>
              <li>
                <img src="/images/bonus-check-icon.svg" alt="" />
                <span>
                  {lang == 'ru'
                    ? 'Используйте акции'
                    : 'Використовуйте акційні пропозиції'}
                </span>
              </li>
              <li>
                <img src="/images/bonus-check-icon.svg" alt="" />
                <span>
                  {lang == 'ru'
                    ? 'Получайте бонусы за заказы'
                    : 'Отримуйте бонуси за кожне замовлення'}
                </span>
              </li>
            </ul>
          </div>

          <div className="bonus-more-card__image">
            <img src="/images/bonus-gift-image.svg" alt="bonus" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
