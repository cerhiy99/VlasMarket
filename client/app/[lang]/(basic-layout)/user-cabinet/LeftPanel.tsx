'use client';
import React, { useEffect, useState } from 'react';
import './LeftPanel.scss';
import { Locale } from '@/i18n.config';
import Link from 'next/link';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { usePathname } from 'next/navigation';

const LeftPanel = ({ lang, dictionary }: { lang: Locale; dictionary: any }) => {
  const menuItems = [
    {
      id: 1,
      label: lang == 'ru' ? 'Профиль' : 'Профіль',
      icon: '/images/profile-icon.svg',
      url: '/profile',
    },
    {
      id: 2,
      label: lang == 'ru' ? 'История заказов' : 'Історія замовлень',
      icon: '/images/orders-icon.svg',
      url: '/history',
    },
    {
      id: 3,
      label: lang == 'ru' ? 'Список желаний' : 'Список бажань',
      icon: '/images/wishlist-icon.svg',
      url: '/like',
    },
    {
      id: 4,
      label: lang == 'ru' ? 'Мои бонусы' : 'Мої бонуси',
      icon: '/images/bonus-icon.svg',
      url: '/bonus',
    },
    {
      id: 5,
      label: lang == 'ru' ? 'Рассылка на почту' : 'Розсилка на пошту',
      icon: '/images/mailing-icon.svg',
      url: '/send-emails',
    },
    {
      id: 6,
      label: lang == 'ru' ? 'Отзывы и комментарии' : 'Відгуки та коментарі',
      icon: '/images/reviews-icon.svg',
      url: '/coments',
    },
    {
      id: 7,
      label: lang == 'ru' ? 'Промокоды' : 'Промокоди',
      icon: '/images/promo-icon.svg',
      url: '/promokods',
    },
    {
      id: 8,
      label: lang == 'ru' ? 'Просмотренные товары' : 'Переглянуті товари',
      icon: '/images/viewed-icon.svg',
      url: '/watched',
    },
    {
      id: 9,
      label: lang == 'ru' ? 'Выйти из аккаунта' : 'Вийти з акаунту',
      icon: '/images/logout-icon.svg',
      url: '/exit',
    },
  ];
  const { user } = useSelector((state: RootState) => state.user);
  const [selectId, setSelectId] = useState(1);
  const pathname = usePathname();

  useEffect(() => {
    const url = pathname.split('user-cabinet')[1] || '';
    const selectMenu = menuItems.find((x) => x.url == url);

    setSelectId(selectMenu?.id || 0);
  }, [pathname]);

  return (
    <aside className="left-panel-container">
      <div className="left-panel-user">
        <div className="left-panel-avatar">{user?.name[0]}</div>

        <div className="left-panel-user-info">
          <h3>
            {lang == 'ru' ? 'Приветствуем' : 'Вітаємо'}, {user?.name} 👋
          </h3>
          <Link href={getLocalizedPath(`/${lang}/user-cabinet/profile`, lang)}>
            {lang == 'ru'
              ? 'Редактировать информацию'
              : 'Редагувати інформацію'}
            {/*<div className="home-goods">
        <UserWatched
          title={home.youWatching}
          lang={lang}
          dictionary={miniGoods}
          type=""
        />
      </div>*/}
          </Link>
        </div>
      </div>

      <nav className="left-panel-nav">
        {menuItems.map((item) => (
          <Link
            href={getLocalizedPath(`/${lang}/user-cabinet${item.url}`, lang)}
            key={item.id}
            className={`left-panel-nav-item ${item.id === selectId ? 'active' : ''}`}
          >
            <span className="left-panel-icon">
              <img src={item.icon} alt={item.label} />
            </span>

            <span className="left-panel-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default LeftPanel;
