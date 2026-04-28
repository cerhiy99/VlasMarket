'use client';
import React, { useState } from 'react';
import './AddPromokods.scss';
import { $authHost } from '@/app/http';

type Props = {};

export const typesPromokods = [
  { type: 'procent', description: 'Відсоток на знижку' },
  { type: 'price', description: 'Знижка у вигляді грошей' },
  { type: 'select_goods_free', description: 'конкретний товар у подарунок' },
  {
    type: 'select_goods_discount_sum',
    description: 'Знижка в грн на конкретний товар',
  },
  {
    type: 'select_goods_discount_procent',
    description: 'Відсоток знижки на конкретний товар',
  },
];

const AddPromokods = (props: Props) => {
  const numericFields = [
    'procent',
    'min_price',
    'countPromokods',
    'price_discount',
  ];
  const [promokod, setPromokod] = useState<{
    code: string;
    nameuk: string;
    nameru: string;
    descriptionuk: string;
    descriptionru: string;
    type:
      | 'procent'
      | 'price'
      | 'select_goods_free'
      | 'select_goods_discount_sum'
      | 'select_goods_discount_procent'
      | '';
    procent: null;
    min_price: null;
    countPromokods: 0;
    selectVolumeArt: null | string;
    img: null | File;
    price_discount: null | number;
  }>({
    code: '',
    nameuk: '',
    nameru: '',
    descriptionuk: '',
    descriptionru: '',
    type: '',
    procent: null,
    min_price: null,
    countPromokods: 0,
    selectVolumeArt: null,
    img: null,
    price_discount: null,
  });
  const sumbit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      // Перевірка на наявність обов'язкового файлу перед відправкою
      if (!promokod.img) {
        alert('Будь ласка, завантажте картинку');
        return;
      }

      const formData = new FormData();

      // Використовуємо Object.entries для безпечного перебору
      Object.entries(promokod).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          // Якщо значення null, ми або не додаємо його, або додаємо 0 для числових полів
          if (numericFields.includes(key)) {
            formData.append(key, '0');
          }
        } else if (key === 'img') {
          // Додаємо файл як є
          formData.append(key, value as File);
        } else {
          // Для всього іншого (рядки та числа) перетворюємо на рядок
          formData.append(key, value.toString());
        }
      });

      const res = await $authHost.post('promokods/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Axios зазвичай ставить це сам, але для наочності
        },
      });

      if (res.status === 200 || res.status === 201) {
        alert('Промокод успішно додано!');
        // Тут можна додати логіку очищення форми або редіректу
      }
    } catch (err) {
      console.error('Помилка при додаванні промокоду:', err);
      alert('Сталася помилка при збереженні.');
    }
  };

  const setData = (
    e:
      | React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>
      | React.ChangeEvent<HTMLInputElement, HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement, HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    // Список полів, які мають бути числами

    setPromokod({
      ...promokod,
      [name]: numericFields.includes(name)
        ? value === ''
          ? ''
          : Number(value)
        : value,
    });
  };
  return (
    <div className="add-promokod">
      <form onSubmit={sumbit}>
        <h1>Добавити сертифікат</h1>
        <div className="value">
          <label>Тип сертифікату</label>
          <select required name="type" onChange={setData} value={promokod.type}>
            <option value={''}>Виберіть тип сертифікату</option>
            <option value={'procent'}>Відсоток на знижку</option>
            <option value={'price'}>Знижка у вигляді грошей</option>
            <option value={'select_goods_free'}>
              конкретний товар у подарунок
            </option>
            <option value={'select_goods_discount_sum'}>
              Знижка в грн на конкретний товар
            </option>
            <option value={'select_goods_discount_procent'}>
              Відсоток знижки на конкретний товар
            </option>
          </select>
        </div>
        <div className="value">
          <label>Код</label>
          <input
            type="text"
            value={promokod.code}
            name="code"
            onChange={setData}
            required
          />
        </div>
        <div className="value">
          <label>Картинка</label>
          <input
            type="file"
            //value={promokod.img}
            name="img"
            onChange={(e) => {
              if (e.target.files?.length && e.target.files?.length > 0)
                setPromokod({ ...promokod, img: e.target.files[0] || null });
            }}
            required
          />
        </div>
        <div className="value">
          <label>назва українською</label>
          <input
            type="text"
            value={promokod.nameuk}
            name="nameuk"
            onChange={setData}
            required
          />
        </div>
        <div className="value">
          <label>назва російською</label>
          <input
            type="text"
            value={promokod.nameru}
            name="nameru"
            onChange={setData}
            required
          />
        </div>
        <div className="value">
          <label>опис українською</label>
          <textarea
            value={promokod.descriptionuk}
            name="descriptionuk"
            onChange={setData}
            required
          />
        </div>
        <div className="value">
          <label>опис російською</label>
          <textarea
            value={promokod.descriptionru}
            name="descriptionru"
            onChange={setData}
            required
          />
        </div>
        <div className="value">
          <label>Кількість промокодів</label>
          <input
            type="text"
            value={Number(promokod.countPromokods)}
            name="countPromokods"
            onChange={setData}
            required
          />
        </div>
        {promokod.type.startsWith('select_goods') && (
          <div className="value">
            <label>Артикул на товар</label>
            <input
              type="text"
              value={promokod.selectVolumeArt || ''}
              name="selectVolumeArt"
              onChange={setData}
              required
            />
          </div>
        )}
        {(promokod.type == 'select_goods_discount_procent' ||
          promokod.type == 'procent') && (
          <div className="value">
            <label>Відсоток знижки</label>
            <input
              value={Number(promokod.procent)}
              name="procent"
              onChange={setData}
              required
            />
          </div>
        )}
        <div className="value">
          <label>Мінімальна ціна для знижку в грн</label>
          <input
            value={Number(promokod.min_price)}
            name="min_price"
            onChange={setData}
            required
          />
        </div>

        {promokod.type == 'price' ||
          (promokod.type == 'select_goods_discount_sum' && (
            <div className="value">
              <label>Знижка в грн</label>
              <input
                value={Number(promokod.price_discount)}
                name="price_discount"
                onChange={setData}
                required
              />
            </div>
          ))}
        <button>Додати</button>
      </form>
    </div>
  );
};

export default AddPromokods;
