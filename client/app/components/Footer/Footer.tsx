import React from 'react';
import './Footer.scss';
import { Locale } from '@/i18n.config';
//import LogoSVG from '../../assest/Footer/Logo.svg';
import LogoSVG from '../../assest/Footer/LogoBlack.svg';
import PhonesSVG from '../../assest/Footer/Phones.svg';
import { getDictionary } from '@/lib/dictionary';
import Link from 'next/link';
import {
  address,
  email,
  messengers,
  phones,
  socialNetwork,
  timeWorks,
} from './listSocialNetwork';
import { getLocalizedPath } from '../utils/getLocalizedPath';

const Footer = async ({ lang }: { lang: Locale }) => {
  const { footer } = await getDictionary(lang);
  return (
    <div className="footer-container">
      <div className="footer-main">
        <div className="logo">
          <LogoSVG />
        </div>
        <div className="urls">
          {Object.entries(footer.listInfo).map(([key, value]) => (
            <Link key={key} href={getLocalizedPath(`/${lang}/${key}`, lang)}>
              {value}
            </Link>
          ))}
        </div>
        <div className="contact-info">
          <section className="numbers">
            {phones.map((x, idx) => (
              <div key={idx} className="number">
                <a target="_blank" href={x.href}>
                  <div className="svg">
                    <PhonesSVG />
                  </div>
                  {x.text}
                </a>
              </div>
            ))}
          </section>
          <section className="email-with-address">
            <a href={email.url} target="_blank">
              <div className="svg">
                <email.SVG />
              </div>
              {email.email}
            </a>
            <div className="email">
              <div className="svg">
                <address.SVG />
              </div>
              {lang == 'ru' ? address.textru : address.textuk}
            </div>
          </section>
          <section className="time-works">
            {timeWorks.map((x, idx) => (
              <div key={idx} className="time">
                <x.SVG />
                {lang == 'ru' ? x.nameru : x.nameuk}
              </div>
            ))}
          </section>
        </div>
        <div className="list-social">
          {[...socialNetwork, ...messengers].map((x) => (
            <div className="social">
              <a target="_blank" href={x.url}>
                {x.SVG}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;

/*

<div className="footer-container">
      <div className="footer-main">
        <div className="first">
          <div className="logo-and-graph">
            <Link href={`${lang != 'ru' ? '/' : '/ru'}`}>
              <div className="logo">
                <LogoSVG />
              </div>
              <div className="logo-mobile">
                <LogoMobileSVG />
              </div>
            </Link>
            <div className="graph">
              <p>{footer.graphTitle}</p>
              <span>{footer.graphDescription1}</span>
              <span>{footer.graphDescription2}</span>
            </div>
          </div>
          <div className="second-info">
            <p>{footer.listInfoTitle}</p>
            {Object.entries(footer.listInfo).map(([key, value]) => (
              <Link key={key} href={getLocalizedPath(`/${lang}/${key}`, lang)}>
                {value}
              </Link>
            ))}
          </div>
          <div className="contacts">
            <p>{footer.contacts.title}</p>
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
              <div style={{ marginTop: '5px' }} className="address-container">
                <span>{footer.contacts.addressTitle2}</span>
                <div
                  className="address"
                  dangerouslySetInnerHTML={{ __html: footer.contacts.address2 }}
                />
              </div>
            </div>
            <div className="email">
              <span>E-mail:</span>
              <a href={`${process.env.NEXT_PUBLIC_EMAIL_URL}`}>{process.env.NEXT_PUBLIC_EMAIL}</a>
            </div>
          </div>
          <div className="social-networks">
            <div className="social">
              <p>{footer.socialNetwork.title1}</p>
              <div className="list-social-network">
                {socialNetwork.map((x, idx) => (
                  <a target="_blank" href={x.url} key={idx}>
                    {x.SVG}
                  </a>
                ))}
              </div>
            </div>
            <div className="masangers">
              <p>{footer.socialNetwork.title2}</p>
              <div className="list-social-network">
                {messengers.map((x, idx) => (
                  <a href={x.url} key={idx}>
                    {x.SVG}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="second">
          <div className="info">{footer.info}</div>
        </div>
      </div>
    </div>

*/
