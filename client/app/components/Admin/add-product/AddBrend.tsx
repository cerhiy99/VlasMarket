'use client';

import React, { useState } from 'react';
import './Brends.scss';
import { Button, Alert } from '@mui/material';
import { $authHost } from '@/app/http';

const AddBrand = () => {
  const [brand, setBrand] = useState('');
  const [error, setError] = useState<null | string>(null);
  const [success, setSuccess] = useState<null | string>(null);

  const addBrand = async () => {
    if (!brand) {
      setError('Поле для введення бренда не може бути порожнім.');
      setSuccess(null);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', brand);

      const res = await $authHost.post('brend/add', formData);
      if (res.status == 200) {
        setSuccess('Бренд успішно додано.');
        setError(null);
        setBrand('');
      } else {
        setError(res.data.err);
        setSuccess(null);
      }
    } catch (err) {
      setError('Сталася помилка при додаванні бренда.');
      setSuccess(null);
    }
  };

  return (
    <div className="admin-brand">
      <div className="add-brand">
        <h1>Додати бренд</h1>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <div className="text-with-input">
          <label htmlFor="brand">Назва бренду</label>
          <input
            id="brand"
            type="text"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>
        <Button variant="contained" color="primary" onClick={addBrand}>
          Додати
        </Button>
      </div>
    </div>
  );
};

export default AddBrand;
