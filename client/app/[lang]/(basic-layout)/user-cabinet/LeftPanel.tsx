import React from 'react';
import './LeftPanel.scss';
import { Locale } from '@/i18n.config';

const LeftPanel = ({ lang, dictionary }: { lang: Locale; dictionary: any }) => {
  const menuItems = [
    { id: 1, label: 'Профіль', icon: '/images/profile-icon.svg' },
    { id: 2, label: 'Історія замовлень', icon: '/images/orders-icon.svg' },
    { id: 3, label: 'Список бажань', icon: '/images/wishlist-icon.svg' },
    { id: 4, label: 'Мої бонуси', icon: '/images/bonus-icon.svg' },
    { id: 5, label: 'Розсилка на пошту', icon: '/images/mailing-icon.svg' },
    { id: 6, label: 'Відгуки та коментар', icon: '/images/reviews-icon.svg' },
    { id: 7, label: 'Промокоди', icon: '/images/promo-icon.svg' },
    { id: 8, label: 'Переглянуті товари', icon: '/images/viewed-icon.svg' },
    { id: 9, label: 'Вийти з акаунту', icon: '/images/logout-icon.svg' },
  ];

  return (
    <aside className="left-panel-container">
      <div className="left-panel-user">
        <div className="left-panel-avatar">A</div>

        <div className="left-panel-user-info">
          <h3>Вітаємо, Анастасіє 👋</h3>
          <button type="button">Редагувати інформацію</button>
        </div>
      </div>

      <nav className="left-panel-nav">
        {menuItems.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`left-panel-nav-item ${item.id === 1 ? 'active' : ''}`}
          >
            <span className="left-panel-icon">
              <img src={item.icon} alt={item.label} />
            </span>

            <span className="left-panel-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default LeftPanel;