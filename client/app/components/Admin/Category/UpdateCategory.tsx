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
import MyJoditEditor from '../../utils/MyJoditReact';

interface Category {
  id: number;
  nameuk: string;
  nameru: string;
  svg: string;
}

const UpdateCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');

  const [nameUA, setNameUA] = useState('');
  const [nameRU, setNameRU] = useState('');
  const [descriptionuk, setDescriptionuk] = useState<string>('');
  const [descriptionru, setDescriptionru] = useState<string>('');
  const [svg, setSvg] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await $authHost.get('category/get');
        setCategories(res.data.res || []);
      } catch {
        setError('Не вдалося завантажити категорії.');
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedId) {
      const selected = categories.find((c) => c.id === +selectedId);
      if (selected) {
        setNameUA(selected.nameuk);
        setNameRU(selected.nameru);
      }
    } else {
      setNameUA('');
      setNameRU('');
    }
  }, [selectedId]);

  const updateCategory = async () => {
    if (!selectedId || !nameUA || !nameRU) {
      setError('Усі поля обовʼязкові.');
      setSuccess(null);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('nameua', nameUA);
      formData.append('nameru', nameRU);
      formData.append('descriptionuk', descriptionuk);
      formData.append('descriptionru', descriptionru);
      if (svg) formData.append('image', svg);

      const res = await $authHost.post(
        `category/update/${selectedId}`,
        formData,
      );
      console.log(43434, res);
      if (res.status === 200) {
        setSuccess('Категорія успішно оновлена.');
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
    <div className="add-category">
      <h1>Оновити категорію</h1>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <div className="text-with-input">
        <FormControl fullWidth>
          <InputLabel id="category-select-label">Оберіть категорію</InputLabel>
          <Select
            labelId="category-select-label"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={String(cat.id)}>
                {cat.nameuk}
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
            <label htmlFor="svg">Оновити svg (необов’язково)</label>
            <input
              id="svg"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setSvg(e.target.files ? e.target.files[0] : null)
              }
            />
          </div>

          <Button variant="contained" color="primary" onClick={updateCategory}>
            Оновити
          </Button>
        </>
      )}
    </div>
  );
};

export default UpdateCategory;
