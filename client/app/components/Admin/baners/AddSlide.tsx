'use client';
import { $authHost } from '@/app/http';
import React, { useState, useRef } from 'react';
import { Button, Alert } from '@mui/material';
import './AddSlide.scss'; // Перейменований CSS файл

const AddSlide = () => {
  // Поля для контенту
  const [href, setHref] = useState<string>('');
  const [sort, setSort] = useState<string>('0');

  // Оновлені стейти для 4 файлів
  const [mobileImgUk, setMobileImgUk] = useState<File | null>(null);
  const [pcImgUk, setPcImgUk] = useState<File | null>(null);
  const [mobileImgRu, setMobileImgRu] = useState<File | null>(null);
  const [pcImgRu, setPcImgRu] = useState<File | null>(null);

  // Стейт для повідомлень
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Референси для очищення полів типу file
  const mobileImgUkRef = useRef<HTMLInputElement>(null);
  const pcImgUkRef = useRef<HTMLInputElement>(null);
  const mobileImgRuRef = useRef<HTMLInputElement>(null);
  const pcImgRuRef = useRef<HTMLInputElement>(null);

  const addSlide = async () => {
    // 1. Валідація: Тепер перевіряємо всі 4 файли
    if (!sort || !mobileImgUk || !pcImgUk || !mobileImgRu || !pcImgRu) {
      setError(
        'Всі 4 зображення (мобільні та для ПК, UK та RU) та поле "Сортування" є обов\'язковими.',
      );
      setSuccess(null);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('href', href);
      formData.append('sort', sort);

      // Додаємо 4 файли до FormData. Ключі відповідають очікуваним на бекенді.
      formData.append('mobileImg_uk', mobileImgUk as File);
      formData.append('pcImg_uk', pcImgUk as File);
      formData.append('mobileImg_ru', mobileImgRu as File);
      formData.append('pcImg_ru', pcImgRu as File);

      // Маршрут змінено для обходу AdBlock
      const res = await $authHost.post('slides/add', formData);

      if (res.status === 200) {
        setSuccess('Slide успішно доданий.');
        setError(null);

        // --- ОЧИЩЕННЯ ФОРМИ ПІСЛЯ УСПІХУ ---
        setHref('');
        setSort('0');
        setMobileImgUk(null);
        setPcImgUk(null);
        setMobileImgRu(null);
        setPcImgRu(null);

        // Скидання значень полів file через useRef
        if (mobileImgUkRef.current) mobileImgUkRef.current.value = '';
        if (pcImgUkRef.current) pcImgUkRef.current.value = '';
        if (mobileImgRuRef.current) mobileImgRuRef.current.value = '';
        if (pcImgRuRef.current) pcImgRuRef.current.value = '';
      } else {
        setError(
          'Неочікувана помилка при додаванні (Статус: ' + res.status + ').',
        );
      }
    } catch (err: any) {
      // Обробка помилок сервера
      const serverMessage = err.response?.data?.message;
      const displayError = serverMessage
        ? `Помилка сервера: ${serverMessage}`
        : 'Щось пішло не так під час запиту (перевірте консоль та бекенд).';

      setError(displayError);
      console.error('API Error:', err);
      setSuccess(null);
    }
  };

  // Функція для обробки вибору файлу, приймає відповідний сеттер
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>,
  ) => {
    setter(e.target.files ? e.target.files[0] : null);
  };

  const isButtonDisabled = !mobileImgUk || !pcImgUk || !mobileImgRu || !pcImgRu;

  return (
    <div className="add-slide-form">
      <h1>Додати новий слайд</h1>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {/* Поля контенту */}
      <div className="text-with-input">
        <label htmlFor="href">Посилання (до прикладу: /goods/...)</label>
        <input
          id="href"
          type="text"
          value={href}
          onChange={(e) => setHref(e.target.value)}
          placeholder="/goods/..."
        />
      </div>

      <div className="text-with-input">
        <label htmlFor="sort">
          Сортування (Чим він менший, тим він швидше відображається)
        </label>
        <input
          id="sort"
          type="number"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          placeholder="Наприклад: 1"
        />
      </div>

      {/* Секція UKR */}
      <h2 className="section-title">Зображення для УКРАЇНСЬКОЇ версії</h2>
      <div className="text-with-input">
        <label htmlFor="mobileImgUk">
          Мобільне зображення UK (З РОЗШИРЕННЯМ +/- 14/9), в avif
        </label>
        <input
          id="mobileImgUk"
          type="file"
          accept="image/jpeg,image/png"
          ref={mobileImgUkRef}
          onChange={(e) => handleFileChange(e, setMobileImgUk)}
        />
      </div>

      <div className="text-with-input">
        <label htmlFor="pcImgUk">
          Зображення для ПК UK (З РОЗШИРЕННЯМ +/- 9/3), в avif
        </label>
        <input
          id="pcImgUk"
          type="file"
          accept="image/jpeg,image/png"
          ref={pcImgUkRef}
          onChange={(e) => handleFileChange(e, setPcImgUk)}
        />
      </div>

      {/* Секція RUS */}
      <h2 className="section-title">Зображення для РОСІЙСЬКОЇ версії</h2>
      <div className="text-with-input">
        <label htmlFor="mobileImgRu">
          Мобільне зображення RU (З РОЗШИРЕННЯМ +/- 14/9), в avif
        </label>
        <input
          id="mobileImgRu"
          type="file"
          accept="image/jpeg,image/png"
          ref={mobileImgRuRef}
          onChange={(e) => handleFileChange(e, setMobileImgRu)}
        />
      </div>

      <div className="text-with-input">
        <label htmlFor="pcImgRu">
          Зображення для ПК RU (З РОЗШИРЕННЯМ +/- 9/3), в avif
        </label>
        <input
          id="pcImgRu"
          type="file"
          accept="image/jpeg,image/png"
          ref={pcImgRuRef}
          onChange={(e) => handleFileChange(e, setPcImgRu)}
        />
      </div>

      <Button
        variant="contained"
        color="primary"
        onClick={addSlide}
        disabled={isButtonDisabled} // Деактивуємо кнопку, якщо файли не вибрано
      >
        Додати слайд
      </Button>
    </div>
  );
};

export default AddSlide;
