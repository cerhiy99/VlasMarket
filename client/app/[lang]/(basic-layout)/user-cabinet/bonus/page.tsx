import React from 'react';
import './Bonus.scss';

type Props = {};

const page = (props: Props) => {
  return (
    <div className="bonus-page-container">
      <h1 className="bonus-page-title">Мої бонуси</h1>

      <div className="bonus-stats-grid">
        <div className="bonus-stat-card">
          <div className="bonus-stat-card__title-row">
            <h3>Доступно</h3>
            <img src="/images/bonus-info-icon.svg" alt="" />
          </div>
          <p>0 грн</p>
        </div>

        <div className="bonus-stat-card">
          <div className="bonus-stat-card__title-row">
            <h3>Очікують нарахування</h3>
            <img src="/images/bonus-info-icon.svg" alt="" />
          </div>
          <p>0 грн</p>
        </div>

        <div className="bonus-stat-card">
          <div className="bonus-stat-card__title-row">
            <h3>Моя економія:</h3>
            <img src="/images/bonus-info-icon.svg" alt="" />
          </div>
          <p>0 грн</p>
        </div>

        <div className="bonus-stat-card">
          <div className="bonus-stat-card__title-row">
            <h3>Термін дії бонусів</h3>
            <img src="/images/bonus-info-icon.svg" alt="" />
          </div>
          <p>0 днів</p>
        </div>
      </div>

      <div className="bonus-bottom-grid">
        <div className="bonus-info-card">
          <h2>Як працює програма лояльності?</h2>

          <p>
            Отримуйте бонуси за кожну покупку та використовуйте їх для часткової або
            повної оплати наступних замовлень.
          </p>

          <button type="button" className="bonus-link-btn">
            Детальніше про бонусну програму
            <span>→</span>
          </button>
        </div>

        <div className="bonus-more-card">
          <div className="bonus-more-card__content">
            <h2>Як отримати більше бонусів?</h2>

            <ul>
              <li>
                <img src="/images/bonus-check-icon.svg" alt="" />
                <span>Робіть покупки</span>
              </li>
              <li>
                <img src="/images/bonus-check-icon.svg" alt="" />
                <span>Використовуйте акційні пропозиції</span>
              </li>
              <li>
                <img src="/images/bonus-check-icon.svg" alt="" />
                <span>Отримуйте бонуси за кожне замовлення</span>
              </li>
            </ul>
          </div>

          <div className="bonus-more-card__image">
            <img src="/images/bonus-gift-image.svg" alt="Бонуси" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;