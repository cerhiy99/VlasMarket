import FacebookSVG from '../../assest/SocialNetworksLogo/Facebook.svg'
import InstagramSVG from '../../assest/SocialNetworksLogo/Instagram.svg'
import YouTubeSVG from '../../assest/SocialNetworksLogo/YouTube.svg'
import TikTokSVG from '../../assest/SocialNetworksLogo/TIkTok.svg'
import ViberSVG from '../../assest/SocialNetworksLogo/VIber.svg'
import TelegramSVG from '../../assest/SocialNetworksLogo/Telegram.svg'
import VatcapSVG from '../../assest/SocialNetworksLogo/Vatcap.svg'
import {
  FacebookURL,
  InstagramURL,
  TelegramURL,
  TikTokURL,
  VatcapURL,
  ViberURL,
  YouTubeURL
} from '@/app/assest/listUrl'

export const socialNetwork = [
  {
    url: FacebookURL,
    SVG: <FacebookSVG />
  },
  {
    url: InstagramURL,
    SVG: <InstagramSVG />
  },
  {
    url: YouTubeURL,
    SVG: <YouTubeSVG />
  },
  {
    url: TikTokURL,
    SVG: <TikTokSVG />
  }
]

export const messengers = [
  {
    url: ViberURL,
    SVG: <ViberSVG />
  },
  {
    url: TelegramURL,
    SVG: <TelegramSVG />
  },
  {
    url: VatcapURL,
    SVG: <VatcapSVG />
  }
]
