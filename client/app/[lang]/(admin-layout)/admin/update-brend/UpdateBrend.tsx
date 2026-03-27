'use client';
import { useEffect, useState } from 'react';
import { $authHost } from '@/app/http';
import {
  Button,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';
import './AddCategory.scss';
import MyJoditEditor from '@/app/components/utils/MyJoditReact';

interface Category {
  id: number;
  name: string;
  descriptionuk: string;
  descriptionru: string;
}

const UpdateBrend = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');

  const [name, setName] = useState('');
  const [descriptionuk, setDescriptionuk] = useState<string>('');
  const [descriptionru, setDescriptionru] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await $authHost.get('brend/get');
        setCategories(res.data || []);
      } catch {
        setError('Не вдалося завантажити бренд.');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedId) {
      const selected = categories.find((c) => c.id === +selectedId);
      if (selected) {
        setName(selected.name);
        setDescriptionuk(selected.descriptionuk);
        setDescriptionru(selected.descriptionru);
      }
    } else {
      setName('');
    }
  }, [selectedId]);

  const updateCategory = async () => {
    if (!selectedId || !name) {
      setError('Усі поля обовʼязкові.');
      setSuccess(null);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('descriptionuk', descriptionuk);
      formData.append('descriptionru', descriptionru);

      const res = await $authHost.post(`brend/update/${selectedId}`, formData);

      if (res.status === 200) {
        setSuccess('Бренд успішно оновлена.');
        setError(null);
      } else {
        setError('Щось пішло не так.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Сталася помилка при оновленні.');
      setSuccess(null);
    }
  };

  return (
    <div className="admin-category">
      <div className="add-category">
        <h1>Оновити бренд</h1>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <div className="text-with-input">
          <FormControl fullWidth>
            <InputLabel id="category-select-label">Оберіть бренд</InputLabel>
            <Select
              labelId="category-select-label"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {selectedId && (
          <>
            <div className="text-with-input">
              <label htmlFor="nameUA">Назва українською</label>
              <input
                id="nameUA"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="text-with-input">
              <label htmlFor="descriptionuk">Опис українською</label>
              <MyJoditEditor
                value={descriptionuk}
                setValue={setDescriptionuk}
                placeholder="Опис українською"
                name="Опис українською"
              />
            </div>

            <div className="text-with-input">
              <label htmlFor="descriptionru">Опис російською</label>
              <MyJoditEditor
                placeholder="Опис російською"
                value={descriptionru}
                setValue={setDescriptionru}
                name="Опис російською"
              />
            </div>

            <Button
              variant="contained"
              color="primary"
              onClick={updateCategory}
            >
              Оновити
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default UpdateBrend;
