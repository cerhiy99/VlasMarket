import { Locale } from '@/i18n.config';
import React from 'react';
import './Contact.scss';
import BreadCrumbs from '@/app/components/utils/BreadCrumbs';
import { getDictionary } from '@/lib/dictionary';

type Props = {
  params: Promise<{ lang: Locale }>;
};

const page = async ({ params }: Props) => {
  const { lang } = await params;
  const { footer } = await getDictionary(lang);
  const info = {
    ru: `Сайт <a href='https://baylap.com'>https://baylap.com</a>: продавец — физическое лицо-предприниматель Лаптев Влас Валерьевич (ИНН 2486120076), юридическое лицо, созданное и действующее в соответствии с действующим законодательством Украины, местонахождение которого: 62480, Харьковская обл., Харьковский р-н, село Хроли, ул. Гагарина, дом 6.`,
    ua: `Сайт <a href='https://baylap.com'>https://baylap.com</a>: продавець – Фізична особа підприємець Лаптєв Влас Валерійович (ІПН 2486120076), юридична особа, яка створена і діє відповідно до чинного законодавства України, місцезнаходження якої: 62480, Харківська обл. Харківський р-он, село Хролі, вул. Гагаріна будинок 6.`,
  };
  return (
    <div className="contact-container">
      <BreadCrumbs
        lang={lang}
        listUrles={[{ name: lang == 'ru' ? 'Контакты' : 'Контакти', url: '' }]}
      />
      <h1>{lang == 'ru' ? 'Контакты' : 'Контакти'}</h1>
      <div className="info">
        <p className="info" dangerouslySetInnerHTML={{ __html: info[lang] }} />
        <div className="contacts">
          <div className="phones-and-address">
            <div className="phones">
              <span>{footer.contacts.tel}</span>
              <a href={`${process.env.NEXT_PUBLIC_PHONE_URL_1}`}>
                {process.env.NEXT_PUBLIC_PHONE_1};
              </a>
              <a href={`${process.env.NEXT_PUBLIC_PHONE_URL_2}`}>
                {process.env.NEXT_PUBLIC_PHONE_2};
              </a>
            </div>
            <div className="address-container">
              <span>{footer.contacts.addressTitle}</span>
              <div
                className="address"
                dangerouslySetInnerHTML={{ __html: footer.contacts.address }}
              />
            </div>
          </div>
          <div className="email">
            <span>E-mail: </span>
            <a href={`${process.env.NEXT_PUBLIC_EMAIL_URL}`}>{process.env.NEXT_PUBLIC_EMAIL}</a>
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default page;
