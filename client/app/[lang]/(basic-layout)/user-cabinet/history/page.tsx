'use client';

import React, { useState } from 'react';
import './History.scss';

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

const HistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const toggleOrder = (id: number) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, opened: !order.opened } : order
      )
    );
  };

  const handleRepeatOrder = (order: Order) => {
    console.log('Repeat order:', order);
  };

  return (
    <div className="account-history-layout">
      <aside className="account-history-sidebar"></aside>

      <main className="account-history-content">
        <div className="history-container">
          <h1 className="history-title">Історія замовлень</h1>

          <div className="history-orders">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`history-order-card ${order.opened ? 'is-open' : ''}`}
              >
                <div className="history-order-summary">
                  <div className="history-order-left">
                    <h3 className="history-order-number">{order.orderNumber}</h3>
                    <p className="history-order-date">{order.date}</p>

                    <div className="history-order-meta">
                      <div className="history-order-row">
                        <span
                          className={`history-status ${
                            order.status === 'received' ? 'received' : 'processing'
                          }`}
                        >
                          {order.status === 'received' ? 'Отримано' : 'В обробці'}
                        </span>

                        <div className="history-inline-info">
                          <img
                            src="/images/payment-card-icon.svg"
                            alt="payment"
                          />
                          <span>{order.paymentLabel}</span>
                        </div>
                      </div>

                      <div className="history-order-row">
                        <div className="history-inline-info delivery">
                          <img
                            src={
                              order.deliveryType === 'nova'
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
                      Замовити знову
                    </button>

                    <div className="history-order-price">{order.total} ₴</div>

                    <button
                      type="button"
                      className="history-action-btn history-toggle-btn"
                      onClick={() => toggleOrder(order.id)}
                    >
                      {order.opened ? 'Згорнути' : 'Детальніше'}
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

                            <div className="history-product-title">{item.title}</div>
                          </div>

                          <div className="history-product-qty">x{item.quantity}</div>

                          <div className="history-product-price">{item.price} ₴</div>
                        </div>
                      ))}
                    </div>

                    <div className="history-total-row">
                      <span className="history-total-label">Сума до оплати:</span>
                      <strong className="history-total-value">{order.total} ₴</strong>
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
                              order.deliveryType === 'nova'
                                ? '/images/nova-poshta-icon.svg'
                                : '/images/ukrposhta-icon.svg'
                            }
                            alt="delivery"
                          />
                          <strong>{order.deliveryLabel}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="history-pagination">
            <button type="button" className="history-pagination-arrow">
              ←
            </button>

            <button type="button" className="history-pagination-btn">
              1
            </button>
            <button type="button" className="history-pagination-btn">
              2
            </button>
            <button type="button" className="history-pagination-btn active">
              3
            </button>
            <button type="button" className="history-pagination-btn">
              4
            </button>
            <button type="button" className="history-pagination-btn">
              ...
            </button>
            <button type="button" className="history-pagination-btn">
              6
            </button>

            <button type="button" className="history-pagination-arrow">
              →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;