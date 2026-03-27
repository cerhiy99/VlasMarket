'use client';
import type React from 'react';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';

import '../editOrder.scss';

import type { Locale } from '@/i18n.config';
import AdminHeader from '@/app/components/Admin/AdminHeader/AdminHeader';
import { $authHost } from '@/app/http';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { notFound } from 'next/navigation';

type ProductOrder = {
  id: number;
  count: number;
  nameru: string;
  nameuk: string;
  volumes: [
    {
      id: number;
      discount: number;
      isAvailability: string;
      nameVolume: string;
      volume: 2000;
      priceWithDiscount: number;
      price: number;
      art: string;
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
    },
  ];
};

interface OrderPageProps {
  params: Promise<{
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

export default function EditOrderPage({ params }: OrderPageProps) {
  const { lang } = use(params);
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

  const [formData, setFormData] = useState({
    nameUser: '',
    email: '',
    contactInfo: parseContactInfo(`
<p>Телефон:</p>
<span></span>
<p>Ф.И.О.:</p>
<span></span>
<p>Вариант доставки:</p>
<span></span>
<p>Населений пункт:</p>
<span></span>
<p>відділення Нової Пошти:</p>
<span></span>
<p>тип оплати:</p>
<span></span>
<p>Комментарий:</p>
<span></span>  
`),
    sum: 0,
    status: '',
    isToMeneger: false,
    procent: 0,
    phone: '',
    deliveryType: '',
    city: '',
    comment: '',
    commentMeneger: '',
    oblast: '',
    typePay: '',
  });
  const [contactFields, setContactFields] = useState(
    parseContactInfo(`
    <p>Телефон:</p>
    <span></span>
    <p>Ф.И.О.:</p>
    <span></span>
    <p>Тип доставки:</p>
    <span></span>
    <p>Населений пункт:</p>
    <span></span>
    <p>Отделения или адрес доставки:</p>
    <span></span>
    <p>тип оплати:</p>
    <span></span>
    <p>Комментарий:</p>
    <span></span>  
    `)
  );

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

  const setOrder = async () => {
    try {
      const updateContactInfo = buildContactInfo(formData.contactInfo);
      const { contactInfo, sum, ...rest } = formData;

      const updatedOrder = {
        ...rest,
        contactInfo: updateContactInfo,
        basket: JSON.stringify(products), // або listOrders, залежно що зберігаєш
        sum: products.reduce((sum, x) => sum + x.volumes[0].priceWithDiscount * x.count, 0),
      };
      //console.log(4234, updatedOrder)
      const res = await $authHost.post('order/adminCreate', updatedOrder);
      alert('Замовлення створено');
    } catch (err) {
      alert('Помилка');
      console.log(err);
    }
  };

  // Simulate fetching order data
  useEffect(() => {
    // In a real app, you would fetch order data from an API
    const mockOrderData = {
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

    setProducts([]);
    /* setFormData({
      phone: '',
      fullName: '',
      deliveryMethod: '',
      city: '',
      department: '',
      comment: '',
      showBillingRecord: '',
      managerComment: '',
      managerApproved: '',
      managerBonus: ,
      status: mockOrderData.status
    })*/
    //getOrder()
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const UpdateHandleInputChange = (newValue: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddProduct = async () => {
    if (!articleInput.trim()) return;
    try {
      const res = await $authHost.get('order/getProductToOrder?url=' + articleInput);
      setProducts([...products, res.data]);
    } catch (err) {
      alert('Помилка');
    }
    //    setProducts(prev => [...prev, newProduct])
    //  setArticleInput('')
  };

  const handleRemoveProduct = (id: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const handleQuantityChange = (id: number, count: number) => {
    setProducts((prev) =>
      prev.map((product) => (product.id === id ? { ...product, count } : product))
    );
  };

  const calculateTotal = (price: number, quantity: number) => {
    return price * quantity;
  };

  const renderMobileProductList = () => {
    if (products.length === 0) {
      return <div className="mobile-empty-message">Позиции заказа не найдены.</div>;
    }

    return products.map((product) => (
      <div className="mobile-product-card" key={product.id}>
        <div className="mobile-product-header">
          <Link href={'#'} className="productLink">
            {`Обєм ${product.volumes[0].volume + product.volumes[0].nameVolume}` +
              ' ' +
              product.nameru}
          </Link>
          <button className="removeBtn" onClick={() => handleRemoveProduct(product.id)}>
            x
          </button>
        </div>
        <div className="mobile-product-details">
          <div className="mobile-product-info">
            <span className="mobile-label">Статья:</span>
            <span>{product.volumes[0].art}</span>
          </div>
          <div className="mobile-product-info">
            <span className="mobile-label">Цена:</span>
            <span>{product.volumes[0].priceWithDiscount} грн</span>
          </div>
          <div className="mobile-product-info">
            <span className="mobile-label">Кол-во:</span>
            <div className="mobile-quantity-input">
              <input
                type="number"
                min="1"
                value={product.count}
                onChange={(e) =>
                  handleQuantityChange(product.id, Number.parseInt(e.target.value) || 1)
                }
              />
            </div>
          </div>
          <div className="mobile-product-info">
            <span className="mobile-label">Вместе:</span>
            <span className="mobile-total">
              {calculateTotal(product.volumes[0].priceWithDiscount, product.count)} грн
            </span>
          </div>
        </div>
      </div>
    ));
  };
  function parseContactInfo(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const result = [];

    const elements = Array.from(doc.body.children); // p, span, p, span...

    for (let i = 0; i < elements.length; i += 2) {
      const p: any = elements[i];
      const span: any = elements[i + 1];

      if (p && span && p.tagName === 'P' && span.tagName === 'SPAN') {
        result.push({
          title: p.textContent.trim().replace(/:$/, ''), // забираємо двокрапку
          value: span.textContent.trim(),
        });
      }
    }

    return result;
  }
  function buildContactInfo(items: any) {
    return items
      .map(({ title, value }: any) => `<p>${title}:</p>\n<span>${value}</span>`)
      .join('\n');
  }

  function handleChange(index: number, newValue: string) {
    const updated: any = [...contactFields];
    updated[index].value = newValue;
    setContactFields(updated);

    // також оновлюємо formData, якщо треба
    setFormData((prev) => ({
      ...prev,
      contactInfo: updated,
    }));
  }
  console.log(formData);

  return (
    <>
      <AdminHeader url="new-order" name="Редагування замовлення" lang={lang} />
      <div className="container">
        <div className="content">
          {isMobile ? (
            <div className="mobile-products-container">{renderMobileProductList()}</div>
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
                          href={`/${lang}/goods/${product.volumes[0].id}`}
                          className="productLink"
                        >
                          {product.nameru}
                        </Link>
                      </td>
                      <td>{product.volumes[0].art}</td>
                      <td>{product.volumes[0].priceWithDiscount} грн</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={product.count}
                          onChange={(e) =>
                            handleQuantityChange(product.id, Number.parseInt(e.target.value) || 1)
                          }
                        />
                      </td>
                      <td>
                        {calculateTotal(product.volumes[0].priceWithDiscount, product.count)} грн
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

            <span style={{ color: '#666' }}>
              {products.reduce((sum, x) => sum + x.volumes[0].priceWithDiscount * x.count, 0)}
            </span>
          </div>
          <div className="articleInput">
            <label className="label">Артикул на товар</label>
            <input
              type="text"
              value={articleInput}
              onChange={(e) => setArticleInput(e.target.value)}
              placeholder="Введіть артикул на товар"
            />
            <div className="description">Введите артикул товара, чтобы добавить его к заказу.</div>
            <div className="buttons">
              <button className="buttons__addBtn" onClick={handleAddProduct}>
                Добавить тоавр
              </button>
              <button className="buttons__cancelBtn" onClick={() => setArticleInput('')}>
                Отменить
              </button>
            </div>
          </div>

          <div className="section">
            <div className="sectionHeader">Информация о доставке</div>
            <div className="sectionContent">
              <div className="formGroup">
                <label className="label">Контактная информация</label>
                {contactFields.map((field: any, index) => (
                  <div
                    className="contact-item"
                    key={index}
                    style={{
                      marginBottom: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '7.5px',
                    }}
                  >
                    <label>{field.title}</label>
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => handleChange(index, e.target.value)}
                    />
                  </div>
                ))}
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
                <div className="formGroup managerCheckbox">
                  <label htmlFor="isToMeneger">Менеджер</label>
                  <input
                    type="checkbox"
                    id="managerApproved"
                    name="isToMeneger"
                    checked={formData.isToMeneger}
                    onChange={handleCheckboxChange}
                  />
                </div>
              )}

              <div className="formGroup managerBonus">
                <label className="label">Бонус менеджера</label>
                <input
                  type="number"
                  min={2}
                  max={3}
                  name="procent"
                  value={formData.procent}
                  onChange={handleInputChange}
                />
                <span> %.</span>
              </div>
            </div>
          </div>

          <div className="section">
            <div className="sectionHeader">Состояние заказа</div>
            <div className="sectionContent">
              <div className="formGroup">
                <label className="label">Статус</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
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
            }}
            className="button-save"
          >
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
