'use client';

import Image from 'next/image';
import './ordersPage.scss';
import { use, useEffect, useState } from 'react';
import TabNavigation from '../components/tabNavigation';
import { Locale } from '@/i18n.config';
import { $authHost } from '@/app/http';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { addToBasket, setBasket } from '@/app/store/reducers/cartReducer';
import { useRouter } from 'next/navigation';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';
import { useTranslation } from '@/context/TranslationProvider';

interface OrderItem {
  id: string;
  name: string;
  code: string;
  quantity: number;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
}

interface Order {
  id: string;
  date: string;
  paymentMethod: string;
  deliveryMethod: string;
  totalAmount: number;
  status: string;
  items: OrderItem[];
}
const DeliverySvg = () => {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.0272 5.32578C16.0868 5.30764 16.1663 5.34393 16.2459 5.44373C16.2459 5.44373 16.2459 5.44373 19.8449 8.63724C20.0537 8.82776 20.0537 9.11808 19.8449 9.26324C19.8449 9.26324 19.8449 9.26324 16.2459 12.5112C16.1663 12.6019 16.0868 12.6291 16.0272 12.6019C15.9675 12.5747 15.9277 12.484 15.9277 12.366V5.53445C15.9277 5.41651 15.9675 5.34393 16.0272 5.32578Z"
        fill="#ED1C24"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.87138 0H10.1299L10.3685 0.0907247C10.3685 0.0907247 10.3685 0.0907247 14.0769 3.43847C14.236 3.62899 14.1763 3.76508 13.9178 3.76508C13.9178 3.76508 13.9178 3.76508 12.3768 3.76508C12.1183 3.76508 11.8996 3.96467 11.8996 4.20055C11.8996 4.20055 11.8996 4.20055 11.8996 6.68641C11.8996 6.9223 11.6908 7.11282 11.3726 7.11282C11.3726 7.11282 11.3726 7.11282 8.67832 7.11282C8.40988 7.11282 8.20109 6.9223 8.20109 6.68641C8.20109 6.68641 8.20109 6.68641 8.20109 4.20055C8.20109 3.96467 7.99231 3.76508 7.72387 3.76508H6.08342C5.81498 3.76508 5.76527 3.62899 5.92434 3.43847C5.92434 3.43847 5.92434 3.43847 9.63276 0.0907247L9.87138 0Z"
        fill="#ED1C24"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.0738 5.25323C4.13345 5.28952 4.17322 5.37118 4.17322 5.48912V12.4568C4.17322 12.5838 4.13345 12.6564 4.0738 12.6745C4.0042 12.7017 3.91472 12.6745 3.80536 12.6019C3.80536 12.6019 3.80536 12.6019 0.156589 9.26327C-0.0521963 9.11811 -0.0521963 8.82779 0.156589 8.63727C0.156589 8.63727 0.156589 8.63727 3.80536 5.34396C3.91472 5.25323 4.0042 5.22602 4.0738 5.25323Z"
        fill="#ED1C24"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.67773 10.7422C8.67773 10.7422 8.67773 10.7422 11.3721 10.7422C11.6902 10.7422 11.9089 10.9327 11.9089 11.1777C11.9089 11.1777 11.9089 11.1777 11.9089 13.7996C11.9089 14.0899 12.1177 14.2805 12.3762 14.2805H13.8079C14.0763 14.2805 14.1757 14.4165 13.967 14.5617C13.967 14.5617 13.967 14.5617 10.3679 17.855C10.2585 17.9548 10.1293 18.0002 10 18.0002C9.87079 18.0002 9.7316 17.9548 9.63218 17.855C9.63218 17.855 9.63218 17.855 6.03312 14.5617C5.81439 14.4165 5.92376 14.2805 6.18225 14.2805C6.18225 14.2805 6.18225 14.2805 7.72329 14.2805C7.99173 14.2805 8.20051 14.0899 8.20051 13.7996C8.20051 13.7996 8.20051 13.7996 8.20051 11.1777C8.20051 10.9327 8.4093 10.7422 8.67773 10.7422Z"
        fill="#ED1C24"
      />
    </svg>
  );
};

const PaymentSvg = () => {
  return (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.92662 7.66797H2.14453V8.95407L3.92662 8.95402V7.66797Z"
        fill="#82BFAB"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.25038 9.69502H2.14453V10.9811H5.31866V7.66797H4.5741V9.32452C4.5741 9.52914 4.42908 9.69502 4.25038 9.69502Z"
        fill="#82BFAB"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.96484 7.66797L5.96489 10.9811H6.96233V7.66797H5.96484Z"
        fill="#82BFAB"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.2003 12.3726H10.0176V15.8858H17.2003V12.3726Z"
        fill="#82BFAB"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.48 9.69462H9.73748C9.55869 9.69462 9.41366 9.5288 9.41366 9.32418C9.41376 9.1195 9.55869 8.95373 9.73743 8.95373L17.48 8.95368C17.6587 8.95368 17.8037 9.11956 17.8037 9.32418C17.8037 9.5288 17.6587 9.69468 17.48 9.69462ZM7.61095 7.29718L7.611 11.3513C7.611 11.5558 7.46593 11.7218 7.28723 11.7217H5.64226H1.82045C1.64166 11.7217 1.49659 11.556 1.49659 11.3513V9.32429V7.29713C1.49659 7.09251 1.64162 6.92668 1.82036 6.92668H4.24998H5.64207H7.28718C7.46593 6.92668 7.61095 7.09256 7.61095 7.29718ZM18.808 5.30328L1.54349 5.30322L1.19186 5.30328C0.534593 5.30328 0 5.91489 0 6.6667L9.58641e-05 16.6361C9.58641e-05 17.3882 0.534593 17.9998 1.19186 17.9998H18.8082C19.4655 17.9998 20 17.3882 20 16.6362V6.66659C20 6.20615 19.7995 5.79828 19.493 5.55136C19.4858 5.54669 19.4787 5.54164 19.4717 5.53632C19.3045 5.40671 19.1137 5.32907 18.9144 5.30865C18.914 5.3086 18.9135 5.30855 18.9131 5.30855C18.8785 5.30509 18.8433 5.30328 18.808 5.30328ZM17.48 7.61747H9.73748C9.55869 7.61747 9.41366 7.45165 9.41366 7.24703C9.41376 7.04247 9.55869 6.87658 9.73743 6.87658L17.48 6.87653C17.6587 6.87653 17.8037 7.04247 17.8037 7.24703C17.8037 7.4516 17.6587 7.61753 17.48 7.61747ZM9.69359 11.6314H17.5238C17.7026 11.6314 17.8476 11.7972 17.8476 12.0018L17.8477 16.256C17.8477 16.4605 17.7026 16.6265 17.5238 16.6265H9.69364C9.5148 16.6265 9.36978 16.4606 9.36978 16.256V12.0017C9.36983 11.7972 9.51485 11.6314 9.69359 11.6314Z"
        fill="#616E7D"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.699 0.0588476L3.72656 4.56246H18.8086C18.9232 4.56246 19.0366 4.57459 19.1479 4.59857L18.1851 0.967757C17.9945 0.248323 17.3275 -0.159381 16.699 0.0588476Z"
        fill="#616E7D"
      />
    </svg>
  );
};

const IconUrkPost = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="100px"
      height="25px"
      viewBox="0 0 186 50"
      version="1.1"
    >
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-134.000000, -20.000000)">
          <g>
            <g id="site-logo" transform="translate(134.000000, 20.000000)">
              <path
                id="logo-shape"
                d="M33.4014085,28.5526316 L17.0107042,24.8245614 C12.7869212,23.8666513 9.82564198,20.044013 9.93894213,15.6958077 C10.0522423,11.3476023 13.2085414,7.68581496 17.4764267,6.9511783 C21.744312,6.21654165 25.9341864,8.61382262 27.4821683,12.6760693 C29.0301502,16.738316 27.5047672,21.3332493 23.8394366,23.6491228 C23.7694744,23.7015627 23.7356365,23.789651 23.7523976,23.8757068 C23.7691588,23.9617626 23.8335503,24.030545 23.9180282,24.0526316 L31.2095775,25.7105263 C31.3830365,25.7509295 31.5639961,25.6857635 31.6723944,25.5438596 C35.2044426,20.8573651 35.8802618,14.5978186 33.4305397,9.25963413 C30.9808175,3.92144962 25.8036992,0.37222433 19.9622535,0.0263157895 L19.2811268,0.0263157895 C12.4734678,-0.0806359551 6.17960389,3.65128187 2.98325566,9.69006401 C-0.213092582,15.7288461 0.226544695,23.0571747 4.12169014,28.6666667 L18.7047887,49.5877193 C18.7689058,49.6759502 18.8711132,49.7281179 18.9798592,49.7281179 C19.0886051,49.7281179 19.1908125,49.6759502 19.2549296,49.5877193 L33.6109859,29.1052632 C33.6872133,29.0105357 33.7075514,28.8822387 33.6643845,28.7684127 C33.6212177,28.6545867 33.5210574,28.5724017 33.4014085,28.5526316 Z"
                fill="#FFC627"
                fill-rule="nonzero"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

const OrdersPage = ({ params }: { params: Promise<{ lang: Locale }> }) => {
  const { lang } = use(params);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const getStatus = (status: string) => {
    console.log(343, t('myOrders.statusWait'));
    switch (status) {
      case 'wait': {
        return t('myOrders.statusWait');
      }
      case 'check': {
        return t('myOrders.statusCheck');
      }
      case 'pay': {
        return t('myOrders.statusPay');
      }
      case 'nalozhen': {
        return t('myOrders.statusNalozhen');
      }
      case 'finish': {
        return t('myOrders.statusFinish');
      }
      case 'cansel': {
        return t('myOrders.statusCansel');
      }
      default: {
        return t('myOrders.statusUnknown');
      }
    }
  };

  const getOrders = async () => {
    try {
      const res = await $authHost.get('order/getMyOrders');

      const trueOrders: Order[] = res.data.map((x: any) => ({
        id: x.id,
        date: x.createdAt.slice(0, 10),
        paymentMethod: x.typePay,
        deliveryMethod: x.deliveryType,
        totalAmount: x.sum,
        status: getStatus(x.status),
        items: JSON.parse(x.basket).map((j: any) => ({
          id: j.id,
          name: lang == 'ru' ? j.nameru : j.nameuk,
          code: j.art,
          quantity: j.count,
          price: j.volumes[0].price,
          originalPrice: j.volumes[0].price,
          discount: Math.round(100 - (j.volumes[0].price / j.volumes[0].price) * 100),
          image: process.env.NEXT_PUBLIC_SERVER + j.volumes[0].imgs[0].img,
        })),
      }));
      setOrders(trueOrders);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    setMenuOpenId(null);
  };

  const toggleMenu = (orderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpenId(menuOpenId === orderId ? null : orderId);
  };

  const repeatOrder = async (orderId: string) => {
    console.log(`Repeating order ${orderId}`);
    setMenuOpenId(null);
    try {
      const res = await $authHost.get(`user/repearOrder/${orderId}`);
      dispatch(setBasket(res.data));
      router.push(getLocalizedPath(`/${lang}/make-order`, lang));
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalSum = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };
  return (
    <div className="PageOrders">
      <div className="PageOrders__title">
        {t('myOrders.title')}
        {orders.length > 0 && <div className="hiddenHint">{t('myOrders.latestHint')}</div>}
      </div>
      {orders.length ? (
        <div className="PageOrders__container">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <div className="order-number">#{order.id}</div>
                  <div className="order-date">{order.date}</div>
                </div>
                <div className="order-actions">
                  <button
                    className="menu-button"
                    onClick={(e) => toggleMenu(order.id, e)}
                    aria-label={t('myOrders.menuLabel') as string}
                  >
                    <div className="menuDots">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                  </button>
                  {menuOpenId === order.id && (
                    <div className="dropdown-menu">
                      <button onClick={() => repeatOrder(order.id)}>
                        {t('myOrders.repeatOrder')}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="order-divider"></div>

              <div className="order-summary">
                <div className="order-status" data-status={order.status.toLowerCase()}>
                  {t(order.status)}
                </div>
                <div className="order-payment">
                  <div className="payment-icon">
                    <PaymentSvg />
                  </div>
                  <span>{order.paymentMethod}</span>
                </div>
                <div className="order-delivery">
                  <div className="delivery-icon">
                    {order.deliveryMethod == 'Укр пошта' ? <IconUrkPost /> : <DeliverySvg />}{' '}
                  </div>
                  <span>{order.deliveryMethod}</span>
                </div>
                <div className="order-amount">
                  {order.totalAmount.toFixed(2)} {t('myOrders.currency')}
                </div>
                <button className="details-button" onClick={() => toggleOrderDetails(order.id)}>
                  {expandedOrderId === order.id ? t('myOrders.collapse') : t('myOrders.details')}
                </button>
              </div>

              <div className="detailed-order-summary">
                <div className="detailed-order-summary__grid">
                  <div className="name__line">{t('myOrders.statusTitle')}</div>
                  <div className="order-status" data-status={order.status.toLowerCase()}>
                    {order.status}
                  </div>
                  <div className="name__line">{t('myOrders.paymentMethodTitle')}</div>
                  <div className="order-payment">
                    <div className="payment-icon">
                      <PaymentSvg />
                    </div>
                    <span>{order.paymentMethod}</span>
                  </div>
                  <div className="name__line">{t('myOrders.deliveryMethodTitle')}</div>
                  <div className="order-delivery">
                    <div className="delivery-icon">
                      {order.deliveryMethod == 'Укр пошта' ? <IconUrkPost /> : <DeliverySvg />}
                    </div>
                    <span>{order.deliveryMethod}</span>
                  </div>
                </div>
                <div className="order-divider"></div>
                <div className="order-amount">
                  {t('myOrders.total')}: {order.totalAmount.toFixed(2)} {t('myOrders.currency')}
                </div>
                <div className="order-divider"></div>
                <button className="details-button" onClick={() => toggleOrderDetails(order.id)}>
                  {expandedOrderId === order.id ? t('myOrders.collapse') : t('myOrders.details')}
                </button>
              </div>

              {expandedOrderId === order.id && (
                <div className="order-details">
                  <div className="order-items-header">
                    <div className="item-product">{t('myOrders.product')}</div>
                    <div className="item-quantity">{t('myOrders.quantity')}</div>
                    <div className="item-price">{t('myOrders.summary')}</div>
                  </div>

                  <div className="order-divider"></div>
                  {order.items.map((item) => (
                    <div key={item.id} className="order-item">
                      <div className="item-product">
                        <div className="item-image">
                          <Image
                            src={item.image}
                            width={100}
                            height={100}
                            alt={'selected product'}
                          />
                        </div>
                        <div className="item-info">
                          <div className="item-name">{item.name}</div>
                          <div className="item-code">
                            {t('myOrders.itemCode')}: {item.code}
                          </div>
                          <div className="item-styled">
                            <div className="item-quantity">
                              {item.quantity} {t('myOrders.unit')}
                            </div>
                            <div className="item-price">
                              <div className="current-price">
                                {item.price} {t('myOrders.currency')}
                              </div>
                              {item.discount > 0 && (
                                <div className="original-price">
                                  <div className="originalPrice">
                                    {item.originalPrice} {t('myOrders.currency')}
                                  </div>
                                  <div className="discount-badge">-{item.discount}%</div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="item-quantity">
                        {item.quantity} {t('myOrders.unit')}
                      </div>
                      <div className="item-price">
                        <div className="current-price">
                          {item.price} {t('myOrders.currency')}
                        </div>
                        {item.discount > 0 && (
                          <div className="original-price">
                            <div className="originalPrice">
                              {item.originalPrice} {t('myOrders.currency')}
                            </div>
                            <div className="discount-badge">-{item.discount}%</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="order-total">
                    <span>{t('myOrders.total')}:</span> {getTotalSum(order.items)}{' '}
                    {t('myOrders.currency')}.
                  </div>

                  <div className="order-footer">
                    <div className="footer-item">
                      <span className="footer-label">{t('myOrders.orderDate')}:</span>
                      <span className="footer-value">{order.date}</span>
                    </div>
                    <div className="footer-item">
                      <span className="footer-label">{t('myOrders.paymentMethodTitle')}:</span>
                      <span className="footer-value">{order.paymentMethod}</span>
                    </div>
                    <div className="footer-item">
                      <span className="footer-label">{t('myOrders.deliveryMethodTitle')}:</span>
                      <span className="footer-value">{order.deliveryMethod}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="orders-empty">
          <p>{t('myOrders.noOrders')}</p>
          <span>
            {t('myOrders.goTo')}{' '}
            <Link href={getLocalizedPath(`/${lang}/goods/1`, lang)}>{t('myOrders.catalog')}</Link>
          </span>
        </div>
      )}
      <TabNavigation lang={lang} />
    </div>
  );
};

export default OrdersPage;
