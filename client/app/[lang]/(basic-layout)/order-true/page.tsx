'use client';
import React, { useEffect, useState, use } from 'react';
import './OrderTrue.scss';
import { RootState } from '@/app/store';
import { Locale } from '@/i18n.config';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import OrderSVG from './order.svg';
import InfoSVG from './info.svg';
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
  const sParams = use(searchParams);
  const { t } = useTranslation();
  const [personal, setPeronal] = useState(0);
  const basketTemp = useSelector(
    (state: RootState) => state.BasketAndLike.basket
  );
  const [basket] = useState(basketTemp);
  const dispatch = useDispatch();
  const router = useRouter();

  const { isAuthorize } = useSelector((state: RootState) => state.user);

  const getPersonal = async () => {
    try {
      if (!isAuthorize) return;
      const res = await $authHost.get('user/getPersonalDiscount');
      setPeronal(res.data.procent);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (basketTemp.length > 0) {
      dispatch(setBasket([]));
    }
  }, [basket]);

  useEffect(() => {
    getPersonal();
  }, [isAuthorize]);

  const totalWithoutDiscount = basket.reduce(
    (sum: number, item: any) => sum + item.volume.priceWithDiscount,
    0
  );

  const totalPrice =
    totalWithoutDiscount - (totalWithoutDiscount * personal) / 100;

  return (
    <div className="order-true-container">
      <h1>{lang == 'ru' ? 'Спасибо за заказ!' : 'Дякуємо за замовлення!'}</h1>

      <div className="green-block">
        <div className="green-block-content">
          <h2>
            {lang == 'ru'
              ? 'Ваш заказ успешно оформлен'
              : 'Ваше замовлення успішно оформлено'}
          </h2>
          <p>
            {lang == 'ru'
              ? 'Каждый оформленный заказ способствует развитию экономики Украины и поддержке украинского бизнеса.'
              : 'Кожне оформлене замовлення сприяє розвитку економіки України та підтримці українського бізнесу.'}
          </p>
        </div>

        <div className="green-block-image">
          <OrderSVG />
        </div>
      </div>

      <div className="next-step-section">
        <div className="next-step-icon">
          <InfoSVG />
        </div>

        <div className="next-step-content">
          <h3>{lang == 'ru' ? '' : 'Що далі?'}</h3>
          <p>
            {lang == 'ru'
              ? 'В ближайшее время с вами свяжется менеджер для уточнения деталей заказа (при наличии товара). В случае отсутствия позиции информация будет отправлена ​​на вашу электронную почту. Просмотреть статус и детали заказа вы можете в своем личном кабинете после авторизации на сайте.'
              : 'Найближчим часом з вами зв’яжеться менеджер для уточнення деталей замовлення (за умови наявності товару). У разі відсутності позиції інформацію буде надіслано на вашу електронну пошту. Переглянути статус та деталі замовлення ви можете у своєму особистому кабінеті після авторизації на сайті.'}
          </p>
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
              <img
                src={process.env.NEXT_PUBLIC_SERVER + x.volume.img}
                alt={lang === 'ru' ? x.nameRU : x.nameUA}
              />
            </div>

            <div className="product-info">
              <div className="product-name">
                {lang === 'ru' ? x.nameRU : x.nameUA}
              </div>

              <div className="product-quantity">{x.count} шт.</div>

              <div className="product-price">
                <span className="current-price">
                  {x.volume.priceWithDiscount} ₴/шт.
                </span>
                {x.volume.priceWithDiscount !== x.volume.price && (
                  <span className="old-price">{x.volume.price} ₴/шт.</span>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="total-amount">
          <div className="total-amount-label">
            <span className="total-main-text">
              {lang == 'ru' ? '' : 'Сума до сплати'}
            </span>
            <span className="total-subtext">
              {t('OrderTrue.toPayWithoutDelivery')}
            </span>
          </div>

          <span className="total-price">{totalPrice} ₴</span>
        </div>
      </div>

      {sParams.typeOrder && (
        <div className="delivery-section">
          <h3>{t('OrderTrue.deliveryTitle')}</h3>

          <div className="delivery-method">
            <span className="delivery-icon">✦</span>
            <span className="delivery-name">
              {sParams.typeOrder[0]?.toLocaleUpperCase() +
                sParams.typeOrder.slice(1)}
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
        <div className="payment-option">
          <span>{sParams.typePay}</span>
          <span className="payment-option-subtext">
            {
              listWayDelivery.find((x) => x.name == sParams.typePay)
                ?.description
            }
          </span>
        </div>
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
            router.push(getLocalizedPath(`/${lang}`, lang));
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
