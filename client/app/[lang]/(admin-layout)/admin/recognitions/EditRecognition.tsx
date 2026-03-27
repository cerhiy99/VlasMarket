'use client';

import React, { useState, useEffect } from 'react';
import { $authHost } from '@/app/http';
import { Button, Alert } from '@mui/material';
import './EditRecognition.scss'; // This will be handled by the single-file approach
import { CategoryInterface } from '@/app/interfaces/Category';

const EditRecognition = () => {
  const [recognitions, setRecognitions] = useState<any>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [nameuk, setnameuk] = useState<string>('');
  const [nameRU, setNameRU] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [categoryId, setCategoryId] = useState<string | ''>('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const res = await $authHost.get('category/get');
        if (res.status === 200) {
          setCategories(res.data.res);
        } else {
          setError('Помилка завантаження категорій.');
        }
      } catch (err) {
        setError('Помилка сервера при завантаженні категорій.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch all recognitions on component mount
  const fetchRecognitions = async () => {
    try {
      const res = await $authHost.get(
        'goods/getRecognitionForCategory?categoryId=' + categoryId,
      );
      if (res.status === 200) {
        setRecognitions(res.data);
        if (res.data.length > 0) {
          // Automatically select the first item
          setSelectedId(res.data[0].id);
        }
      } else {
        setError('Не вдалося завантажити список призначень.');
      }
    } catch (err) {
      console.error(err);
      setError('Помилка при отриманні даних.');
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchRecognitions();
    }
  }, [categoryId]);

  // Effect to update input fields when a new recognition is selected
  useEffect(() => {
    const selected = recognitions.find((rec: any) => rec.id === selectedId);
    if (selected) {
      setnameuk(selected.nameuk);
      setNameRU(selected.nameru);
    }
  }, [selectedId, recognitions]);

  const editRecognition = async () => {
    if (!nameuk || !nameRU || !selectedId) {
      setError('Всі поля повинні бути заповнені.');
      setSuccess(null);
      return;
    }

    try {
      const res = await $authHost.post(`goods/editRecognition`, {
        id: selectedId,
        nameuk: nameuk,
        nameru: nameRU,
        categoryId,
      });

      if (res.status === 200) {
        setSuccess('Призначення успішно оновлено.');
        setError(null);
        // Refresh the list to reflect the changes
        await fetchRecognitions();
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

  const setSelected = (id: string) => {
    setSelectedId(id);
    const selectRecor = recognitions.find((x: any) => x.id == id);
    setnameuk(selectRecor.nameuk);
    setNameRU(selectRecor.nameru);
  };

  return (
    <div className="edit-recognition">
      <h1>Редагувати призначення</h1>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {isLoading ? (
        <p>Завантаження...</p>
      ) : (
        <>
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
          <div className="select-container">
            <label htmlFor="recognition-select">Вибрати призначення:</label>
            <select
              id="recognition-select"
              value={selectedId}
              onChange={(e) => {
                setSelected(e.target.value);
              }}
            >
              {recognitions.map((rec: any) => (
                <option key={rec.id} value={rec.id}>
                  {rec.nameuk}
                </option>
              ))}
            </select>
          </div>

          <div className="text-with-input">
            <label htmlFor="nameuk">Назва українською</label>
            <input
              id="nameuk"
              type="text"
              value={nameuk}
              onChange={(e) => setnameuk(e.target.value)}
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

          <Button variant="contained" color="primary" onClick={editRecognition}>
            Зберегти
          </Button>
        </>
      )}
    </div>
  );
};

export default EditRecognition;
