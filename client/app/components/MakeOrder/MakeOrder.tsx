'use client';

import React, { useEffect, useRef, useState } from 'react';
import Inputmask from 'inputmask';
import { Locale } from '@/i18n.config';
import './MakeOrder.scss';
import NewPost from '../../assest/MakeOrder/NewPost.svg';
import UkrPost from '../../assest/MakeOrder/UkrPost.svg';
import PencilSVG from '../../assest/MakeOrder/Pencil.svg';
import SearchNewPost from './SearchNewPost';
import SearchUkrPost from './SearchUkrPost';
import MarkSVG from '../../assest/MakeOrder/Mark.svg';
import Coment from './Coment';
import ListFromBasket from './ListFromBasket';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { $authHost, $host } from '@/app/http';
import { useRouter } from 'next/navigation';
import { getLocalizedPath } from '../utils/getLocalizedPath';
import { useTranslation } from '@/context/TranslationProvider';
import ContactSVG from '../../assest/MakeOrder/Contact.svg';
import DeliverySVG from '../../assest/MakeOrder/Delivery.svg';
import PaySVG from '../../assest/MakeOrder/Pay.svg';
import Promokods from './Promokods';
import {
  PromokodFromDBInterface,
  PromokodInterface,
} from '@/app/[lang]/(admin-layout)/admin/promokods/GetPromokods';

type Props = {
  lang: Locale;
};

const MakeOrder: React.FC<Props> = ({ lang }) => {
  const { basket } = useSelector((state: RootState) => state.BasketAndLike);

  const { t } = useTranslation();
  const listWayDelivery = [
    {
      id: 1,
      name:
        lang == 'ru'
          ? 'Оплата на счет IBAN или на карту'
          : 'Оплата на рахунок IBAN або на картку',
      description:
        lang == 'ru'
          ? 'Ожидаю звонок для уточнения деталей'
          : 'Очікую дзвінок для уточнення деталей',
    },
    {
      id: 2,
      name:
        lang == 'ru'
          ? 'Оплата на счет IBAN или на карту'
          : 'Оплата на рахунок IBAN або на картку',
      description:
        lang == 'ru'
          ? 'Получить SMS с реквизитами'
          : 'Отримати SMS з реквізитами',
    },
    {
      id: 3,
      name:
        lang == 'ru'
          ? 'Наложенный платеж (с предоплатой)'
          : 'Накладений платіж (з передоплатою)',
      description:
        lang == 'ru'
          ? 'Ожидаю звонок для подтверждения'
          : 'Очікую дзвінок для підтвердження',
    },
  ];
  const user = useSelector((state: RootState) => state.user);

  const phoneInputRef = useRef<HTMLInputElement>(null);

  const [isContact, setIsContact] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [number, setNumber] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [isFinishFillDate, setIsFinishFillDate] = useState<boolean>(false);
  const [comment, setComment] = useState('');
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const [selectPost, setSelectPost] = useState<'new' | 'ukr' | 'seller' | null>(
    'new'
  );
  const [selectWayDelivery, setSelectWayDelivery] = useState(0);

  const setUser = () => {
    try {
      if (user.isAuthorize) {
        if (user.isAuthorize) {
          if (user.user?.name) {
            setName(user.user.name);
          }
          if (user.user?.surname) {
            setSurname(user.user.surname);
          }
          if (user.user?.email) {
            setEmail(user.user.email);
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getCountBonus = async () => {
    try {
      if (user.isAuthorize) {
        const res = await $authHost.get('order/userGetCountYoutBonus');

        setUserHaveBonus(res.data.countBonus);
      } else {
        setUserHaveBonus(0);
        setUserUseBonus(0);
      }
    } catch (err) {
      setUserHaveBonus(0);
    }
  };

  useEffect(() => {
    setUser();
    getCountBonus();
  }, [user]);

  useEffect(() => {
    // Ініціалізація маски для телефону через реф
    if (phoneInputRef.current) {
      Inputmask('+380 (99) 999-99-99').mask(phoneInputRef.current);
    }
  }, []);

  const handleContinue = () => {
    if (isContact) {
      setIsContactOpen(true);
    }
  };

  const [isSelectFinishDelivery, setIsSelectFinishDelivery] = useState(false);
  const [infoDelivery, setInfoDelivery] = useState<any>({});
  const selectFinishDelivery = (info: {}) => {
    setInfoDelivery(info);
    setIsSelectFinishDelivery(true);
  };

  useEffect(() => {}, [isSelectFinishDelivery]);

  useEffect(() => {
    if (
      isContactOpen &&
      isSelectFinishDelivery &&
      selectWayDelivery &&
      basket.length > 0
    ) {
      setIsFinishFillDate(true);
    } else setIsFinishFillDate(false);
  }, [isContactOpen, isSelectFinishDelivery, selectWayDelivery, basket.length]);

  const clearSetting = () => {
    setNumber('');
    setTimeout(() => {
      if (phoneInputRef.current) {
        Inputmask('+380 (99) 999-99-99').mask(phoneInputRef.current);
      }
    }, 500);
    setName('');
    setSurname('');
    setIsContactOpen(false);
    setIsContact(false);
    setIsSelectFinishDelivery(false);
    setSelectPost('new');
    setSelectWayDelivery(0);
    setInfoDelivery({});
    setIsCommentOpen(false);
    setComment('');
  };
  useEffect(() => {
    // проста перевірка email
    const isEmailValid = email && email.includes('@') && email.includes('.');

    if (
      surname.length > 2 &&
      name.length > 2 &&
      number.length === 19 &&
      !number.includes('_') &&
      isEmailValid
    ) {
      setIsContact(true);
    } else {
      setIsContact(false);
    }
  }, [number, surname, name, email]);

  const router = useRouter();

  const [isSend, setIsSend] = useState(false);

  const setFinishOrder = async () => {
    try {
      if (!isFinishFillDate) return;
      if (isSend) return;
      setIsSend(true);
      const token = localStorage.getItem('token');
      let deliveryType = '';
      const delivery = infoDelivery;
      let oblast = '';
      let city = '';
      let departmentOrPostomatOrAddress = '';
      if (delivery?.street) {
        // Кур'єр Нова Пошта
        deliveryType = 'Нова пошта курєр';
        oblast = delivery?.selectLocality?.AreaDescription || '';
        city = delivery?.selectLocality?.Description;
        departmentOrPostomatOrAddress = `Вулиця ${delivery.street} будинок ${delivery.house} квартира ${delivery.apartment}`;
      } else if (delivery?.selectInfoDelivery) {
        const description =
          delivery?.selectInfoDelivery?.Description?.toLowerCase() || '';

        const isPostomatByName = description.includes('поштомат');
        const isPostomatByType =
          delivery?.selectInfoDelivery?.TypeOfWarehouse ===
          '5d8a980d-391c-11dd-90d9-001a92567626';

        deliveryType =
          isPostomatByName || isPostomatByType
            ? 'Нова пошта поштомат'
            : 'Нова пошта відділення';
        oblast = delivery?.selectLocality?.AreaDescription || '';
        city = delivery?.selectLocality?.Description;
        departmentOrPostomatOrAddress =
          delivery?.selectInfoDelivery?.Description;
      } else if (delivery?.oblast && delivery?.city && delivery?.departament) {
        console.log(324324, delivery);
        deliveryType = 'Укр пошта';
        oblast = delivery.oblast;
        city = delivery.city;
        departmentOrPostomatOrAddress = delivery.departament;
      }
      const res = await $host.post('order/setOrder', {
        nameUser: surname + ' ' + name,
        phone: number,
        email: email,
        //delivery: infoDelivery,
        contactInfo: '',
        basket,
        comment,
        deliveryType: deliveryType,
        typePay: selectWayDelivery,
        oblast,
        city,
        departmentOrPostomatOrAddress,
        token,
        countBonus: userUseBonus,
        promokod: promokod?.code,
      });
      console.log(
        `/${lang}/order-true?contactUsers=${name + ' ' + surname}&phone=${number}&typePay=${listWayDelivery.find((x) => x.id == selectWayDelivery)?.name}&orderId=${res.data.order.id}&typeOrder=${deliveryType}&infoDelivery=${`${city}, ${departmentOrPostomatOrAddress}`}`,
        lang
      );
      router.push(
        getLocalizedPath(
          `/${lang}/order-true?contactUsers=${name + ' ' + surname}&phone=${number}&typePay=${listWayDelivery.find((x) => x.id == selectWayDelivery)?.name}&orderId=${res.data.order.id}&typeOrder=${deliveryType}&infoDelivery=${`${city}, ${departmentOrPostomatOrAddress}`}`,
          lang
        )
      );
    } catch (err: any) {
      const message = err?.response?.data?.message;

      if (message) {
        alert(message);
      } else {
        console.log(err);
        alert('Сталася помилка, спробуйте ще раз.');
      }
      setIsSend(false);
    }
  };

  const [userUseBonus, setUserUseBonus] = useState(0);
  const [promokod, setPromokod] = useState<null | PromokodFromDBInterface>(
    null
  );

  const userSetPromokod = (promokod: PromokodFromDBInterface | null) => {
    setPromokod(promokod);
    if (promokod) {
      setUserUseBonus(0);
    }
  };

  const [userHaveBonus, setUserHaveBonus] = useState(0);

  useEffect(() => {}, [userHaveBonus]);

  return (
    <div className="make-order">
      <h1>{t('makeOrder.title')}</h1>
      <div className="form-with-basket">
        <form>
          <div className="title">
            {isContactOpen ? (
              <MarkSVG />
            ) : (
              <div className="number">
                <ContactSVG />
              </div>
            )}
            <h2>
              {t('makeOrder.contactInfo')}
              <span>*</span>
            </h2>
          </div>
          <div
            style={{
              borderWidth: isContactOpen ? '0' : '0.75px',
              cursor: 'pointer',
            }}
            className={`contact block ${isContactOpen ? 'open' : ''}`}
          >
            {isContactOpen ? (
              <div onClick={() => setIsContactOpen(false)} className="fade-in">
                <div className="comtact-open">
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row-reverse',
                      alignItems: 'center',
                    }}
                    className="contact-name-and-phone"
                  >
                    <div className="name-and-surname">
                      <p>{name}</p>
                      <p>{surname}</p>
                    </div>
                    <div className="svg-main">
                      <ContactSVG />
                    </div>
                  </div>

                  <div className="pencil">
                    <PencilSVG />
                  </div>
                </div>
              </div>
            ) : (
              <div className="fade-in contact-open">
                <p>{t('makeOrder.receiver')}</p>
                <div className="value">
                  <label>
                    {t('makeOrder.phone')} <span>*</span>
                  </label>
                  <input
                    ref={phoneInputRef}
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    className="phone-input"
                    placeholder="+380 (__) ___-__-__"
                  />
                </div>
                <div className="value">
                  <label>
                    Email <span>*</span>
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="phone-input"
                    placeholder="email"
                  />
                </div>
                <div className="value">
                  <label>
                    {t('makeOrder.surname')} <span>*</span>
                  </label>
                  <input
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    type="text"
                    placeholder={t('makeOrder.surnamePlaceholder') as string}
                  />
                </div>
                <div className="value">
                  <label>
                    {t('makeOrder.name')} <span>*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    placeholder={t('makeOrder.namePlaceholder') as string}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleContinue}
                  style={{
                    opacity: isContact ? 1 : 0.3,
                    cursor: isContact ? 'pointer' : 'not-allowed',
                  }}
                >
                  {t('makeOrder.continueButton')}
                </button>
              </div>
            )}
          </div>
          <div className="title">
            {isSelectFinishDelivery ? (
              <MarkSVG />
            ) : (
              <div className="number">
                <DeliverySVG />
              </div>
            )}
            <h2>
              {t('makeOrder.delivery.title')}
              <span>*</span>
            </h2>
          </div>
          <div onClick={() => setIsSelectFinishDelivery(false)}>
            {(!isSelectFinishDelivery || selectPost == 'new') && (
              <div
                className="delivery block"
                style={{
                  borderWidth:
                    !isContactOpen || isSelectFinishDelivery ? '0' : '0.75px',
                }}
                onClick={() => {
                  setSelectPost('new');
                  setIsSelectFinishDelivery(false);
                }}
              >
                {isSelectFinishDelivery && selectPost == 'new' && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                    onClick={() => setIsSelectFinishDelivery(false)}
                    className={`dropdown ${isSelectFinishDelivery ? 'drop-open' : 'drop-close'}`}
                  >
                    <div style={{ width: '100%' }} className="row">
                      <NewPost />

                      <div className="curier-or-other">
                        <div className="row">
                          <span>{t('makeOrder.delivery.type')}:</span>
                          <p>
                            {infoDelivery?.typeDelivery == 'curier'
                              ? t('makeOrder.delivery.courier')
                              : infoDelivery?.typeDelivery == 'post'
                                ? t('makeOrder.delivery.postomat')
                                : t('makeOrder.delivery.toDepartment')}
                          </p>
                        </div>
                        <div className="row">
                          <span>{t('makeOrder.delivery.locality')}:</span>
                          <p>
                            {infoDelivery?.selectLocality?.Description || ''}
                          </p>{' '}
                        </div>
                        {infoDelivery?.typeDelivery == 'curier' ? (
                          <>
                            <div className="row row-no-wrap">
                              <span>{t('makeOrder.delivery.street')}:</span>
                              <p>{infoDelivery?.street || ''}</p>
                            </div>
                            <div className="row row-no-wrap">
                              <span>{t('makeOrder.delivery.house')}:</span>
                              <p>{infoDelivery?.house || ''}</p>
                            </div>
                            {infoDelivery?.apartment?.length > 0 && (
                              <div className="row row-no-wrap">
                                <span>
                                  {t('makeOrder.delivery.apartment')}:
                                </span>
                                <p>{infoDelivery?.apartment || ''}</p>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="row row-no-wrap">
                            <span>
                              {infoDelivery?.typeDelivery == 'post'
                                ? t('makeOrder.delivery.postomat')
                                : t('makeOrder.delivery.toDepartment')}
                              :
                            </span>
                            <p>
                              {infoDelivery?.selectInfoDelivery?.Description ||
                                ''}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <PencilSVG />
                  </div>
                )}
                <div
                  onClick={() => setIsSelectFinishDelivery(false)}
                  className={`dropdown ${
                    !isSelectFinishDelivery || selectPost != 'new'
                      ? 'drop-open'
                      : 'drop-close'
                  }`}
                >
                  <div className="col">
                    <div
                      style={{
                        borderBottom:
                          selectPost == 'new' ? '1px solid #ebd8e4' : 'none',
                      }}
                      className="radio-contain"
                    >
                      <input
                        checked={selectPost == 'new'}
                        type="radio"
                        className="radio"
                      />
                      <div className="post-title new">
                        <NewPost />
                        <div className="new-post">
                          {t('makeOrder.delivery.newPost')}
                        </div>
                        <div className="post-from">
                          {lang == 'ru' ? 'от 80 ₴' : 'від 80 ₴'}
                        </div>
                      </div>
                    </div>
                    <div className="new-post">
                      <div className="new-post-title">
                        <div
                          className={`dropdown ${selectPost == 'new' ? 'drop-open' : 'drop-close'}`}
                        >
                          <SearchNewPost
                            selectFinishDelivery={selectFinishDelivery}
                            infoDelivery={infoDelivery}
                            lang={lang}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div onClick={() => setIsSelectFinishDelivery(false)}>
            {(!isSelectFinishDelivery || selectPost == 'ukr') && (
              <div
                className="delivery block"
                style={{
                  borderWidth:
                    !isContactOpen || isSelectFinishDelivery ? '0' : '0.75px',
                }}
                onClick={() => {
                  setSelectPost('ukr');
                  setIsSelectFinishDelivery(false);
                }}
              >
                {isSelectFinishDelivery && selectPost == 'ukr' ? (
                  <div
                    className="row"
                    style={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <div style={{ gap: '10px' }} className="row">
                      <div>
                        <UkrPost />{' '}
                        <p>{lang == 'ru' ? 'Укрпочта' : 'Укрпошта'}</p>
                      </div>
                      <div className="ukr-post-info">
                        <div className="row">
                          <span>{t('makeOrder.oblast')}</span>
                          <p>{infoDelivery?.oblast}</p>
                        </div>
                        <div className="row">
                          <span>{t('makeOrder.city')}</span>
                          <p>{infoDelivery?.city}</p>
                        </div>
                        <div className="row">
                          <span>{t('makeOrder.departament')}</span>
                          <p>{infoDelivery?.departament}</p>
                        </div>
                      </div>
                    </div>{' '}
                    <PencilSVG />
                  </div>
                ) : (
                  <div className="col">
                    <div
                      style={{
                        borderBottom:
                          selectPost == 'ukr' ? '1px solid #ebd8e4' : 'none',
                      }}
                      className="radio-contain"
                    >
                      <input
                        checked={selectPost == 'ukr'}
                        type="radio"
                        className="radio"
                      />
                      <div className="post-title ukr">
                        <UkrPost />
                        <div className="new-post">
                          {t('makeOrder.delivery.ukrPost')}
                        </div>
                        <div className="post-from">
                          {lang == 'ru' ? 'от 50 ₴' : 'від 50 ₴'}
                        </div>
                      </div>
                    </div>
                    <div className="new-post">
                      <div
                        className={`dropdown ${selectPost == 'ukr' ? 'drop-open' : 'drop-close'}`}
                      >
                        <SearchUkrPost
                          infoDelivery={infoDelivery}
                          selectFinishDelivery={selectFinishDelivery}
                          lang={lang}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="title">
            {selectWayDelivery == 0 ? (
              <div className="number">
                <PaySVG />
              </div>
            ) : (
              <MarkSVG />
            )}
            <h2>
              {t('makeOrder.pay')} <span>*</span>
            </h2>
          </div>
          {selectWayDelivery == 0 ? (
            <div className="list-way-delivery">
              {listWayDelivery.map((x) => (
                <div
                  style={{ borderWidth: isSelectFinishDelivery ? '0.75px' : 0 }}
                  className="way-delvery block"
                  key={x.id}
                  onClick={() => setSelectWayDelivery(x.id)}
                >
                  <input type="radio" checked={selectWayDelivery == x.id} />
                  <div className="text">
                    <p>{x.name}</p>
                    <div className="desc">{x.description}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="selectWay">
              <div
                className="way-delvery block"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  borderWidth: 0,
                  alignItems: 'center',
                }}
                onClick={() => setSelectWayDelivery(0)}
              >
                {listWayDelivery.find((x) => x.id == selectWayDelivery)?.name}
                <div style={{ cursor: 'pointer' }} className="svg">
                  <PencilSVG />
                </div>
              </div>
            </div>
          )}
          {isFinishFillDate && (
            <div className="button-clear-form" onClick={clearSetting}>
              {t('makeOrder.resetButton')}
            </div>
          )}

          <Coment
            isOpen={isCommentOpen}
            setIsOpen={setIsCommentOpen}
            coment={comment}
            setComent={setComment}
          />
        </form>
        <div className="basket-and-promokods">
          <Promokods
            promokod={promokod}
            setPromokod={userSetPromokod}
            lang={lang}
          />
          <ListFromBasket
            lang={lang}
            setFinishOrder={setFinishOrder}
            isFinishFillDate={isFinishFillDate}
            userUseBonus={userUseBonus}
            countBonus={userHaveBonus}
            setUserUseBonus={setUserUseBonus}
            isAuth={user.isAuthorize}
            isPromokod={promokod !== null}
            promokod={promokod}
            setPromokod={setPromokod}
          />
        </div>
      </div>
    </div>
  );
};

export default MakeOrder;
