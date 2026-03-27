'use client';
import React, { useEffect, useState } from 'react';
import { Button, Alert } from '@mui/material';
import './EditSlide.scss'; // Перейменований CSS файл
import { $authHost } from '../../../../http';

// Тип для об'єкта слайда (замість банера) - ОНОВЛЕНО
type Slide = {
  id: number;
  href: string;
  sort: number;
  mobileImg_uk: string; // Назва файлу UK
  pcImg_uk: string; // Назва файлу UK
  mobileImg_ru: string; // Назва файлу RU
  pcImg_ru: string; // Назва файлу RU
};

type Props = {};

const EditSlide = (props: Props) => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [selectedSlideId, setSelectedSlideId] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState<Slide | null>(null);

  // Поля для редагування
  const [editHref, setEditHref] = useState<string>('');
  const [editSort, setEditSort] = useState<string>('');

  // НОВІ СТЕЙТИ для 4 файлів заміни
  const [newMobileImgUk, setNewMobileImgUk] = useState<File | null>(null);
  const [newPcImgUk, setNewPcImgUk] = useState<File | null>(null);
  const [newMobileImgRu, setNewMobileImgRu] = useState<File | null>(null);
  const [newPcImgRu, setNewPcImgRu] = useState<File | null>(null);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  // URL для зображень
  const SERVER_URL = process.env.NEXT_PUBLIC_SERVER;

  // 1. Отримання всіх слайдів
  const getSlides = async () => {
    try {
      const res = await $authHost.get('slides/get');
      // Припускаємо, що бекенд повертає об'єкти з 4-ма полями зображень
      setSlides(res.data.slides);
    } catch (err) {
      // Замінюємо alert() на Alert
      setStatusMessage('Помилка завантаження списку слайдів.');
      setIsError(true);
    }
  };

  useEffect(() => {
    getSlides();
    // Прибираємо window.alert
    const originalConfirm = window.confirm;
    window.confirm = (message) => {
      console.warn('Custom confirm replacement used:', message);
      return originalConfirm(message);
    };
    return () => {
      window.confirm = originalConfirm;
    };
  }, []);

  // 2. Обробка вибору слайда
  const handleSelectSlide = (id: number) => {
    setSelectedSlideId(id);
    const slide = slides.find((b) => b.id === id);
    setCurrentSlide(slide || null);

    // Заповнюємо поля для редагування
    if (slide) {
      setEditHref(slide.href || '');
      setEditSort(String(slide.sort));

      // Скидаємо поля завантаження файлів при виборі нового слайда
      setNewMobileImgUk(null);
      setNewPcImgUk(null);
      setNewMobileImgRu(null);
      setNewPcImgRu(null);

      setStatusMessage(null);
      setIsError(false);
    }
  };

  // 3. Відправка змін (Оновлення)
  const updateSlide = async () => {
    if (!currentSlide) return;

    try {
      const formData = new FormData();
      formData.append('id', String(currentSlide.id));
      formData.append('href', editHref);
      formData.append('sort', editSort);

      // Додаємо всі 4 потенційні файли заміни
      if (newMobileImgUk) formData.append('mobileImg_uk', newMobileImgUk);
      if (newPcImgUk) formData.append('pcImg_uk', newPcImgUk);
      if (newMobileImgRu) formData.append('mobileImg_ru', newMobileImgRu);
      if (newPcImgRu) formData.append('pcImg_ru', newPcImgRu);

      // Змінено baners/update на slides/update
      const res = await $authHost.put(`slides/update`, formData);

      if (res.status === 200) {
        setStatusMessage('Slide успішно оновлено!');
        setIsError(false);
        getSlides(); // Оновлюємо список слайдів, щоб отримати нові імена файлів

        // Скидаємо поля завантаження
        setNewMobileImgUk(null);
        setNewPcImgUk(null);
        setNewMobileImgRu(null);
        setNewPcImgRu(null);
      } else {
        setStatusMessage('Помилка оновлення слайда.');
        setIsError(true);
      }
    } catch (err: any) {
      setStatusMessage(
        err.response?.data?.message || 'Помилка підключення до сервера.',
      );
      setIsError(true);
    }
  };

  // 4. Функція видалення слайда
  const deleteSlide = async () => {
    if (!currentSlide) return;

    // Підтвердження видалення (тимчасово залишаємо window.confirm, але бажано замінити на кастомну модалку)
    if (
      !window.confirm(
        `Ви впевнені, що хочете видалити слайд ID: ${currentSlide.id}?`,
      )
    ) {
      return;
    }

    try {
      const res = await $authHost.delete(`slides/delete?id=${currentSlide.id}`);

      if (res.status === 200) {
        // Очищаємо форму редагування
        setCurrentSlide(null);
        setSelectedSlideId(null);
        getSlides(); // Оновлюємо список слайдів

        setStatusMessage('Slide успішно видалено!');
        setIsError(false);
      } else {
        setStatusMessage('Помилка видалення слайда.');
        setIsError(true);
      }
    } catch (err: any) {
      setStatusMessage(
        err.response?.data?.message || 'Помилка підключення до сервера.',
      );
      setIsError(true);
    }
  };

  // Допоміжна функція для відображення прев'ю в списку
  const getPreviewImage = (slide: Slide) => {
    // Якщо мобільний пристрій, показуємо мобільну картинку (UK за замовчуванням), інакше ПК
    return SERVER_URL + slide.pcImg_uk;
  };

  return (
    <div className="edit-slide-main-container">
      <h1>Редагувати слайд</h1>
      {/* КРОК 1: Вибір слайда */}
      <div className="slide-selection">
        <h2>Оберіть слайд для редагування:</h2>
        <div className="slide-list">
          {slides.map((x: Slide) => (
            <div
              key={x.id}
              className={`slide-item ${selectedSlideId === x.id ? 'selected' : ''}`}
              onClick={() => handleSelectSlide(x.id)}
            >
              <img
                width={120}
                height={80}
                src={getPreviewImage(x)}
                alt={`Slide ${x.id}`}
              />
              <p>
                ID: {x.id}, Sort: {x.sort}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* КРОК 2: Форма редагування */}
      {currentSlide && (
        <div className="slide-edit-form">
          <h2>Редагування слайда #{currentSlide.id}</h2>
          {statusMessage && (
            <Alert severity={isError ? 'error' : 'success'}>
              {statusMessage}
            </Alert>
          )}

          {/* Href та Sort */}
          <div className="input-group">
            <label htmlFor="editHref">
              Посилання (до прикладу: /goods/...)
            </label>
            <input
              id="editHref"
              type="text"
              value={editHref}
              onChange={(e) => setEditHref(e.target.value)}
              placeholder="/goods/..."
            />
          </div>

          <div className="input-group">
            <label htmlFor="editSort">
              Сортування (Чим менший, тим швидше відображається)
            </label>
            <input
              id="editSort"
              type="number"
              value={editSort}
              onChange={(e) => setEditSort(e.target.value)}
              placeholder="Наприклад: 1"
            />
          </div>

          {/* РОЗДІЛ: УКРАЇНСЬКА ВЕРСІЯ */}
          <h3 className="lang-section-title">Українська версія</h3>

          {/* Mobile Image UK (Заміна) */}
          <div className="input-group">
            <label>Поточне моб. зображення UK (14/9):</label>
            <img
              src={SERVER_URL + currentSlide.mobileImg_uk}
              alt="Поточний мобільний слайд UK"
              className="current-image"
            />
            <label>Замінити мобільне зображення UK</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) =>
                setNewMobileImgUk(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>

          {/* PC Image UK (Заміна) */}
          <div className="input-group">
            <label>Поточне PC зображення UK (9/3):</label>
            <img
              src={SERVER_URL + currentSlide.pcImg_uk}
              alt="Поточний PC слайд UK"
              className="current-image"
            />
            <label>Замінити PC зображення UK</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) =>
                setNewPcImgUk(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>

          {/* РОЗДІЛ: РОСІЙСЬКА ВЕРСІЯ */}
          <h3 className="lang-section-title">🇷Російська версія</h3>

          {/* Mobile Image RU (Заміна) */}
          <div className="input-group">
            <label>Поточне моб. зображення RU (14/9):</label>
            <img
              src={SERVER_URL + currentSlide.mobileImg_ru}
              alt="Поточний мобільний слайд RU"
              className="current-image"
            />
            <label>Замінити мобільне зображення RU</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) =>
                setNewMobileImgRu(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>

          {/* PC Image RU (Заміна) */}
          <div className="input-group">
            <label>Поточне PC зображення RU (9/3):</label>
            <img
              src={SERVER_URL + currentSlide.pcImg_ru}
              alt="Поточний PC слайд RU"
              className="current-image"
            />
            <label>Замінити PC зображення RU</label>
            <input
              type="file"
              accept="image/jpeg,image/png"
              onChange={(e) =>
                setNewPcImgRu(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>

          {/* КНОПКИ ДІЙ */}
          <div className="action-buttons">
            <Button variant="contained" color="primary" onClick={updateSlide}>
              Зберегти зміни
            </Button>

            <Button variant="contained" color="error" onClick={deleteSlide}>
              Видалити слайд
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditSlide;
