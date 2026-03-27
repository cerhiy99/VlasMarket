'use client';
import React, { useEffect, useState } from 'react';
import { $authHost } from '@/app/http';
import { Button, Alert } from '@mui/material';
import './Recognitions.scss';
import { CategoryInterface } from '@/app/interfaces/Category';

const AddRecognition = () => {
  const [nameUA, setNameUA] = useState<string>('');
  const [nameRU, setNameRU] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [categoryId, setCategoryId] = useState<string | ''>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await $authHost.get('category/get');
        if (res.status === 200) {
          setCategories(res.data.res);
        } else {
          setError('Помилка завантаження категорій.');
        }
      } catch (err) {
        setError('Помилка сервера при завантаженні категорій.');
      }
    };
    fetchCategories();
  }, []);

  const addRecognition = async () => {
    if (!nameUA || !nameRU) {
      setError('Всі поля повинні бути заповнені.');
      setSuccess(null);
      return;
    }

    try {
      const res = await $authHost.post('goods/addRecognition', {
        nameuk: nameUA,
        nameru: nameRU,
        categoryId,
      });

      if (res.status === 200) {
        setSuccess('Призначення успішно додано.');
        setError(null);
        setNameUA('');
        setNameRU('');
      } else {
        setError('Щось пішло не так.');
        setSuccess(null);
      }
    } catch (err) {
      console.error(err);
      setError('Помилка при збереженні.');
      setSuccess(null);
    }
  };

  return (
    <div className="add-recognition">
      <h1>Додати призначення</h1>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <div className="select-container">
        <label htmlFor="recognition-select">Вибрати Категорію:</label>
        <select
          id="recognition-select"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
          }}
        >
          {categories.map((rec: any) => (
            <option key={rec.id} value={rec.id}>
              {rec.nameuk}
            </option>
          ))}
        </select>
      </div>
      <div className="text-with-input">
        <label htmlFor="nameUA">Назва українською</label>
        <input
          id="nameUA"
          type="text"
          value={nameUA}
          onChange={(e) => setNameUA(e.target.value)}
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
      <Button variant="contained" color="primary" onClick={addRecognition}>
        Додати
      </Button>
    </div>
  );
};

export default AddRecognition;
