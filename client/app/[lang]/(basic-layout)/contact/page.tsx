import { Locale } from '@/i18n.config';
import React from 'react';
import './Contact.scss';
import BreadCrumbs from '@/app/components/utils/BreadCrumbs';
import { getDictionary } from '@/lib/dictionary';
import { socialNetwork } from '@/app/components/Footer/listSocialNetwork';
import { InstagramURL, TelegramURL } from '@/app/assest/listUrl';
import InstagramSVG from '../../../assest/SocialNetworksLogo/Instagram.svg';
import TelegramSVG from '../../../assest/SocialNetworksLogo/Telegram.svg';
import Telegram2SVG from '../../../assest/SocialNetworksLogo/Telegram2.svg';

type Props = {
  params: Promise<{ lang: Locale }>;
};

const page = async ({ params }: Props) => {
  const { lang } = await params;
  const { footer } = await getDictionary(lang);

  const info = {
    ru: `Сайт <a href='https://vlasmarket.com.ua/'>https://vlasmarket.com.ua/</a>: продавец — физическое лицо-предприниматель Лаптев Влас Валерьевич`,
    ua: `Сайт <a href='https://vlasmarket.com.ua/'>https://vlasmarket.com.ua/</a>: продавець – Фізична особа підприємець Лаптєв Влас Валерійович`,
  };

  return (
    <div className="contact-container">
      <BreadCrumbs
        lang={lang}
        listUrles={[{ name: lang === 'ru' ? 'Контакты' : 'Контакти', url: '' }]}
      />

      <h1 className="page-title">{lang === 'ru' ? 'Контакты' : 'Контакти'}</h1>

      <div className="contacts-grid">
        {/* Ліва колонка: Телефони та Соцмережі */}
        <div className="contacts-col">
          <h3>{footer.contacts.tel}</h3>
          <div className="contacts-list">
            <div className="contact-item">
              <span className="icon">📞</span>
              <a href={`${process.env.NEXT_PUBLIC_PHONE_URL_1}`}>
                {process.env.NEXT_PUBLIC_PHONE_1}
              </a>
            </div>
            <div className="contact-item">
              <span className="icon">📞</span>
              <a href={`${process.env.NEXT_PUBLIC_PHONE_URL_2}`}>
                {process.env.NEXT_PUBLIC_PHONE_2}
              </a>
            </div>
            {/* Сюди можна додати інстаграм / телеграм як на фото 
            <div className="contact-item">
              <span className="icon">
                <InstagramSVG />
              </span>
              <a href={InstagramURL} target="_blank" rel="noreferrer">
                Vlas Market
              </a>
            </div>*/}
            <div className="contact-item">
              <span className="icon">
                <TelegramSVG />
              </span>
              <a href={TelegramURL} target="_blank" rel="noreferrer">
                @VlasMarketstore
              </a>
            </div>
          </div>
        </div>

        {/* Права колонка: Адреса, Графік та Email */}
        <div className="contacts-col">
          <h3>{footer.contacts.addressTitle}</h3>
          <div className="contacts-list">
            <div className="contact-item">
              <span className="icon">📍</span>
              <div
                className="address-text"
                dangerouslySetInnerHTML={{ __html: footer.contacts.address }}
              />
            </div>
            <div className="contact-item">
              <span className="icon">🕒</span>
              <div className="schedule-text">
                <p>Пн. - Сб. 9:00 - 19:00</p>
                <p>Вс. 10:00 - 18:00</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="icon">📧</span>
              <a href={`${process.env.NEXT_PUBLIC_EMAIL_URL}`}>
                {process.env.NEXT_PUBLIC_EMAIL}
              </a>
            </div>
          </div>
        </div>
      </div>

      <h2 className="map-title">
        {lang === 'ru' ? 'Мы находимся' : 'Ми знаходимося'}
      </h2>
      <div className="map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2594.3259799289667!2d32.06140620000001!3d49.4405556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d14b7eeb1523e7%3A0x4572aa0fc206404e!2z0LLRg9C70LjRhtGPINCT0L7Qs9C-0LvRjywgMjY5LCDQp9C10YDQutCw0YHQuCwg0KfQtdGA0LrQsNGB0YzQutCwINC-0LHQu9Cw0YHRgtGMLCAxODAwMA!5e0!3m2!1suk!2sua!4v1757777497693!5m2!1suk!2sua"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Юридичний текст знизу, щоб не ламав інтерфейс
      <div
        className="legal-info"
        dangerouslySetInnerHTML={{ __html: info[lang] }}
      /> */}
    </div>
  );
};

export default page;
