'use client';
import { useCallback, useEffect, useState } from 'react';
import type { Locale } from '@/i18n.config';
import './MobileMenu.scss';
import Logo from '@/app/assest/Logo.svg';
import Link from 'next/link';
import SetLanguage from '../SetLanguage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useRouter } from 'next/navigation';
import AdminLogo from '../AdminLogo';
import { getLocalizedPath } from '../../utils/getLocalizedPath';
import CatalogHeaderSVG from '../../../assest/Header/Burger/Catalog.svg';
import RightSVG from '../../../assest/Header/Burger/Right.svg';
import LeftSVG from '../../../assest/Header/Burger/Left.svg';
import AllProductSVG from '../../../assest/Header/Burger/AllProductRight.svg';
import { UkrToEng } from '../../utils/UkrToEng';
import AuthSVG from '../../../assest/Header/Burger/Auth.svg';
import {
  setOpenLogin,
  setOpenRegister,
} from '@/app/store/reducers/userReducers';
import DownSVG from '../../../assest/Header/Basket/Down.svg';
import ProfileSVG from '../../../assest/Header/Basket/Profile.svg';
import HistorySVG from '../../../assest/Header/Basket/History.svg';
import BonusSVG from '../../../assest/Header/Basket/Bonus.svg';
import LikedSVG from '../../../assest/Header/Basket/Liked.svg';
import EmailSendSVG from '../../../assest/Header/Basket/EmailSend.svg';
import ComentSVG from '../../../assest/Header/Basket/Coment.svg';
import PromokodSVG from '../../../assest/Header/Basket/Promokod.svg';
import WatchedSVG from '../../../assest/Header/Basket/Watched.svg';
import ExitSVG from '../../../assest/Header/Basket/Exit.svg';

import BasketSVG from '../../../assest/Header/Basket/Basket.svg';
import Liked2SVG from '../../../assest/Header/Basket/Liked2.svg';
import CompresionSVG from '../../../assest/Header/Basket/Compresion.svg';
import PhoneSVG from '../../../assest/Header/Burger/Phone.svg';
import { messengers2, phones } from '../../Footer/listSocialNetwork';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  dictionary: any;
  lang: Locale;
  catalog: any;
};

const MobileMenu = ({
  isOpen,
  onClose,
  dictionary,
  lang,
  catalog,
}: MobileMenuProps) => {
  // const pathname = usePathname()
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [sum, setSum] = useState(0);
  const [price, setPrice] = useState(0);
  const [isFormClosed, setFormClosed] = useState(false);
  const dispatch = useDispatch();
  const { isAuthorize, user } = useSelector((state: RootState) => state.user);
  const { basket, like, comparison } = useSelector(
    (state: RootState) => state.BasketAndLike
  );

  const handleClose = useCallback(() => {
    setIsClosing(true);

    const timer = setTimeout(() => {
      onClose();
    }, 300);

    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    if (isFormClosed) {
      handleClose();
    }
    return () => setFormClosed(false);
  }, [isFormClosed, handleClose]);

  useEffect(() => {
    let sum = 0;
    like.forEach((x) => (sum += x.volume.priceWithDiscount));
    setPrice(sum);
  }, [like]);

  useEffect(() => {
    let tempSum = 0;
    basket.forEach((x) => (tempSum += x.volume.priceWithDiscount * x.count));
    setSum(tempSum);
  }, [basket]);

  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setShouldRender(true);
      document.body.style.overflow = 'hidden';
    } else if (shouldRender) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match this with the CSS animation duration

      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, shouldRender]);

  // useEffect(() => {
  //   if (isOpen && pathname !== window.location.pathname) {
  //     handleClose()
  //   }
  // }, [pathname, handleClose, isOpen])
  const [selectCategory, setSelectCategory] = useState(0);

  const [isOpenCabinet, setIsOpenCabinet] = useState(true);

  const listUrl = [
    {
      name: lang == 'ru' ? 'Акции' : 'Акції',
      url: 'discount/1',
    },
    {
      name: lang == 'ru' ? 'О нас' : 'Про нас',
      url: 'about-us',
    },
    {
      name: lang == 'ru' ? 'Контакты' : 'Контакти',
      url: 'contact',
    },
    {
      name: lang == 'ru' ? 'Блог' : 'Блог',
      url: 'blog/1',
    },
    {
      name: lang == 'ru' ? 'Бонусная программа' : 'Бонусна програма',
      url: 'bonus',
    },
    {
      name: lang == 'ru' ? 'Доставка' : 'Доставка',
      url: 'delivery',
    },
    {
      name: lang == 'ru' ? 'Оплата' : 'Оплата',
      url: 'pay',
    },
    {
      name: lang == 'ru' ? 'Возврат товара' : 'Повернення товару',
      url: 'return-goods',
    },
    {
      name:
        lang == 'ru' ? 'Договор публичной оферты' : 'Договір публічної оферти',
      url: 'offer-agreement',
    },
  ];

  const listProfile = [
    {
      svg: <ProfileSVG />,
      name: lang == 'ru' ? 'Профиль' : 'Профіль',
      url: 'user-cabinet/profile',
    },
    {
      svg: <HistorySVG />,
      name: lang == 'ru' ? 'История заказов' : 'Історія замовлень',
      url: 'user-cabinet/history',
    },
    {
      svg: <LikedSVG />,
      name: lang == 'ru' ? 'Список желаний' : 'Список бажань',
      url: 'user-cabinet/like',
    },
    {
      svg: <BonusSVG />,
      name: lang == 'ru' ? 'Мои бонусы' : 'Мої бонуси',
      url: 'user-cabinet/bonus',
    },
    {
      svg: <EmailSendSVG />,
      name: lang == 'ru' ? 'Рассылка на почту' : 'Розсилка на пошту',
      url: 'user-cabinet/send-emails',
    },
    {
      svg: <ComentSVG />,
      name: lang == 'ru' ? 'Отзывы и комментарий' : 'Відгуки та коментар',
      url: 'user-cabinet/coments',
    },
    {
      svg: <PromokodSVG />,
      name: lang == 'ru' ? 'Промокоды' : 'Промокоди',
      url: 'user-cabinet/promokods',
    },
    {
      svg: <WatchedSVG />,
      name: lang == 'ru' ? 'Просмотренные товары' : 'Переглянуті товари',
      url: 'user-cabinet/watched',
    },
    {
      svg: <ExitSVG />,
      name: lang == 'ru' ? 'Профиль' : 'Вийти з акаунту',
      url: 'user-cabinet/exit',
    },
  ];

  if (!shouldRender) return null;

  return (
    <div
      className={`mobile-menu-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleClose}
    >
      <div
        className={`mobile-menu ${isClosing ? 'closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {selectCategory == 0 ? (
          <>
            <div className="mobile-menu-header">
              <AdminLogo isMob />
              <div className="logo-container">
                <Link
                  onClick={handleClose}
                  href={`/${lang != 'ru' ? '' : 'ru/'}`}
                >
                  <Logo />
                </Link>
              </div>
              <button className="mobile-menu-close" onClick={handleClose}>
                &times;
              </button>
            </div>
            <div className="mobile-menu-content">
              <div className="language__wrapper">
                <SetLanguage lang={lang} />
              </div>
              <div className="catalog-header">
                <CatalogHeaderSVG />{' '}
                {lang == 'ru' ? 'Каталог всех товаров' : 'Каталог всіх товарів'}
              </div>
              <div className="catalog">
                {catalog.map((x: any) => (
                  <div
                    onClick={() => setSelectCategory(x.id)}
                    className="category"
                  >
                    <div className="svg-with-name">
                      <div className="svg">
                        <img
                          alt={lang == 'ru' ? x.nameru : x.nameuk}
                          src={process.env.NEXT_PUBLIC_SERVER + x.svg}
                        />
                      </div>
                      <span>{lang == 'ru' ? x.nameru : x.nameuk}</span>
                    </div>
                    <div className="svg-right">
                      <RightSVG />
                    </div>
                  </div>
                ))}
              </div>
              <div className="auth-section">
                {isAuthorize ? (
                  <div className="auth">
                    <div
                      onClick={() => setIsOpenCabinet(!isOpenCabinet)}
                      className="auth-header"
                    >
                      <div className="svg-with-name">
                        <AuthSVG />
                        {user?.name} {user?.surname[0]}.
                      </div>
                      <div
                        className={`sort ${isOpenCabinet ? 'cabiner-open' : 'cabiner-close'}`}
                      >
                        <DownSVG />
                      </div>
                    </div>
                    {isOpenCabinet && (
                      <div className="cabinet-dropdown">
                        {listProfile.map((x) => (
                          <div
                            onClick={() => {
                              handleClose();
                              router.push(
                                getLocalizedPath(`/${lang}/${x.url}`, lang)
                              );
                            }}
                            className="link-url"
                          >
                            {x.svg} {x.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="no-auth">
                    <div className="no-auth-text">
                      <div className="svg-with-name">
                        <AuthSVG />
                      </div>
                      <div
                        onClick={() => dispatch(setOpenLogin(true))}
                        className="log-in"
                      >
                        {lang == 'ru' ? 'Войти в кабинет' : 'Увійти в кабінет'}
                      </div>
                      |
                      <div
                        onClick={() => dispatch(setOpenRegister(true))}
                        className="register"
                      >
                        {lang == 'ru' ? 'Регистрация' : 'Реєстрація'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="basket-liked-compresion">
                <div
                  onClick={() => {
                    if (basket.length > 0) {
                      router.push(getLocalizedPath(`/${lang}/basket`, lang));
                      handleClose();
                    }
                  }}
                  className="basket elem"
                >
                  <div className="svg-with-name">
                    <BasketSVG />
                    {lang == 'ru' ? 'Корзина' : 'Кошик'}
                  </div>
                  {basket.length > 0 && (
                    <div className="count">{basket.length}</div>
                  )}
                </div>
                <div
                  onClick={() => {
                    if (like.length > 0) {
                      router.push(getLocalizedPath(`/${lang}/liked`, lang));
                      handleClose();
                    }
                  }}
                  className="liked elem"
                >
                  <div className="svg-with-name">
                    <Liked2SVG />
                    {lang == 'ru' ? 'Список желаний' : 'Список бажань'}
                  </div>
                  {like.length > 0 && (
                    <div className="count">{like.length}</div>
                  )}
                </div>
                <div
                  onClick={() => {
                    if (comparison.length > 0) {
                      router.push(
                        getLocalizedPath(`/${lang}/comparison`, lang)
                      );
                      handleClose();
                    }
                  }}
                  className="compresion elem"
                >
                  <div className="svg-with-name">
                    <CompresionSVG />
                    {lang == 'ru' ? 'Сравнение' : 'Порівняння'}
                  </div>
                  {comparison.length > 0 && (
                    <div className="count">{comparison.length}</div>
                  )}
                </div>
              </div>
              <div className="list-url">
                {listUrl.map((x) => (
                  <div
                    onClick={() => {
                      router.push(getLocalizedPath(`/${lang}/${x.url}`, lang));
                      handleClose();
                    }}
                    style={{
                      color: x.url == 'discount/1' ? '#F80000' : '#000000',
                    }}
                  >
                    {x.name}
                  </div>
                ))}
              </div>
              <div className="phone-container">
                <PhoneSVG />
                <div className="phones">
                  {phones.map((x) => (
                    <a target="_blank" href={x.href}>
                      {x.text}
                    </a>
                  ))}
                </div>
              </div>
              <div className="socials">
                {messengers2.map((x) => (
                  <a href={x.url} target="_blank" className="social">
                    {x.SVG} {x.name}
                  </a>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="select-category-container">
            <div
              onClick={() => setSelectCategory(0)}
              className="select-category-header"
            >
              <div className="left-and-text">
                <div className="svg-left">
                  <LeftSVG />
                </div>
                <span>{lang == 'ru' ? 'Обратно' : 'Назад'}</span>
              </div>
              <div className="close">&times;</div>
            </div>
            <div className="select-category">
              <div
                onClick={() => {
                  router.push(
                    getLocalizedPath(
                      `/${lang}/goods/${UkrToEng(catalog.find((x: any) => x.id == selectCategory)?.nameru || '')}/1`,
                      lang
                    )
                  );
                  handleClose();
                }}
                className="svg-select-category"
              >
                <img
                  alt={
                    lang == 'ru'
                      ? catalog.find((x: any) => x.id == selectCategory).nameru
                      : catalog.find((x: any) => x.id == selectCategory).nameuk
                  }
                  src={
                    process.env.NEXT_PUBLIC_SERVER +
                    catalog.find((x: any) => x.id == selectCategory).svg
                  }
                />
              </div>
              <div className="svg-name">
                {lang == 'ru'
                  ? catalog.find((x: any) => x.id == selectCategory).nameru
                  : catalog.find((x: any) => x.id == selectCategory).nameuk}
              </div>
            </div>
            <div className="all-subcategory">
              <div className="all-product">
                {lang == 'ru' ? 'Все товары' : 'Всі товари'}
                <AllProductSVG />
              </div>
              <div className="list-subcategory">
                {catalog
                  .find((x: any) => x.id == selectCategory)
                  .subcategories.map((x: any) => (
                    <div
                      onClick={() => {
                        router.push(
                          getLocalizedPath(
                            `/${lang}/goods/${UkrToEng(catalog.find((x: any) => x.id == selectCategory)?.nameru || '')}/${UkrToEng(x.nameru)}/1`,
                            lang
                          )
                        );
                        handleClose();
                      }}
                      className="subcategory"
                    >
                      <img
                        width={30}
                        height={30}
                        alt={lang == 'ru' ? x.nameru : x.nameuk}
                        src={process.env.NEXT_PUBLIC_SERVER + x.img}
                      />
                      {lang == 'ru' ? x.nameru : x.nameuk}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
