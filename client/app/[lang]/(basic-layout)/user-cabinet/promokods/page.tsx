import React from 'react';
import './Promokods.scss';

type Props = {};

const page = (props: Props) => {
  return (
    <div className="promokods-container">
      <h1 className="promokods-title">Промокоди</h1>

      <div className="promokods-card">
        <div className="promokods-form-block">
          <label htmlFor="promocode" className="promokods-label">
            Промокод
          </label>

          <div className="promokods-form-row">
            <input
              id="promocode"
              type="text"
              className="promokods-input"
              placeholder="Введіть промокод"
            />
            <button type="button" className="promokods-button">
              Активувати
            </button>
          </div>
        </div>

        <div className="promokods-empty-state">
          <img
            src="/images/promocode-icon.svg"
            alt="Промокод"
            className="promokods-image"
          />
          <p className="promokods-empty-text">
            Перевірте електронну пошту — там ви знайдете свої активні промокоди
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;