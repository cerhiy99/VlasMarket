'use client';

import React, { use, useEffect, useState } from 'react';
import './History.scss';
import { $authHost } from '@/app/http';
import PaginationDynamic from '@/app/components/utils/PaginationDynamic';
import { Locale } from '@/i18n.config';

type OrderItem = {
  id: number;
  title: string;
  image: string;
  quantity: number;
  price: number;
};

type DeliveryType = 'nova' | 'ukr';
type PaymentType = 'card' | 'cash';
type OrderStatus = 'received' | 'processing';

type Order = {
  id: number;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  paymentType: PaymentType;
  paymentLabel: string;
  deliveryType: DeliveryType;
  deliveryLabel: string;
  total: number;
  items: OrderItem[];
  opened?: boolean;
};

const mockOrders: Order[] = [
  {
    id: 1,
    orderNumber: 'Замовлення №1',
    date: '28.07.2026',
    status: 'received',
    paymentType: 'card',
    paymentLabel: 'Оплата на карту',
    deliveryType: 'nova',
    deliveryLabel: 'Нова Пошта (відділення)',
    total: 1948,
    opened: false,
    items: [
      {
        id: 1,
        title:
          'Kaaral Purify Hydra Kit 2×1000 ml Набір для зволоження волосся (шампунь+кондиціонер)',
        image: '/images/product-1.png',
        quantity: 1,
        price: 999,
      },
      {
        id: 2,
        title:
          'Lanza Healing Curls Curl Restore Moisture Treatment Маска незмивна для кучерявого волосся',
        image: '/images/product-2.png',
        quantity: 1,
        price: 949,
      },
    ],
  },
  {
    id: 2,
    orderNumber: 'Замовлення №2',
    date: '29 липня 2025',
    status: 'received',
    paymentType: 'card',
    paymentLabel: 'Оплата на карту',
    deliveryType: 'nova',
    deliveryLabel: 'Нова Пошта (відділення)',
    total: 2489,
    opened: false,
    items: [
      {
        id: 3,
        title: 'Професійний шампунь для догляду за волоссям',
        image: '/images/product-1.png',
        quantity: 1,
        price: 1245,
      },
      {
        id: 4,
        title: 'Кондиціонер для відновлення та зволоження',
        image: '/images/product-2.png',
        quantity: 1,
        price: 1244,
      },
    ],
  },
];

const limit = 5;

const HistoryPage = ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = use(params);
  const [page, setPage] = useState(1);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [countPages, setCountPages] = useState(1);

  const toggleOrder = (id: number) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, opened: !order.opened } : order
      )
    );
  };

  const getOrders = async () => {
    try {
      const res = await $authHost.get(
        `order/getMyOrdersWithPagination?page=${page}&limit=${limit}`
      );
      const fotmatCreatedAt = (date: any) => {
        const createdAt = new Date(date);
        const formattedDate = new Intl.DateTimeFormat('uk-UA', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }).format(createdAt);
        return formattedDate;
      };
      console.log(5434, JSON.parse(res.data.orders[0].basket));
      setOrders(
        res.data.orders.map((x: any) => ({
          id: x.id,
          date: fotmatCreatedAt(x.createdAt),
          status: x.status,
          paymentLabel: x.typePay.replaceAll('⚪', ''),
          deliveryType: x.deliveryType,
          deliveryLabel: x.deliveryType,
          total: x.sum,
          opened: false,
          items: JSON.parse(x.basket).map((j: any) => ({
            id: j.id,
            title: lang == 'ru' ? j.nameru : j.nameuk,
            image: process.env.NEXT_PUBLIC_SERVER + j.volumes[0].imgs[0].img,
            quantity: j.count,
            price: j.volumes[0].priceWithDiscount,
          })),
        }))
      );
      setCountPages(Math.ceil(res.data.count / limit));
    } catch (err) {
      console.log(err);
      return alert('Помилка');
    }
  };

  useEffect(() => {
    getOrders();
  }, [page]);

  const handleRepeatOrder = (order: Order) => {
    console.log('Repeat order:', order);
  };
  console.log(orders);

  return (
    <div className="account-history-layout">
      <aside className="account-history-sidebar"></aside>

      <div className="account-history-content">
        <div className="history-container">
          <h1 className="history-title">
            {lang == 'ru' ? 'История заказов' : 'Історія замовлень'}
          </h1>

          <div className="history-orders">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`history-order-card ${order.opened ? 'is-open' : ''}`}
              >
                <div className="history-order-summary">
                  <div className="history-order-left">
                    <h3 className="history-order-number">
                      {lang == 'ru' ? 'Заказ №' : 'Замовлення №'}
                      {order.id}
                    </h3>
                    <p className="history-order-date">{order.date}</p>

                    <div className="history-order-meta">
                      <div className="history-order-row">
                        <span
                          className={`history-status ${
                            order.status === 'received'
                              ? 'received'
                              : 'processing'
                          }`}
                        >
                          <div className="only-mob">Статус:</div>
                          <span>
                            {' '}
                            {order.status === 'received'
                              ? 'Отримано'
                              : lang == 'ru'
                                ? 'В обработке'
                                : 'В обробці'}
                          </span>
                        </span>

                        <div className="history-inline-info">
                          <div className="only-mob">
                            {lang == 'ru' ? 'Способ оплаты:' : 'Спосіб оплати:'}
                          </div>
                          <span>{order.paymentLabel}</span>
                        </div>
                      </div>

                      <div className="history-order-row">
                        <div className="history-inline-info delivery">
                          <div className="only-mob">
                            {lang == 'ru'
                              ? 'Способ доставки:'
                              : 'Спосіб доставки:'}
                          </div>
                          <div className="row-post">
                            <img
                              src={
                                order.deliveryType.includes('Нов') ||
                                order.deliveryType.includes('нов')
                                  ? '/images/nova-poshta-icon.svg'
                                  : '/images/ukrposhta-icon.svg'
                              }
                              alt="delivery"
                            />
                            <span>{order.deliveryLabel}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="history-order-center">
                    <img
                      src="/images/order-gift.svg"
                      alt="Order image"
                      className="history-order-gift"
                    />
                  </div>

                  <div className="history-order-right">
                    <button
                      type="button"
                      className="history-action-btn history-repeat-btn"
                      onClick={() => handleRepeatOrder(order)}
                    >
                      {lang == 'ru' ? 'Заказать снова' : 'Замовити знову'}
                    </button>

                    <div className="history-order-price">
                      <div className="only-mob">
                        {lang == 'ru' ? 'Всего' : 'Всього'}:
                      </div>{' '}
                      <span>{order.total} ₴</span>
                    </div>

                    <button
                      type="button"
                      className="history-action-btn history-toggle-btn"
                      onClick={() => toggleOrder(order.id)}
                    >
                      {order.opened
                        ? lang == 'ru'
                          ? 'Свернуть'
                          : 'Згорнути'
                        : lang == 'ru'
                          ? 'Подробнее'
                          : 'Детальніше'}
                    </button>
                  </div>
                </div>

                {order.opened && (
                  <div className="history-order-details">
                    <div className="history-products-head">
                      <div className="history-products-head-title">Товар</div>
                      <div className="history-products-head-qty">Кількість</div>
                      <div className="history-products-head-sum">Сума</div>
                    </div>

                    <div className="history-products-list">
                      {order.items.map((item) => (
                        <div key={item.id} className="history-product-row">
                          <div className="history-product-main">
                            <div className="history-product-image">
                              <img src={item.image} alt={item.title} />
                            </div>

                            <div className="history-product-title">
                              {item.title}
                            </div>
                          </div>

                          <div className="history-product-qty">
                            x{item.quantity}
                          </div>

                          <div className="history-product-price">
                            {item.price} ₴
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="history-total-row">
                      <span className="history-total-label">
                        Сума до оплати:
                      </span>
                      <strong className="history-total-value">
                        {order.total} ₴
                      </strong>
                    </div>

                    <div className="history-bottom-info">
                      <div className="history-bottom-info-item history-bottom-info-item--left">
                        <span>Дата замовлення:</span>
                        <strong>{order.date}</strong>
                      </div>

                      <div className="history-bottom-info-item history-bottom-info-item--center">
                        <span>Спосіб оплати:</span>
                        <strong>{order.paymentLabel}</strong>
                      </div>

                      <div className="history-bottom-info-item history-bottom-info-item--right">
                        <span>Спосіб доставки:</span>

                        <div className="history-bottom-delivery">
                          <img
                            src={
                              order.deliveryType.includes('Нов') ||
                              order.deliveryType.includes('нов')
                                ? '/images/nova-poshta-icon.svg'
                                : '/images/ukrposhta-icon.svg'
                            }
                            alt="delivery"
                          />
                          <strong>
                            {order.deliveryLabel
                              ? order.deliveryLabel
                              : 'Укр пошта'}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <PaginationDynamic
            totalPages={countPages}
            currentPage={page}
            onPageChange={setPage}
            to="true"
          />
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
