'use client';
import { $authHost } from '@/app/http';
import React, { useEffect, useState } from 'react';
import './AddLine.scss';
import { Button } from '@mui/material';

const EditAndDelLine = () => {
  const [selectLinia, setSelectLinia] = useState<string>('0');
  const [newName, setNewName] = useState('');
  const [linias, setlinias] = useState<{ id: number; name: 'string' }[]>([]);
  const getLinia = async () => {
    try {
      const res = await $authHost.get('goods/getLinia');
      setlinias(res.data);
    } catch (err) {
      console.log(err);
      alert('Помилка при отриманні лінії');
    }
  };
  const EditLine = async () => {
    try {
      const res = await $authHost.post('goods/editLine/' + selectLinia, { newName });
      setSelectLinia('0');
      getLinia();
      setNewName('');
    } catch (err) {
      console.log(err);
      alert('Помилка редагування');
    }
  };
  const del = async () => {
    try {
      const name = linias.find((x) => x.id === parseInt(selectLinia))?.name || '';

      const text = `Ви справді хочете видалити лінію ${name}?`;

      const isConfirm = window.confirm(text);

      if (!isConfirm) return; // ❌ якщо відмінили — нічого не робимо

      const res = await $authHost.post('goods/delLine/' + selectLinia);

      setNewName('');
      setSelectLinia('0');
      getLinia();
    } catch (err) {
      console.log(err);
      alert('Помилка при видаленні');
    }
  };
  useEffect(() => {
    getLinia();
  }, []);
  return (
    <div className="add-line">
      <h2>Редагувати і видалити лінію</h2>
      <select
        value={selectLinia}
        onChange={(e) => {
          setSelectLinia(e.target.value);
          setNewName(linias.find((x) => x.id === parseInt(e.target.value))?.name || '');
        }}
      >
        <option value={0}>Виберіть лінію</option>
        {linias.map((x) => (
          <option key={x.id} value={x.id}>
            {x.name}
          </option>
        ))}
      </select>
      <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} />
      <div
        style={{ justifyContent: 'space-between', width: '100%', display: 'flex' }}
        className="row"
      >
        <Button variant="contained" color="error" onClick={del}>
          Видалити
        </Button>
        <Button variant="contained" color="primary" onClick={EditLine}>
          Редагувати
        </Button>
      </div>
    </div>
  );
};

export default EditAndDelLine;
