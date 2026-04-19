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
