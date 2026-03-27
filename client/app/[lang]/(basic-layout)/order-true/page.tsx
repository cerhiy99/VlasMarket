'use client';
import React, { useEffect, useState, use } from 'react';
import './OrderTrue.css'; // Імпортуємо стилі
import { RootState } from '@/app/store';
import { Locale } from '@/i18n.config';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import OrderSVG from './order.svg';
import { setBasket } from '@/app/store/reducers/cartReducer';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';
import { useTranslation } from '@/context/TranslationProvider';
import { $authHost } from '@/app/http';

type Props = {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<any>;
};

const Page = ({ params, searchParams }: Props) => {
  const { lang } = use(params);
  const sParams = use(searchParams);
  const { t } = useTranslation();
  const [personal, setPeronal] = useState(0);
  const basketTemp = useSelector((state: RootState) => state.BasketAndLike.basket);
  const [basket] = useState(basketTemp);
  const dispatch = useDispatch();

  const getPersonal = async () => {
    try {
      if (!isAuthorize) return;
      const res = await $authHost.get('user/getPersonalDiscount');
      setPeronal(res.data.procent);
    } catch (err) {
      console.log(err);
    }
  };

  const { isAuthorize } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (basketTemp.length > 0) {
      dispatch(setBasket([]));
    }
  }, [basket]);
  useEffect(() => {
    getPersonal();
  }, [isAuthorize]);
  const router = useRouter();

  return (
    <div className="order-true-container">
      <h1>{t('OrderTrue.thankYouTitle')}</h1>

      <div className="green-block">
        <div className="green-block-content">
          <h2>{t('OrderTrue.successTitle')}</h2>
          <p>{t('OrderTrue.description')}</p>
        </div>
        <div className="green-block-image">
          {/* Тут має бути зображення зі знижками, можна використати SVG або інше зображення */}
          <OrderSVG />
          {/* Замініть на своє зображення */}
        </div>
      </div>

      <div className="order-details-section">
        <div className="order-header">
          <div className="order-number">
            {t('OrderTrue.orderNumberPrefix')} {sParams.orderId}
          </div>
          <span className="items-count">
            {basket.length} {t('OrderTrue.itemCount')}
          </span>
        </div>
        {basket.map((x: any) => (
          <div key={x.id} className="product-item">
            <div className="product-image">
              <img src={process.env.NEXT_PUBLIC_SERVER + x.volume.img} alt="Термоетикетка" />{' '}
              {/* Замініть на своє зображення */}
            </div>
            <div className="product-info">
              <div className="product-name">{lang == 'ru' ? x.nameRU : x.nameUA}</div>
              <div className="product-quantity">{x.count} шт.</div>
              <div className="product-price">
                <span className="current-price">{x.volume.priceWithDiscount} ₴/шт.</span>
                {x.volume.priceWithDiscount != x.volume.price && (
                  <span className="old-price">{x.volume.price} ₴/шт.</span>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="total-amount">
          <span>{t('OrderTrue.toPayWithoutDelivery')}</span>
          <span className="total-price">
            {basket.reduce((x, j) => x + j.volume.priceWithDiscount, 0) -
              (basket.reduce((x, j) => x + j.volume.priceWithDiscount, 0) * personal) / 100}
            ₴
          </span>
        </div>
      </div>
      {sParams.typeOrder && (
        <div className="delivery-section">
          <h3>{t('OrderTrue.deliveryTitle')}</h3>
          <div className="delivery-method">
            <span className="delivery-icon">📦</span> {/* Замініть на іконку Нової Пошти */}
            <span className="delivery-name">
              {sParams.typeOrder[0]?.toLocaleUpperCase() + sParams.typeOrder.slice(1)}
            </span>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: sParams.infoDelivery }}
            className="delivery-address"
          >
            {/*JSON.parse(searchParams.orderInfo).map((x: any) => (
            <p className='address-label' key={x}>
              {x}
            </p>
          ))*/}
          </div>
        </div>
      )}

      <div className="payment-section">
        <h3>{t('OrderTrue.paymentTitle')}</h3>
        <div className="payment-option">{sParams.typePay}</div>
      </div>

      <div className="contact-section">
        <h3>{t('OrderTrue.contactsTitle')}</h3>
        <div className="contact-info">
          <p>{sParams.contactUsers}</p>
          <p>{sParams.phone}</p>
        </div>
      </div>

      <div className="continue-button-container">
        <button
          onClick={() => {
            dispatch(setBasket([]));
            router.push(getLocalizedPath(`/${lang}/goods/1`, lang));
          }}
          className="continue-shopping-button"
        >
          {t('OrderTrue.continueShoppingButton')}
        </button>
      </div>
    </div>
  );
};

export default Page;
