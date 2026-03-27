'use client';
import React, { useEffect, useState } from 'react';
import './Subcategory.scss';
import {
  Button,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { $authHost } from '@/app/http';
import { CategoryInterface } from '@/app/interfaces/Category';
import MyJoditEditor from '../../utils/MyJoditReact';

const UpdateSubcategory = () => {
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const [subcategories, setSubcategories] = useState<any[]>([]);

  const [categoryId, setCategoryId] = useState<string>('');

  const [selectedSubcategoryId, setSelectedSubcategoryId] =
    useState<string>('');

  const [nameua, setNameua] = useState<string>('');
  const [nameru, setNameru] = useState<string>('');
  const [descriptionuk, setDescriptionuk] = useState<string>('');
  const [descriptionru, setDescriptionru] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await $authHost.get('category/get');
        setCategories(res.data.res || []);
      } catch (err) {
        setError('Помилка при завантаженні категорій.');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (categoryId) {
      const fetchSubcategories = async () => {
        try {
          const res = await $authHost.get(
            `subcategory/get?categoryId=${categoryId}`,
          );
          console.log(4234, res);
          setSubcategories(res.data.res || []);
        } catch (err) {
          setError('Помилка при завантаженні підкатегорій.');
        }
      };

      fetchSubcategories();
    } else {
      setSubcategories([]);
      setSelectedSubcategoryId('');
    }
  }, [categoryId]);

  useEffect(() => {
    if (selectedSubcategoryId) {
      const selected = subcategories.find(
        (s) => s.id === +selectedSubcategoryId,
      );
      console.log(54545, selected);
      if (selected) {
        setNameua(selected.nameuk);
        setNameru(selected.nameru);
        setDescriptionuk(selected.descriptionuk);
        setDescriptionru(selected.descriptionru);
      }
    } else {
      setNameua('');
      setNameru('');
      setDescriptionuk('');
      setDescriptionru('');
    }
  }, [selectedSubcategoryId]);

  const updateSubcategory = async () => {
    if (!selectedSubcategoryId || !nameua || !nameru || !categoryId) {
      setError('Усі поля обовʼязкові.');
      setSuccess(null);
      return;
    }

    const formData = new FormData();
    formData.append('nameua', nameua);
    formData.append('nameru', nameru);
    formData.append('descriptionuk', descriptionuk);
    formData.append('descriptionru', descriptionru);
    formData.append('categoryId', categoryId);
    if (image) formData.append('image', image);

    try {
      await $authHost.put(
        `subcategory/update/${selectedSubcategoryId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      setSuccess('Підкатегорія успішно оновлена.');
      setError(null);
    } catch (err) {
      setError('Помилка при оновленні підкатегорії.');
      setSuccess(null);
    }
  };

  return (
    <div className="admin-category">
      <div className="add-category">
        <h1>Оновити підкатегорію</h1>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        {/* Категорія */}
        <div className="text-with-input">
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Категорія</InputLabel>
            <Select
              labelId="category-select-label"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={String(category.id)}>
                  {category.nameuk}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {/* Підкатегорія */}
        {categoryId && (
          <div className="text-with-input">
            <FormControl fullWidth>
              <InputLabel id="subcategory-select-label">
                Підкатегорія
              </InputLabel>
              <Select
                labelId="subcategory-select-label"
                value={selectedSubcategoryId}
                onChange={(e) => setSelectedSubcategoryId(e.target.value)}
              >
                {subcategories.map((sub) => (
                  <MenuItem key={sub.id} value={String(sub.id)}>
                    {sub.nameuk}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}

        {/* Назви */}
        {selectedSubcategoryId && (
          <>
            <div className="text-with-input">
              <label htmlFor="nameua">Назва українською</label>
              <input
                id="nameua"
                type="text"
                value={nameua}
                onChange={(e) => setNameua(e.target.value)}
              />
            </div>
            <div className="text-with-input">
              <label htmlFor="nameru">Назва російською</label>
              <input
                id="nameru"
                type="text"
                value={nameru}
                onChange={(e) => setNameru(e.target.value)}
              />
            </div>
            <div className="text-with-input">
              <label htmlFor="nameUA">Опис українською</label>
              <MyJoditEditor
                value={descriptionuk}
                setValue={setDescriptionuk}
                placeholder="Опис українською"
                name="Опис українською"
              />
            </div>

            <div className="text-with-input">
              <label htmlFor="nameRU">Опис російською</label>
              <MyJoditEditor
                placeholder="Опис російською"
                value={descriptionru}
                setValue={setDescriptionru}
                name="Опис російською"
              />
            </div>

            <div className="text-with-input">
              <label htmlFor="image">Оновити зображення (необовʼязково)</label>
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setImage(file);
                }}
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={updateSubcategory}
            >
              Оновити
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default UpdateSubcategory;
