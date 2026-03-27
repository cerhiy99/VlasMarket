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

type Props = {
  lang: Locale;
};

const MakeOrder: React.FC<Props> = ({ lang }) => {
  const { basket } = useSelector((state: RootState) => state.BasketAndLike);

  const { t } = useTranslation();
  const listWayDelivery = [
    {
      id: 1,
      name: t('makeOrder.listWayDelivery.1'),
    },
    {
      id: 2,
      name: t('makeOrder.listWayDelivery.2'),
    },
    {
      id: 3,
      name: t('makeOrder.listWayDelivery.3'),
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

  const [selectPost, setSelectPost] = useState<'new' | 'ukr' | 'seller' | null>('new');
  const [selectWayDelivery, setSelectWayDelivery] = useState(0);
  const [personalDiscount, setPeronalDiscount] = useState(0);

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

  useEffect(() => {
    setUser();
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
    if (isContactOpen && isSelectFinishDelivery && selectWayDelivery && basket.length > 0) {
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

  const setPeronal = async () => {
    if (user.isAuthorize) {
      try {
        const res = await $authHost.get('user/getPersonal');
        const personal = res.data.personal;
        if (personal) {
          setName(personal.firstName || '');
          setSurname(personal.lastName || '');
          setNumber(personal.phone.slice() || '');

          if (personal.deliveryType.startsWith('Нова пошт')) {
            setSelectPost('new');
            setIsSelectFinishDelivery(true);

            setInfoDelivery({
              typeDelivery: (personal.novaPoshtaWarehouseName || '').startsWith('Поштомат')
                ? 'post'
                : 'warehouse',
              selectLocality: {
                Description: personal.novaPoshtaCityName || '',
                AreaDescription: personal.novaPoshtaCityName || '',
              },
              selectInfoDelivery: {
                Description: personal.novaPoshtaWarehouseName || '',
                AreaDescription: personal.novaPoshtaCityName || '',
              },
              street: personal.novaPoshtaStreet,
              house: personal.novaPoshtaBuilding,
              apartment: personal.novaPoshtaApartment,
            });
          } else if (personal.deliveryType.startsWith('Укр')) {
            setSelectPost('ukr');
            setIsSelectFinishDelivery(true);

            setInfoDelivery({
              oblast: personal.ukrPoshtaRegion,
              city: personal.ukrPoshtaCity,
              departament: personal.ukrPoshtaDepartment,
            });
          } else if (personal.deliveryType.startsWith("Кур'єром нов")) {
            setSelectPost('new');
            setIsSelectFinishDelivery(true);

            // Додаємо захист від порожніх даних з бекенду
            const cityName = personal.novaPoshtaCityName || '';

            setInfoDelivery({
              typeDelivery: 'curier',
              apartment: personal.novaPoshtaApartment || '',
              house: personal.novaPoshtaBuilding || '',
              street: personal.novaPoshtaStreet || '',
              Description: cityName,
              DescriptionRu: cityName,
              selectLocality: {
                Ref: personal.novaPoshtaCityRef || '',
                Description: cityName,
                DescriptionRu: cityName,
                AreaDescription: cityName,
              },
              selectInfoDelivery: {
                Ref: personal.novaPoshtaCityRef || '',
                Description: cityName,
                DescriptionRu: cityName,
                AreaDescription: cityName,
              },
            });
          }
          /*
{
    "typeDelivery": "curier",
    "selectLocality": {
        "Description": "Львів",
        "DescriptionRu": "Львов",
        "Ref": "db5c88f5-391c-11dd-90d9-001a92567626",
        "Delivery1": "1",
        "Delivery2": "1",
        "Delivery3": "1",
        "Delivery4": "1",
        "Delivery5": "1",
        "Delivery6": "1",
        "Delivery7": "1",
        "Area": "71508134-9b87-11de-822f-000c2965ae0e",
        "SettlementType": "563ced10-f210-11e3-8c4a-0050568002cf",
        "IsBranch": "1",
        "PreventEntryNewStreetsUser": "0",
        "CityID": "8",
        "SettlementTypeDescription": "місто",
        "SettlementTypeDescriptionRu": "город",
        "SpecialCashCheck": 1,
        "AreaDescription": "Львівська",
        "AreaDescriptionRu": "Львовская"
    },
    "street": "Стрийська",
    "house": "106",
    "apartment": "87"
}
          */
          /*
{
    "curier": "curier",
    "apartment": "87",
    "house": "106",
    "street": "Стрийська",
    "Description": "Львів",
    "DescriptionRu": "Львів",
    "selectLocality": {
        "Ref": "db5c88f5-391c-11dd-90d9-001a92567626",
        "Description": "Львів",
        "DescriptionRu": "Львів"
    },
    "selectInfoDelivery": {
        "Ref": "db5c88f5-391c-11dd-90d9-001a92567626",
        "Description": "Львів",
        "DescriptionRu": "Львів"
    }
}
         */

          setIsContactOpen(true);
          setIsContact(true);
          setIsSelectFinishDelivery(true);
          //setSelectWayDelivery(1) // або завантаж із personal, якщо є поле
        } else {
          // Перевірка заповненості полів
          setIsContact(!!(name.trim() && surname.trim() && number[18] != '_'));
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    setPeronal();
  }, [user]);

  useEffect(() => {
    getPersonalDiscount();
  }, [user]);

  const router = useRouter();

  const getPersonalDiscount = async () => {
    try {
      if (!user.isAuthorize) return;
      const res = await $authHost.get('user/getPersonalDiscount');
      setPeronalDiscount(res.data.procent);
    } catch (err) {
      console.log(err);
    }
  };

  const setFinishOrder = async () => {
    try {
      if (!isFinishFillDate) return;
      const token = localStorage.getItem('token');
      const res = await $host.post('order/setOrder', {
        surname,
        name,
        phone: number,
        delivery: infoDelivery,
        comment,
        basket,
        typePay: selectWayDelivery,
        token,
        email,
      });
      const delivery = infoDelivery;
      let typeDelivery = '';
      let deliveryText = '';
      let deliveryTextAdmin = '';

      if (delivery?.street) {
        // Кур'єр Нова Пошта
        typeDelivery = 'Курєр нова пошта';
        deliveryText = `🚚 Доставка кур'єром Нової Пошти у ${
          delivery?.selectLocality?.AreaDescription
        }, населений пункт: ${delivery?.selectLocality?.Description}, вул. ${
          delivery?.street
        }, буд. ${delivery?.house}${delivery?.apartment ? `, кв. ${delivery.apartment}` : ''}`;
        deliveryTextAdmin = `<p>Населений пункт</p>
<span>${delivery?.selectLocality?.Description}</span>
<p>Місто</p>
<span>${delivery.street}</span>
<p>буд</p>
<span>${delivery.house}</span>
<p>кв.</p>
<span>${delivery.apartment}</span>
`;
      } else if (delivery?.selectInfoDelivery) {
        // Відділення або поштомат НП
        const warehouseType =
          delivery?.selectInfoDelivery?.Description?.toLowerCase().includes('поштомат') ||
          delivery?.selectInfoDelivery?.TypeOfWarehouse === '5d8a980d-391c-11dd-90d9-001a92567626'
            ? 'поштомат Нової Пошти'
            : 'відділення Нової Пошти';
        typeDelivery = warehouseType;
        deliveryText = `🚚 Доставка: ${warehouseType} у ${delivery?.selectLocality?.AreaDescription}, населений пункт: ${delivery?.selectLocality?.Description}, ${delivery?.selectInfoDelivery?.Description}`;
        deliveryTextAdmin = `<p>Населений пункт</p>
<span>${delivery?.selectLocality?.Description}</span>
<p>${warehouseType}</p>
<span>${delivery.selectInfoDelivery.Description}</span>
`;
      } else if (delivery?.oblast && delivery?.city && delivery?.departament) {
        // Укрпошта
        typeDelivery = 'Укр пошта';
        deliveryText = `🚚 Доставка Укрпоштою у ${delivery.oblast}, місто: ${delivery.city}, відділення №${delivery.departament}`;
        deliveryTextAdmin = `<p>Область</p>
        <span>${delivery.oblast}</span>
        <p>Місто</p>
        <span>${delivery.city}</span>
        <p>Відділення</p>
        <span>${delivery.departament}</span>`;
      }
      router.push(
        getLocalizedPath(
          `/${lang}/order-true?contactUsers=${name + ' ' + surname}&phone=${number}&typePay=${listWayDelivery.find((x) => x.id == selectWayDelivery)?.name}&orderId=${res.data.res.id}&typeOrder=${typeDelivery}&infoDelivery=${deliveryTextAdmin}`,
          lang
        )
      );
    } catch (err) {
      alert('Сталася помилка, спробуйте ще раз.');
      console.log(err);
    }
  };

  useEffect(() => {}, [personalDiscount]);

  return (
    <div className="make-order">
      <h1>{t('makeOrder.title')}</h1>
      <div className="form-with-basket">
        <form>
          <div className="title">
            {isContactOpen ? <MarkSVG /> : <div className="number">1</div>}
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
                  <div className="contact-name-and-phone">
                    <div className="name-and-surname">
                      <p>{name}</p>
                      <p>{surname}</p>
                    </div>
                    <div className="number">{number}</div>{' '}
                  </div>

                  <div className="pencil">
                    <PencilSVG />
                  </div>
                </div>
              </div>
            ) : (
              <div className="fade-in">
                <p>{t('makeOrder.receiver')}</p>
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
                <label>
                  {t('makeOrder.surname')} <span>*</span>
                </label>
                <input
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  type="text"
                  placeholder={t('makeOrder.surnamePlaceholder') as string}
                />
                <label>
                  {t('makeOrder.name')} <span>*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder={t('makeOrder.namePlaceholder') as string}
                />
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
            {isSelectFinishDelivery ? <MarkSVG /> : <div className="number">2</div>}
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
                  borderWidth: !isContactOpen || isSelectFinishDelivery ? '0' : '0.75px',
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
                          <span>{t('makeOrder.delivery.type')}</span>
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
                          <p>{infoDelivery?.selectLocality?.Description || ''}</p>{' '}
                        </div>
                        {infoDelivery?.typeDelivery == 'curier' ? (
                          <>
                            <div className="row">
                              <span>{t('makeOrder.delivery.street')}:</span>
                              <p>{infoDelivery?.street || ''}</p>
                            </div>
                            <div className="row">
                              <span>{t('makeOrder.delivery.house')}:</span>
                              <p>{infoDelivery?.house || ''}</p>
                            </div>
                            {infoDelivery?.apartment?.length > 0 && (
                              <div className="row">
                                <span>{t('makeOrder.delivery.apartment')}:</span>
                                <p>{infoDelivery?.apartment || ''}</p>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="row">
                            <span>
                              {infoDelivery?.typeDelivery == 'post'
                                ? t('makeOrder.delivery.postomat')
                                : t('makeOrder.delivery.toDepartment')}
                              :
                            </span>
                            <p>{infoDelivery?.selectInfoDelivery?.Description || ''}</p>
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
                    !isSelectFinishDelivery || selectPost != 'new' ? 'drop-open' : 'drop-close'
                  }`}
                >
                  <div className="row">
                    <div className="radio-contain">
                      <input checked={selectPost == 'new'} type="radio" className="radio" />
                    </div>
                    <div className="new-post">
                      <div className="new-post-title">
                        <NewPost />
                        <div className="new-post">{t('makeOrder.delivery.newPost')}</div>
                        <div className="list-price">
                          <span>{t('makeOrder.delivery.newPostPriceFrom')}</span>
                          <span>{t('makeOrder.delivery.newPostPricePostomat')}</span>
                          <span>{t('makeOrder.delivery.newPostPriceDepartment')}</span>
                          <span>{t('makeOrder.delivery.newPostPriceCourier')}</span>
                        </div>
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
                  borderWidth: !isContactOpen || isSelectFinishDelivery ? '0' : '0.75px',
                }}
                onClick={() => {
                  setSelectPost('ukr');
                  setIsSelectFinishDelivery(false);
                }}
              >
                {isSelectFinishDelivery && selectPost == 'ukr' ? (
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <div style={{ gap: '10px' }} className="row">
                      <div>
                        <UkrPost /> <p>{lang == 'ru' ? 'Укрпочта' : 'Укрпошта'}</p>
                      </div>
                      <div>
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
                  <div className="row">
                    <div className="radio-contain">
                      <input checked={selectPost == 'ukr'} type="radio" className="radio" />
                    </div>
                    <div className="new-post">
                      <div className="new-post-title">
                        <UkrPost />{' '}
                        <div className="new-post">{lang == 'ru' ? 'Укрпочта' : 'Укрпошта'}</div>
                        <div className="list-price">
                          <span>{t('makeOrder.delivery.ukrPostPriceFrom')}</span>
                          <span> {t('makeOrder.delivery.ukrPostPriceDepartment')}</span>
                        </div>
                      </div>

                      <div
                        className={`dropdown ${selectPost == 'ukr' ? 'drop-open' : 'drop-close'}`}
                      >
                        <SearchUkrPost
                          infoDelivery={infoDelivery}
                          selectFinishDelivery={selectFinishDelivery}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="title">
            {selectWayDelivery == 0 ? <div className="number">3</div> : <MarkSVG />}
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
                  {x.name}
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
        <ListFromBasket
          lang={lang}
          setFinishOrder={setFinishOrder}
          isFinishFillDate={isFinishFillDate}
          personal={personalDiscount}
        />
      </div>
    </div>
  );
};

export default MakeOrder;
