'use client';

import React, { useEffect, useState } from 'react';
import './Brends.scss';
import { Button, Alert } from '@mui/material';
import { $authHost } from '@/app/http';

const UpdateBrend = () => {
  const [listBrands, setListBrands] = useState<
    {
      id: number;
      img: null | string;
      name: string;
    }[]
  >([]);
  const [selectBrend, setSelectBrend] = useState<string>('0');
  const [brandName, setBrandName] = useState('');
  const [newImg, setNewImg] = useState<File | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState<null | string>(null);

  const update = async () => {
    try {
      if (selectBrend == '0') return;
      const formData = new FormData();
      formData.append('name', brandName);
      if (newImg) formData.append('img', newImg);
      const res = await $authHost.put('brend/update', formData);
      getBrends();
      setSelectBrend('0');
      setBrandName('');
    } catch (err) {
      alert('Помилка при оновленні');
    }
  };

  const getBrends = async () => {
    try {
      const res = await $authHost.get('brend/get');
      setListBrands(res.data);
    } catch (err) {
      console.log(err);
      alert('Помилка отримання брендів');
    }
  };

  useEffect(() => {
    getBrends();
  }, []);

  return (
    <div className="admin-brand">
      <div className="add-brand">
        <h1>Редагувати бренд</h1>
        <select
          onChange={(e) => {
            setSelectBrend(e.target.value);
            setBrandName(
              listBrands.find((x) => x.id == parseInt(e.target.value))?.name ||
                ''
            );
          }}
          value={selectBrend}
        >
          <option value="0">Виберіть бренд</option>
          {listBrands.map((x) => (
            <option key={x.id} value={x.id}>
              {x.name}
            </option>
          ))}
        </select>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <div className="text-with-input">
          <label htmlFor="brand">Назва бренду</label>
          <input
            id="brand"
            type="text"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
          />

          {selectBrend != '0' &&
          listBrands.find((x) => x.id == parseInt(selectBrend))?.img ? (
            <img
              src={
                (process.env.NEXT_PUBLIC_SERVER || '') +
                  listBrands.find((x) => x.id == parseInt(selectBrend))?.img ||
                ''
              }
            />
          ) : (
            <div>Картинки не добавлено</div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setNewImg(file);
              }
            }}
          />
        </div>
        <Button variant="contained" color="primary" onClick={update}>
          Оновити
        </Button>
      </div>
    </div>
  );
};

export default UpdateBrend;
