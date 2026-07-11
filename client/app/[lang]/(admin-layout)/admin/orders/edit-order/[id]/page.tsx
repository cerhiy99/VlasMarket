'use client';

import type React from 'react';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';

import '../../editOrder.scss';

import type { Locale } from '@/i18n.config';
import AdminHeader from '@/app/components/Admin/AdminHeader/AdminHeader';
import { $authHost, $host } from '@/app/http';
//import dynamic from 'next/dynamic';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { useRouter } from 'next/navigation';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';
import { PromokodFromDBInterface } from '../../../promokods/GetPromokods';
//const MyReactQuil = dynamic(() => import('../MyReactQuil'), { ssr: false });

type ProductOrder = {
  id: number;
  count: number;
  nameru: string;
  nameuk: string;
  volumes: {
    id: number;
    discount: number;
    isAvailability: string;
    nameVolume: string;
    volume: 2000;
    priceWithDiscount: number;
    price: number;
    art: string;
    url: string;
    imgs: [
      {
        createdAt: string;
        id: 30787;
        img: string;
        updatedAt: string;
        volumeId: 29659;
        volumeru: string;
        volumeuk: string;
      },
    ];
  };
};

interface OrderPageProps {
  params: Promise<{
    id: string;
    lang: Locale;
  }>;
}

const listOrders = [
  {
    id: 'wait',
    name: 'В ожидании',
  },
  {
    id: 'check',
    name: 'Проверка',
  },
  {
    id: 'pay',
    name: 'Оплата',
  },
  {
    id: 'nalozhen',
    name: 'Наложка',
  },
  {
    id: 'finish',
    name: 'Завершен',
  },
  {
    id: 'cansel',
    name: 'Отменен',
  },
];

const listWayDelivery = [
  {
    id: 1,
    name: 'Оплата на рахунок IBAN або на картку (Очікую дзвінок для уточнення деталей)',
    description: 'Очікую дзвінок для уточнення деталей',
  },
  {
    id: 2,
    name: 'Оплата на рахунок IBAN або на картку (Отримати SMS з реквізитами)',
    description: 'Отримати SMS з реквізитами',
  },
  {
    id: 3,
    name: 'Накладений платіж (з передоплатою) (Очікую дзвінок для підтвердження)',
    description: 'Очікую дзвінок для підтвердження',
  },
];

export default function EditOrderPage({ params }: OrderPageProps) {
  const { id, lang } = use(params);
  const { user } = useSelector((state: RootState) => state.user);
  useEffect(() => {}, [user]);

  const [articleInput, setArticleInput] = useState('');
  const [products, setProducts] = useState<ProductOrder[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const [formData, setFormData] = useState<{
    id: number;
    nameUser: string;
    email: string;
    sum: number;
    basket: string;
    status: 'wait' | 'check' | 'pay' | 'nalozhen' | 'finish' | 'cansel';
    isToMeneger: false;
    phone: string;
    comment: string;
    commentMeneger: string;
    counstBonus: number;
    deliveryType:
      | 'Укр пошта'
      | 'Нова пошта курєр'
      | 'Нова пошта поштомат'
      | 'Нова пошта відділення';
    typePay: '1' | '2' | '3';
    oblast: string;
    city: string;
    departmentOrPostomatOrAddress: string;
    userGetBonus: number;
    additionalInfo: string;
    promokodId: number | null;
    promokod: PromokodFromDBInterface | null;
    createdAt: '';
    updatedAt: '';
    userId: number | null;
    user: {} | null;
    procent: null | number;
  }>({
    id: 0,
    nameUser: '',
    email: '',
    basket: '',
    sum: 0,
    status: 'wait',
    isToMeneger: false,
    phone: '',
    comment: '',
    commentMeneger: '',
    counstBonus: 0,
    deliveryType: 'Укр пошта',
    typePay: '1',
    oblast: '',
    city: '',
    departmentOrPostomatOrAddress: '',
    userGetBonus: 0,
    additionalInfo: '',
    promokodId: null,
    promokod: null,
    createdAt: '',
    updatedAt: '',
    userId: null,
    user: null,
    procent: null,
  });

  const getOrder = async () => {
    try {
      const res = await $authHost.get(`order/getOrder/${id}`);
      const JsonBasket = res.data.basket;
      let formDataFromRes = res.data;

      const basket = JSON.parse(JsonBasket);

      setProducts(basket);
      setFormData({ ...formDataFromRes });
    } catch (err) {
      alert('Помилка отримання замовлення');
    }
  };

  function normalizeContactInfo(html: any) {
    const hasP = /<p[\s>]/.test(html);
    const hasSpan = /<span[\s>]/.test(html);

    if (hasP && hasSpan) {
      return html; // нічого не чіпаємо, все ок
    }

    // Вирізаємо зайві теги і обгортаємо
    const clean = html.replace(/<[^>]+>/g, '').trim();

    if (!clean) return ''; // якщо пусто — не зберігаємо

    return `<p><span>${clean.replace(/\n/g, '<br>')}</span></p>`;
  }

  const router = useRouter();

  const del = async () => {
    const isConfirm = confirm('Ви впевнені, що хочете видалити замовлення?');

    if (!isConfirm) return;

    try {
      const res = await $authHost.delete(`order/del/${id}`);
      alert('Замовлення видалено');
      router.push(getLocalizedPath(`/${lang}/admin/orders`, lang));
    } catch (err) {
      alert('Помилка');
    }
  };

  const setOrder = async () => {
    try {
      const { id, sum, ...rest } = formData;

      const updatedOrder = {
        ...rest,
        basket: JSON.stringify(products), // або listOrders, залежно що зберігаєш
      };

      const res = await $authHost.post('order/updateOrder/' + id, updatedOrder);
    } catch (err) {
      alert('Помилка');
      console.log(err);
    }
  };

  // Simulate fetching order data
  useEffect(() => {
    // In a real app, you would fetch order data from an API
    const mockOrderData = {
      id: id,
      products: [
        {
          id: 1,
          name: 'Шампунь жіночий DALAS Aloe vera з гіалуроновою кислотою та натур.соком алое 1000 г',
          article: '12345',
          price: 2000,
          quantity: 1,
        },
      ],
      phone: '+380991234567',
      fullName: 'Зеленська Наталя Сергіївна',
      deliveryMethod: 'Нова пошта',
      city: 'Калинівка Київська обл',
      department: '1',
      comment: '',
      showBillingRecord: false,
      managerComment: '',
      managerApproved: true,
      managerBonus: 100,
      status: 'processing',
    };

    getOrder();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name == 'isToMeneger') {
      setFormData((prev) => ({ ...prev, procent: 3 }));
    }
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddProduct = async () => {
    try {
      if (products.some((x) => x.volumes.art == articleInput)) {
        alert('Цей товар вже добавлений');
        return;
      }
      const res = await $authHost.get(
        'order/getProductToOrder?url=' + articleInput
      );
      const newProduct = { ...res.data, count: 1 };
      setProducts([...products, newProduct]);
    } catch (err) {
      alert('Помилка');
    }
  };

  const handleRemoveProduct = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const handleQuantityChange = (id: number, count: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, count } : product
      )
    );
  };

  const calculateTotal = (price: number, quantity: number) => {
    return price * quantity;
  };

  const [checkedMinPrice, setCheckedMinPrice] = useState(false);
  const [checkedMissingProduct, setCheckedMissingProduct] = useState(false);
  useEffect(() => {
    const run = async () => {
      await calculateSum();
    };

    run();
  }, [products, formData.promokod, formData.counstBonus]);

  useEffect(() => {
    setCheckedMinPrice(false);
    setCheckedMissingProduct(false);
  }, [formData.promokodId, products]);

  const calculateSum = async () => {
    let sum = products.reduce(
      (acc, x) => acc + x.volumes.priceWithDiscount * x.count,
      0
    );

    let userGetBonus = 0;

    // ✅ бонуси
    if (formData.counstBonus > 0) {
      sum -= formData.counstBonus;
    }

    const promokod = formData.promokod;

    if (promokod) {
      // ===============================
      // 🔴 MIN PRICE CHECK
      // ===============================
      if (promokod.min_price && sum < promokod.min_price && !checkedMinPrice) {
        setCheckedMinPrice(true);

        const confirmKeep = window.confirm(
          `Сума менша за мінімальну згідно промокодом (${promokod.min_price} грн).

ОК — залишити промокод
Скасувати — видалити промокод`
        );

        if (!confirmKeep) {
          setFormData((prev) => ({
            ...prev,
            promokod: null,
            promokodId: null,
          }));
          return;
        }
      }

      // ===============================
      // 🔵 SIMPLE PROMO
      // ===============================
      if (promokod.type === 'procent') {
        sum -= (sum / 100) * (promokod.procent as any);
      } else if (promokod.type === 'price') {
        sum -= promokod.price_discount as any;
      }

      // ===============================
      // 🟣 SELECT GOODS PROMO
      // ===============================
      else {
        const artProduct = promokod.selectVolumeArt as string;

        const productForDiscount = products.find(
          (x) => x.volumes.art == artProduct
        );

        // ❌ товару нема
        if (!productForDiscount && !checkedMissingProduct) {
          setCheckedMissingProduct(true);

          const confirmAdd = window.confirm(
            `Товар для промокоду відсутній у замовленні.

ОК — повернути товар
Скасувати — видалити промокод`
          );

          if (confirmAdd) {
            try {
              const res = await $authHost.get(
                'order/getProductToOrder?url=' + artProduct
              );

              const newProduct = {
                ...res.data,
                count: 1,
              };

              setProducts((prev) => [...prev, newProduct]);
            } catch (err) {
              console.log(542434, err);
              alert('Помилка при додаванні товару');
            }
          } else {
            setFormData((prev) => ({
              ...prev,
              promokod: null,
              promokodId: null,
            }));
          }

          return;
        }

        // ✅ якщо товар є
        if (productForDiscount) {
          const price = productForDiscount.volumes.priceWithDiscount;
          if (promokod.type === 'select_goods_free') {
            sum -= price;
          } else if (promokod.type === 'select_goods_discount_procent') {
            sum -= (price / 100) * (promokod.procent as any);
          } else if (promokod.type === 'select_goods_discount_sum') {
            sum -= promokod.price_discount as any;
          }
        }
      }
    }

    if (formData.userId) {
      userGetBonus = products.reduce(
        (acc, x) =>
          (acc += Math.floor(x.volumes.priceWithDiscount / 100) * x.count),
        0
      );
    }

    // ===============================
    // ✅ SET SUM (safe)
    // ===============================
    setFormData((prev) => ({
      ...prev,
      sum,
      userGetBonus,
    }));
  };

  const renderMobileProductList = () => {
    if (products.length === 0) {
      return (
        <div className="mobile-empty-message">Позиции заказа не найдены.</div>
      );
    }

    return products.map((product) => (
      <div className="mobile-product-card" key={product.id}>
        <div className="mobile-product-header">
          <Link href={'#'} className="productLink">
            {`Обєм ${product.volumes.volume + product.volumes.nameVolume}` +
              ' ' +
              product.nameru}
          </Link>
          <button
            className="removeBtn"
            onClick={() => handleRemoveProduct(product.id)}
          >
            x
          </button>
        </div>
        <div className="mobile-product-details">
          <div className="mobile-product-info">
            <span className="mobile-label">Статья:</span>
            <span>{product.volumes.art}</span>
          </div>
          <div className="mobile-product-info">
            <span className="mobile-label">Цена:</span>
            <span>{product.volumes.priceWithDiscount} грн</span>
          </div>
          <div className="mobile-product-info">
            <span className="mobile-label">Кол-во:</span>
            <div className="mobile-quantity-input">
              <input
                type="number"
                min="1"
                value={product.count}
                onChange={(e) =>
                  handleQuantityChange(
                    product.id,
                    Number.parseInt(e.target.value) || 1
                  )
                }
              />
            </div>
          </div>
          <div className="mobile-product-info">
            <span className="mobile-label">Вместе:</span>
            <span className="mobile-total">
              {calculateTotal(product.volumes.priceWithDiscount, product.count)}{' '}
              грн
            </span>
          </div>
        </div>
      </div>
    ));
  };

  const updateFormData = (
    e:
      | React.ChangeEvent<HTMLInputElement, HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  console.log(534324, products, formData);

  return (
    <>
      <AdminHeader url="new-order" name="Редагування замовлення" lang={lang} />
      <div className="container">
        <div className="content">
          <h3 dangerouslySetInnerHTML={{ __html: formData.additionalInfo }} />
          {formData.counstBonus > 0 && (
            <h4>
              Користувач використав {formData.counstBonus}, воно враховується в
              суму.
            </h4>
          )}
          {formData.promokod !== null && (
            <h4>
              Користувач використвач промокод {formData.promokod.code}, він
              враховується в суму
            </h4>
          )}
          {isMobile ? (
            <div className="mobile-products-container">
              {renderMobileProductList()}
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Удалить</th>
                  <th>Название товара</th>
                  <th>Артикул</th>
                  <th>Цена</th>
                  <th>Кол-во</th>
                  <th>Вместе</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="emptyMessage">
                      Позиции заказа не найдены.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td className="centered">
                        <button
                          className="removeBtn"
                          onClick={() => handleRemoveProduct(product.id)}
                        >
                          x
                        </button>
                      </td>
                      <td>
                        <Link
                          href={`/${lang}/${product.volumes.url}`}
                          className="productLink"
                        >
                          {product.nameru}
                        </Link>
                      </td>
                      <td>{product.volumes.art}</td>
                      <td>{product.volumes.priceWithDiscount} грн</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={product.count}
                          onChange={(e) =>
                            handleQuantityChange(
                              product.id,
                              Number.parseInt(e.target.value) || 1
                            )
                          }
                        />
                      </td>
                      <td>
                        {calculateTotal(
                          product.volumes.priceWithDiscount,
                          product.count
                        )}{' '}
                        грн
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '7.5px',
              alignItems: 'center',
            }}
            className="row"
          >
            <p>Сума:</p>

            <span style={{ color: '#666' }}>{formData.sum}</span>
            {formData.userId !== null && (
              <>
                <p>Користувач отримає бонусів:</p>

                <span style={{ color: '#666' }}>{formData.userGetBonus}</span>
              </>
            )}
          </div>
          <div className="articleInput">
            <label className="label">артикул товара</label>
            <input
              type="text"
              value={articleInput}
              onChange={(e) => setArticleInput(e.target.value)}
              placeholder="Введіть артикул на товар"
            />
            <div className="description">
              Введите посилання товара, чтобы добавить его к заказу.
            </div>
            <div className="buttons">
              <button className="buttons__addBtn" onClick={handleAddProduct}>
                Добавить товар
              </button>
              <button
                className="buttons__cancelBtn"
                onClick={() => setArticleInput('')}
              >
                Отменить
              </button>
            </div>
          </div>

          <div className="section">
            <div className="sectionHeader">Информация о доставке</div>
            <div className="sectionContent">
              <div className="formGroup">
                <h3
                  style={{ margin: 0, marginBottom: '15px' }}
                  className="label"
                >
                  Контактная информация
                </h3>
                <div
                  className="contact-item"
                  style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '7.5px',
                  }}
                >
                  <label>імя</label>
                  <input
                    type="text"
                    name="nameUser"
                    value={formData.nameUser}
                    onChange={updateFormData}
                  />
                </div>
                <div
                  className="contact-item"
                  style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '7.5px',
                  }}
                >
                  <label>email</label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    onChange={updateFormData}
                  />
                </div>
                <div
                  className="contact-item"
                  style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '7.5px',
                  }}
                >
                  <label>телефон</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={updateFormData}
                  />
                </div>
                <div
                  className="contact-item"
                  style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '7.5px',
                  }}
                >
                  <label>Коментар користувача</label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={updateFormData}
                  />
                </div>
                <div
                  className="contact-item"
                  style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '7.5px',
                  }}
                >
                  <label>Тип оплати</label>
                  <select
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        typePay: e.target.value as any,
                      })
                    }
                  >
                    {listWayDelivery.map((x) => (
                      <option value={x.id} key={x.id}>
                        {x.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  className="contact-item"
                  style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '7.5px',
                  }}
                >
                  <label>Тип доставки</label>
                  <select
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        deliveryType: e.target.value as any,
                      })
                    }
                  >
                    {[
                      'Укр пошта',
                      'Нова пошта курєр',
                      'Нова пошта поштомат',
                      'Нова пошта відділення',
                    ].map((x) => (
                      <option value={x} key={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </div>
                <div
                  className="contact-item"
                  style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '7.5px',
                  }}
                >
                  <label>Область</label>
                  <input
                    type="text"
                    name="oblast"
                    value={formData.oblast}
                    onChange={updateFormData}
                  />
                </div>
                <div
                  className="contact-item"
                  style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '7.5px',
                  }}
                >
                  <label>Населений пункт</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={updateFormData}
                  />
                </div>
                <div
                  className="contact-item"
                  style={{
                    marginBottom: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '7.5px',
                  }}
                >
                  <label>Відділення або адреса</label>
                  <input
                    type="text"
                    name="departmentOrPostomatOrAddress"
                    value={formData.departmentOrPostomatOrAddress}
                    onChange={updateFormData}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="section managerSection">
            <div className="sectionHeader">Комментарий менеджера</div>
            <div className="sectionContent">
              <div className="formGroup">
                <label className="label">Комментарий</label>
                <textarea
                  name="commentMeneger"
                  value={formData.commentMeneger}
                  onChange={handleInputChange}
                />
              </div>
              {user?.adminAccess && user.adminAccess == 'owner' && (
                <div
                  style={{ flexWrap: 'wrap' }}
                  className="formGroup managerCheckbox"
                >
                  <label htmlFor="isToMeneger">Менеджер</label>
                  <input
                    type="checkbox"
                    id="managerApproved"
                    name="isToMeneger"
                    checked={formData.isToMeneger}
                    onChange={handleCheckboxChange}
                  />
                  {formData.isToMeneger && (
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center',
                      }}
                    >
                      <label htmlFor="procent">Процент менеджера</label>
                      <input
                        type="number"
                        value={Number(formData.procent) || 0}
                        name="procent"
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="section">
            <div className="sectionHeader">Состояние заказа</div>
            <div className="sectionContent">
              <div className="formGroup">
                <label className="label">Статус</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  {listOrders.map((x) => (
                    <option value={x.id} key={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'right',
              gap: '20px',
            }}
            className="button-save"
          >
            <button
              style={{
                padding: '5px 10px',
                border: '1px solid orange',
                borderRadius: '7px',
                cursor: 'pointer',
                background: 'red',
                color: '#fff',
              }}
              onClick={del}
            >
              Удалить
            </button>
            <button
              style={{
                padding: '5px 10px',
                border: '1px solid orange',
                borderRadius: '7px',
                cursor: 'pointer',
              }}
              onClick={setOrder}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
