'use client';
import { useCallback, useEffect, useState } from 'react';
import type { Locale } from '@/i18n.config';
import './MobileMenu.scss';
import Logo from '@/app/assest/Logo.svg';
import Link from 'next/link';
import SetLanguage from '../SetLanguage';
import AuthHeader from '../AuthHeader';
import AccordionMenu from '../accordion/AccordionMenu';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import {
  addToBasket,
  BasketItem,
  decrementItemCount,
  incrementItemCount,
  LikeItem,
  removeFromBasket,
  removeFromLike,
} from '@/app/store/reducers/cartReducer';
import LikeSVG from '@/app/assest/Header/LikeColor.svg';
import BasketSVG from '@/app/assest/Header/BasketColor.svg';
import DelSVG from '@/app/assest/Header/DelColor.svg';
import ViberSVG from '@/app/assest/Header/Viber.svg';
import TelegramSVG from '@/app/assest/Header/Telegram.svg';
import WhatccapSVG from '@/app/assest/Header/Whatccap.svg';
import PhoneSVG from '@/app/assest/Header/Phone.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AdminLogo from '../AdminLogo';
import { getLocalizedPath } from '../../utils/getLocalizedPath';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  dictionary: any;
  lang: Locale;
};

const MobileMenu = ({ isOpen, onClose, dictionary, lang }: MobileMenuProps) => {
  // const pathname = usePathname()
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [sum, setSum] = useState(0);
  const [price, setPrice] = useState(0);
  const [countBasket, setCountBasket] = useState(0);
  const [countFav, setCountFav] = useState(0);
  const [isBasketOpen, setBasketOpen] = useState(false);
  const [isFavOpen, setFavOpen] = useState(false);
  const [isFormClosed, setFormClosed] = useState(false);
  const dispatch = useDispatch();
  const { isAuthorize } = useSelector((state: RootState) => state.user);
  const { basket, like } = useSelector(
    (state: RootState) => state.BasketAndLike
  );

  const toggleForm = useCallback(() => {
    setFormClosed(!isFormClosed);
  }, [isFormClosed]);

  const handlerAddToCart = (id: number) => {
    const currentLike = like.filter((currentItem) => currentItem.id === id);
    dispatch(addToBasket({ ...currentLike[0], count: 1 }));
    dispatch(removeFromLike(id));
  };

  const delWithLike = (id: number) => {
    dispatch(removeFromLike(id));
  };

  const delWithBasket = (id: number) => {
    dispatch(removeFromBasket(id));
  };

  const plus = (id: number) => {
    dispatch(incrementItemCount(id));
  };

  const minus = (id: number) => {
    dispatch(decrementItemCount(id));
  };

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setBasketOpen(false);
    setFavOpen(false);

    const timer = setTimeout(() => {
      onClose();
    }, 300);

    return () => clearTimeout(timer);
  }, [onClose]);

  const toggleAccordion = (accordionType: 'favorite' | 'basket') => {
    if (accordionType === 'basket') {
      setBasketOpen((prev) => !prev);
      setFavOpen(false);
    }
    if (accordionType === 'favorite') {
      setFavOpen((prev) => !prev);
      setBasketOpen(false);
    }
  };
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

  useEffect(() => {
    setCountBasket(basket.length);
  }, [basket]);

  useEffect(() => {
    setCountFav(like.length);
  }, [like]);

  // useEffect(() => {
  //   if (isOpen && pathname !== window.location.pathname) {
  //     handleClose()
  //   }
  // }, [pathname, handleClose, isOpen])

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
        <div className="mobile-menu-header">
          <div className="logo-container">
            <Link onClick={handleClose} href={`/${lang != 'ru' ? '' : 'ru/'}`}>
              <Logo />
            </Link>
          </div>
          <AdminLogo isMob />
          <button className="mobile-menu-close" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="mobile-menu-content">
          <div className="language__wrapper">
            <SetLanguage lang={lang} />
          </div>
          <div className="basic-content">
            <div
              onClick={() => {
                if (isAuthorize) onClose();
              }}
              className="auth432"
            >
              <AuthHeader
                dictionary={dictionary.Auth}
                lang={lang}
                iconColor="#333"
                onFormClose={toggleForm}
              />
            </div>
            <div className="line-vertically" />
            <div
              className="svg__wrapper"
              onClick={() => toggleAccordion('favorite')}
            >
              <LikeSVG />
              {countFav > 0 && (
                <div className="count">
                  <span>{countFav}</span>
                </div>
              )}
            </div>
            <div className="line-vertically" />
            <div
              className="svg__wrapper last"
              onClick={() => toggleAccordion('basket')}
            >
              <BasketSVG />
              {countBasket > 0 && (
                <div className="count">
                  <span>{countBasket}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mobile-menu-accordions">
            {/* Favorites Accordion */}
            <AccordionMenu
              isOpen={isFavOpen}
              emptyMessage={
                lang == 'ru' ? 'Ваше вподобане пусте' : 'Ваше вподобане пусте'
              }
              isEmpty={like.length === 0}
              innerMessage="Обране"
            >
              <ul className="liked-container">
                {like.map((x: LikeItem) => (
                  <>
                    <div className="itemWrapper" key={x.id}>
                      <Link
                        href={getLocalizedPath(
                          `/${lang}/goods/${x.volume.url}`,
                          lang
                        )}
                      >
                        {' '}
                      </Link>
                      <div className="liked-basket">
                        <div className="basket-goods-img">
                          <Image
                            src={process.env.NEXT_PUBLIC_SERVER + x.volume.img}
                            width={52}
                            height={52}
                            alt={x.nameUA}
                          />
                        </div>
                        <div className="basket-goods-text">
                          <h3>{x.nameUA}</h3>
                          <div className="price-count-volume">
                            <div className="volume-and-count">
                              <div className="volume">
                                {
                                  x.volume.volume.split('||')[
                                    lang == 'ru' ? 1 : 0
                                  ]
                                }
                              </div>
                            </div>
                            <div className="price-container">
                              <div className="price-no-discount">
                                {x.volume.price} ₴
                              </div>
                              <div className="price-with-discount">
                                {x.volume.priceWithDiscount} ₴
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            delWithLike(x.id);
                          }}
                          className="del"
                        >
                          <DelSVG color="#A3AEBD" width={20} />
                        </div>
                      </div>

                      <div className="button-with-price">
                        <div className="price">
                          <p>{dictionary.mobileMenu.noDelivery}</p>
                          <div className="price-grn">
                            {price} <span className="grn">₴</span>
                          </div>
                        </div>
                        <div className="in-basket">
                          <button onClick={() => handlerAddToCart(x.id)}>
                            {dictionary.mobileMenu.inBasket}
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ))}
              </ul>
            </AccordionMenu>

            {/* Basket Accordion */}
            <AccordionMenu
              innerMessage={lang == 'ru' ? 'Ваша корзина' : 'Ваш кошик'}
              isOpen={isBasketOpen}
              emptyMessage={
                lang == 'ru' ? 'Ваша корзина пуста' : 'Ваша корзина пуста'
              }
              isEmpty={basket.length === 0}
            >
              <ul className="basket-list">
                {basket.map((x: BasketItem) => (
                  <div key={x.id} className="itemWrapper">
                    <Link
                      href={getLocalizedPath(
                        `/${lang}/goods/${x.volume.url}`,
                        lang
                      )}
                    >
                      <div className="basket-goods">
                        <div className="basket-goods-img">
                          <Image
                            src={process.env.NEXT_PUBLIC_SERVER + x.volume.img}
                            width={52}
                            height={52}
                            alt={x.nameUA}
                          />
                        </div>
                        <div className="basket-goods-text">
                          <h3>{x.nameUA}</h3>
                          <div className="add-or-minus-or-basket">
                            <div className="add-or-minus">
                              <div
                                className="arrow minus"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  if (x.count > 1) minus(x.id);
                                }}
                              >
                                <svg
                                  width="14"
                                  height="2"
                                  viewBox="0 0 14 2"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M0 1H14"
                                    stroke="white"
                                    strokeWidth="2"
                                  />
                                </svg>
                              </div>
                              <div className="count">{x.count}</div>
                              <div
                                className="arrow plus"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  plus(x.id);
                                }}
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M0 7L14 7"
                                    stroke="white"
                                    strokeWidth="2"
                                  />
                                  <path
                                    d="M7 0L7 14"
                                    stroke="white"
                                    strokeWidth="2"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className="price-count-volume">
                            <div className="volume-and-count">
                              <div className="count">
                                {
                                  x.volume.volume.split('||')[
                                    lang == 'ru' ? 1 : 0
                                  ]
                                }
                              </div>
                            </div>
                            <div className="price-container">
                              <div className="price-no-discount">
                                {x.volume.price} ₴
                              </div>
                              <div className="price-with-discount">
                                {x.volume.priceWithDiscount} ₴
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            delWithBasket(x.id);
                          }}
                          className="del"
                        >
                          <DelSVG color="#A3AEBD" width={20} />
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}

                <div className="footer-basket">
                  <div className="text">
                    <span>{dictionary.mobileMenu.noDelivery}</span>
                    <p>
                      {sum} <span>₴</span>
                    </p>
                  </div>
                  <div className="button-make-order">
                    <button
                      onClick={() => {
                        handleClose();
                        router.push(
                          getLocalizedPath(`/${lang}/make-order`, lang)
                        );
                      }}
                    >
                      {dictionary.mobileMenu.formDelivery}
                    </button>
                  </div>
                </div>
              </ul>
            </AccordionMenu>
          </div>
          <nav className="mobile-menu-nav">
            <ul>
              <li>
                <button
                  className="navigationBtn"
                  onClick={() => {
                    router.push(getLocalizedPath(`/${lang}`, lang));
                    handleClose();
                  }}
                >
                  {dictionary.mobileMenu.main}
                </button>
              </li>
              <li>
                <button
                  className="navigationBtn"
                  onClick={() => {
                    router.push(getLocalizedPath(`/${lang}/goods/1`, lang));
                    handleClose();
                  }}
                >
                  {dictionary.mobileMenu.catalog}
                </button>
              </li>
              <li>
                <button
                  className="navigationBtn"
                  onClick={() => {
                    router.push(getLocalizedPath(`/${lang}/about-us`, lang));
                    handleClose();
                  }}
                >
                  {dictionary.mobileMenu.aboutUs}
                </button>
              </li>
              <li>
                <button
                  className="navigationBtn"
                  onClick={() => {
                    router.push(getLocalizedPath(`/${lang}/blog/1`, lang));
                    handleClose();
                  }}
                >
                  Блог
                </button>
              </li>
              <li>
                <button
                  className="navigationBtn"
                  onClick={() => {
                    router.push(getLocalizedPath(`/${lang}/discount/1`, lang));
                    handleClose();
                  }}
                >
                  {dictionary.mobileMenu.discount}
                </button>
              </li>

              <li>
                <button
                  className="navigationBtn"
                  onClick={() => {
                    router.push(getLocalizedPath(`/${lang}/delivery`, lang));
                    handleClose();
                  }}
                >
                  {dictionary.mobileMenu.delivery}
                </button>
              </li>

              <li>
                <button
                  className="navigationBtn"
                  onClick={() => {
                    router.push(getLocalizedPath(`/${lang}/pay`, lang));
                    handleClose();
                  }}
                >
                  {dictionary.mobileMenu.pay}
                </button>
              </li>

              <li>
                <button
                  className="navigationBtn"
                  onClick={() => {
                    router.push(
                      getLocalizedPath(`/${lang}/return-goods`, lang)
                    );
                    handleClose();
                  }}
                >
                  {dictionary.mobileMenu.returnProduct}
                </button>
              </li>

              <li>
                <button
                  className="navigationBtn"
                  onClick={() => {
                    router.push(
                      getLocalizedPath(`/${lang}/offer-agreement`, lang)
                    );
                    handleClose();
                  }}
                >
                  {dictionary.mobileMenu.dohovor}
                </button>
              </li>
              <li>
                <button
                  className="navigationBtn"
                  onClick={() => {
                    router.push(getLocalizedPath(`/${lang}/brands`, lang));
                    handleClose();
                  }}
                >
                  {dictionary.mobileMenu.brends}
                </button>
              </li>

              <li>
                <button
                  className="navigationBtn"
                  onClick={() => {
                    router.push(getLocalizedPath(`/${lang}/cooperation`, lang));
                    handleClose();
                  }}
                >
                  {dictionary.mobileMenu.cooperation}
                </button>
              </li>
            </ul>
          </nav>
          <div className="contactsInfo">
            <p>{dictionary.contact.timeWorkTitle}</p>
            <span>{dictionary.contact.timeWorkDescription1}</span>
            <span>{dictionary.contact.timeWorkDescription2}</span>
            <div className="contacts__list">
              <div className="list__item">
                <div className="listItem--wrapper">
                  <ViberSVG />
                  <p>Viber</p>
                  <a href={process.env.NEXT_PUBLIC_VIBER}></a>
                </div>
                <div className="listItem--wrapper">
                  <TelegramSVG />
                  <p>Telegram</p>
                  <a href={process.env.NEXT_PUBLIC_TELEGRAM}></a>
                </div>
                <div className="listItem--wrapper">
                  <WhatccapSVG />
                  <p>Whatsapp</p>
                  <a href={process.env.NEXT_PUBLIC_WHATSAPP}></a>
                </div>
              </div>
              <div className="list__item contactNumber">
                <PhoneSVG color={'#fe680a'} stroke={'white'} />
                <div className="contactNumber__wrapper">
                  <div>
                    <a href={process.env.NEXT_PUBLIC_PHONE_URL_1}>
                      {process.env.NEXT_PUBLIC_PHONE_1}
                    </a>
                  </div>
                  <div>
                    <a href={process.env.NEXT_PUBLIC_PHONE_URL_2}>
                      {process.env.NEXT_PUBLIC_PHONE_2}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
