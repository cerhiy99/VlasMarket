// components/AddBlog.tsx
'use client';
import React, { useState, useEffect } from 'react';
import './AddBlog.scss';
import CyrillicToTranslit from 'cyrillic-to-translit-js';
import { $authHost } from '@/app/http';
//import TipTapEditor from '@/app/components/utils/TipTapEditor'
//import MyEditor from '@/app/components/utils/MyEditor'
import MyJoditEditor from '@/app/components/utils/MyJoditReact';

// Виправлення помилки TypeScript:
// 'new' expression, whose target lacks a construct signature, implicitly has an 'any' type.
// Це відбувається, якщо у бібліотеки немає файлів типів.
// Найкращий спосіб - встановити @types, але якщо їх немає,
// потрібно ігнорувати цей рядок або оголосити тип вручну.
// Або ж просто ігноруємо наступний рядок
// @ts-ignore
const cyrillicToTranslit = new CyrillicToTranslit();

type Props = {};

const AddBlog = (props: Props) => {
  const [url, setUrl] = useState<string>('');
  const [nameUA, setNameUA] = useState<string>('');
  const [nameRU, setNameRU] = useState<string>('');
  const [descriptionUA, setDescriptionUA] = useState<string>('');
  const [descriptionRU, setDescriptionRU] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);

  const [isUrlManuallyEdited, setIsUrlManuallyEdited] =
    useState<boolean>(false);

  // Функція для створення URL-slug з транслітерацією
  const createSlug = (str: string): string => {
    // Транслітеруємо кирилицю на латиницю.
    const transliteratedStr = cyrillicToTranslit.transform(str, '-') as string;

    // Очищуємо рядок: переводимо в нижній регістр, видаляємо зайві символи та замінюємо пробіли на дефіси.
    return transliteratedStr
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/[\s-]+/g, '-');
  };

  // Хук useEffect, який автоматично генерує URL, коли змінюється назва українською
  useEffect(() => {
    // Якщо URL не редагувався вручну і назва українською не порожня
    if (!isUrlManuallyEdited && nameUA) {
      const newUrl = createSlug(nameUA);
      setUrl(newUrl);
    }
  }, [nameUA, isUrlManuallyEdited]);

  // Обробник для поля URL
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Якщо користувач почав вводити в URL, вимикаємо автоматичну генерацію
    if (!isUrlManuallyEdited) {
      setIsUrlManuallyEdited(true);
    }
    setUrl(e.target.value);
  };

  // Обробник для поля назви українською
  const handleNameUAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameUA(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Тут буде логіка відправки форми на сервер
    console.log({ url, nameUA, nameRU, descriptionUA, descriptionRU, image });
    try {
      const formData = new FormData();
      formData.append('url', url);
      formData.append('nameuk', nameUA);
      formData.append('nameru', nameRU);
      formData.append('descriptionuk', descriptionUA);
      formData.append('descriptionru', descriptionRU);
      if (image) formData.append('img', image);
      else {
        alert('Помилка добавлення блогу');
        return;
      }
      const res = await $authHost.post('blog/add', formData);
      if (res.status == 200) {
        alert('Успішно добавленно');
      }
    } catch (err) {
      console.log('Помилка при добавленні блогу ' + err);
      alert('Помилка при добавленні блогу');
    }
  };

  return (
    <div className="add-blog-container">
      <h1 className="form-title">Додати новий блог</h1>
      <form onSubmit={handleSubmit}>
        <div className="text-with-input">
          <label htmlFor="nameUA">Назва українською</label>
          <input
            id="nameUA"
            type="text"
            value={nameUA}
            onChange={handleNameUAChange}
          />
        </div>

        <div className="text-with-input">
          <label htmlFor="nameRU">Назва російською</label>
          <input
            id="nameRU"
            type="text"
            value={nameRU}
            onChange={(e) => setNameRU(e.target.value)}
          />
        </div>

        <div className="text-with-input">
          <label htmlFor="url">URL-адреса (автоматично генерується)</label>
          <input id="url" type="text" value={url} onChange={handleUrlChange} />
        </div>

        <div className="text-with-input">
          <label htmlFor="descriptionUA">Опис українською</label>
          <MyJoditEditor
            value={descriptionUA}
            placeholder=""
            name=""
            setValue={setDescriptionUA}
          />
        </div>

        <div className="text-with-input">
          <label htmlFor="descriptionRU">Опис російською</label>
          <MyJoditEditor
            value={descriptionRU}
            placeholder=""
            name=""
            setValue={setDescriptionRU}
          />
        </div>

        <div className="text-with-input">
          <label htmlFor="image">Зображення</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>

        <button type="submit" className="submit-button">
          Додати
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
