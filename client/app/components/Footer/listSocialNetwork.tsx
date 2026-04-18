import FacebookSVG from '../../assest/SocialNetworksLogo/Facebook.svg';
import InstagramSVG from '../../assest/SocialNetworksLogo/Instagram.svg';
import YouTubeSVG from '../../assest/SocialNetworksLogo/YouTube.svg';
import TikTokSVG from '../../assest/SocialNetworksLogo/TIkTok.svg';
import ViberSVG from '../../assest/SocialNetworksLogo/VIber.svg';
import TelegramSVG from '../../assest/SocialNetworksLogo/Telegram.svg';
import VatcapSVG from '../../assest/SocialNetworksLogo/Vatcap.svg';

import Viber2SVG from '../../assest/SocialNetworksLogo/VIber2.svg';
import Telegram2SVG from '../../assest/SocialNetworksLogo/Telegram2.svg';
import Vatcap2SVG from '../../assest/SocialNetworksLogo/Vatcap2.svg';

import EmailSVG from '../../assest/SocialNetworksLogo/Email.svg';
import AddressSVG from '../../assest/SocialNetworksLogo/Address.svg';
import TimwWork1 from '../../assest/SocialNetworksLogo/timwWork1.svg';
import TimwWork2 from '../../assest/SocialNetworksLogo/timwWork2.svg';
import {
  FacebookURL,
  InstagramURL,
  TelegramURL,
  TikTokURL,
  VatcapURL,
  ViberURL,
  YouTubeURL,
} from '@/app/assest/listUrl';
export const socialNetwork = [
  {
    url: FacebookURL,
    SVG: <FacebookSVG />,
  },
  {
    url: InstagramURL,
    SVG: <InstagramSVG />,
  },
  {
    url: YouTubeURL,
    SVG: <YouTubeSVG />,
  },
  {
    url: TikTokURL,
    SVG: <TikTokSVG />,
  },
];

export const messengers = [
  {
    url: ViberURL,
    SVG: <ViberSVG />,
    name: 'Viber',
  },
  {
    url: TelegramURL,
    SVG: <TelegramSVG />,
    name: 'Telegram',
  },
  {
    url: VatcapURL,
    SVG: <VatcapSVG />,
    name: 'Whatsapp',
  },
];

export const messengers2 = [
  {
    url: ViberURL,
    SVG: <Viber2SVG />,
    name: 'Viber',
  },
  {
    url: TelegramURL,
    SVG: <Telegram2SVG />,
    name: 'Telegram',
  },
  {
    url: VatcapURL,
    SVG: <Vatcap2SVG />,
    name: 'Whatsapp',
  },
];

export const phones = [
  {
    text: '+38 (093) 514-39-04',
    href: 'tel:+380935143904',
  },
  {
    text: '+38 (093) 514-39-04',
    href: 'tel:+380935143904',
  },
];

export const email = {
  email: 'info@baylap.com',
  url: 'malito:info@baylap.com',
  SVG: EmailSVG,
};

export const address = {
  SVG: AddressSVG,
  textuk: 'Україна, м. Черкаси, вул. Гоголя 269',
  textru: 'Украина, г. Черкассы, ул. Гоголя 269',
};

export const timeWorks = [
  {
    nameuk: 'Пн - Пт з 10:00 до 18:00',
    nameru: 'Пн - Пт с 10:00 до 18:00',
    SVG: TimwWork1,
  },
  {
    nameuk: 'Сб - Нд вихідний',
    nameru: 'Сб – ВС выходной',
    SVG: TimwWork2,
  },
];
