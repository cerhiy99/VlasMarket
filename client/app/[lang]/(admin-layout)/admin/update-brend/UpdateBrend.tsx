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

interface Brand {
  id: number;
  name: string;
  descriptionuk: string;
  descriptionru: string;
  img?: string | null;
  isShow: boolean;
  sort: number;
}

const UpdateBrend = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');

  const [name, setName] = useState('');
  const [descriptionuk, setDescriptionuk] = useState<string>('');
  const [descriptionru, setDescriptionru] = useState<string>('');
  const [isShow, setIsShow] = useState(false);
  const [sort, setSort] = useState<number | null>(null);

  const [newImg, setNewImg] = useState<File | null>(null);
  const [currentImg, setCurrentImg] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 🔥 отримання брендів
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await $authHost.get('brend/get');
        setBrands(res.data || []);
      } catch {
        setError('Не вдалося завантажити бренд.');
      }
    };

    fetchBrands();
  }, []);

  // 🔥 при виборі бренду
  useEffect(() => {
    if (selectedId) {
      const selected = brands.find((b) => b.id === +selectedId);
      if (selected) {
        setName(selected.name);
        setDescriptionuk(selected.descriptionuk);
        setDescriptionru(selected.descriptionru);
        setCurrentImg(selected.img || null);
        setIsShow(selected.isShow);
        setSort(selected.sort);
        setNewImg(null);
      }
    } else {
      setName('');
      setDescriptionuk('');
      setDescriptionru('');
      setCurrentImg(null);
      setNewImg(null);
      setIsShow(false);
      setSort(null);
    }
  }, [selectedId, brands]);

  // 🔥 update
  const updateBrand = async () => {
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
      formData.append('isShow', isShow.toString());
      formData.append('sort', String(sort));

      if (newImg) {
        formData.append('img', newImg);
      }

      const res = await $authHost.post(`brend/update/${selectedId}`, formData);

      if (res.status === 200) {
        setSuccess('Бренд успішно оновлено.');
        setError(null);

        // 🔥 оновити список
        const updated = brands.map((b) =>
          b.id === +selectedId
            ? {
                ...b,
                name,
                descriptionuk,
                descriptionru,
                img: newImg ? b.img : currentImg,
              }
            : b
        );
        setBrands(updated);
      } else {
        setError('Щось пішло не так.');
      }
    } catch (err) {
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

        {/* 🔽 SELECT */}
        <div className="text-with-input">
          <FormControl fullWidth>
            <InputLabel id="brand-select-label">Оберіть бренд</InputLabel>
            <Select
              labelId="brand-select-label"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {brands.map((b) => (
                <MenuItem key={b.id} value={String(b.id)}>
                  {b.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        {selectedId && (
          <>
            {/* 🔤 NAME */}
            <div className="text-with-input">
              <label>Назва бренду</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* 🖼 IMAGE */}
            <div className="text-with-input">
              <label>Картинка бренду</label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setNewImg(file);
                }}
              />

              {/* 🔥 PREVIEW */}
              <div style={{ marginTop: 10 }}>
                {newImg ? (
                  <img
                    src={URL.createObjectURL(newImg)}
                    style={{ maxWidth: 150 }}
                  />
                ) : currentImg ? (
                  <img
                    src={(process.env.NEXT_PUBLIC_SERVER || '') + currentImg}
                    style={{ maxWidth: 150 }}
                  />
                ) : (
                  <div>Картинки немає</div>
                )}
              </div>
            </div>

            {/* 📝 DESCRIPTION UA */}
            <div className="text-with-input">
              <label>Опис українською</label>
              <MyJoditEditor
                value={descriptionuk}
                setValue={setDescriptionuk}
                placeholder="Опис українською"
                name="descriptionuk"
              />
            </div>

            {/* 📝 DESCRIPTION RU */}
            <div className="text-with-input">
              <label>Опис російською</label>
              <MyJoditEditor
                value={descriptionru}
                setValue={setDescriptionru}
                placeholder="Опис російською"
                name="descriptionru"
              />
            </div>

            <div
              style={{ flexDirection: 'row', alignItems: 'center' }}
              className="text-with-input"
            >
              <label>Показувати?</label>
              <input
                type="checkbox"
                checked={isShow}
                onChange={(e) => setIsShow(e.target.checked)}
              />
            </div>
            <div className="text-with-input">
              <label>Сортування</label>
              <input
                type="text"
                value={sort || 0}
                onChange={(e) => setSort(Number(e.target.value))}
              />
            </div>

            {/* 🚀 BUTTON */}
            <Button variant="contained" color="primary" onClick={updateBrand}>
              Оновити
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default UpdateBrend;
