// components/AddBlog.tsx
'use client';
import React, { useState, useEffect } from 'react';
import '../add/AddBlog.scss';
import CyrillicToTranslit from 'cyrillic-to-translit-js';
import { $authHost } from '@/app/http';
import MyJoditEditor from '@/app/components/utils/MyJoditReact';
import { useRouter } from 'next/navigation';
import { getLocalizedPath } from '@/app/components/utils/getLocalizedPath';
import { Locale } from '@/i18n.config';
//import TipTapEditor from '@/app/components/utils/TipTapEditor'
//import MyEditor from '@/app/components/utils/MyEditor'

// Виправлення помилки TypeScript:
// 'new' expression, whose target lacks a construct signature, implicitly has an 'any' type.
// Це відбувається, якщо у бібліотеки немає файлів типів.
// Найкращий спосіб - встановити @types, але якщо їх немає,
// потрібно ігнорувати цей рядок або оголосити тип вручну.
// Або ж просто ігноруємо наступний рядок
// @ts-ignore
const cyrillicToTranslit = new CyrillicToTranslit();

type Props = {
  url: string;
  lang: Locale;
};

const UpdateBlog = ({ url, lang }: Props) => {
  const [id, setId] = useState<number>();
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

  // Обробник для поля назви українською
  const handleNameUAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameUA(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Тут буде логіка відправки форми на сервер

    try {
      const formData = new FormData();
      formData.append('nameuk', nameUA);
      formData.append('nameru', nameRU);
      formData.append('descriptionuk', descriptionUA);
      formData.append('descriptionru', descriptionRU);
      if (image) formData.append('img', image);
      const res = await $authHost.post(`blog/update/${url}`, formData);
      if (res.status == 200) {
        router.push(getLocalizedPath(`/${lang}/blog/${url}`, lang));
      }
    } catch (err) {
      console.log('Помилка при оновлені блогу ' + err);
      alert('Помилка при оновлені блогу');
    }
  };

  const getBlog = async () => {
    try {
      const res = await $authHost.get(`blog/getOne/${url}`);
      const blog = res.data.blog;
      setId(blog.id);
      setNameRU(blog.nameru);
      setNameUA(blog.nameuk);
      setDescriptionUA(blog.descriptionuk);
      setDescriptionRU(blog.descriptionru);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBlog();
  }, []);
  const router = useRouter();
  const del = async () => {
    try {
      const isDel = confirm(
        'Ви справді хочете видалити цю статтю? (її не можна буде відновити)',
      );

      if (!isDel) return; // якщо натиснули "Скасувати", нічого не робимо

      // тут твій код видалення
      await $authHost.post(`blog/del/${id}`);
      alert('Статтю видалено');
      router.push(
        getLocalizedPath(`/${lang}/admin/blog/update/selectBlog`, lang),
      );
    } catch (err) {
      alert('Помилка при видаленні');
      console.error(err);
    }
  };

  return (
    <div className="add-blog-container">
      <h1 className="form-title">Оновити блог</h1>
      <form onSubmit={handleSubmit}>
        <div className="text-with-input">
          <div className="text-with-input">
            <label htmlFor="url">URL-адреса</label>
            <input id="url" type="text" value={url} />
          </div>
          <br />
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '5px',
            width: '100%',
            justifyContent: 'right',
          }}
        >
          <button
            style={{ backgroundColor: 'red' }}
            type="button"
            className="submit-button"
            onClick={del}
          >
            Видалити
          </button>
          <button type="submit" className="submit-button">
            Оновити
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBlog;
