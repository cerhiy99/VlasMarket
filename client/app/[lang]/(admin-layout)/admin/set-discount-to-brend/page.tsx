'use client';
import React, { useEffect, useState, useRef } from 'react';
import './DiscountBrend.scss';
import { $authHost } from '@/app/http';

interface Brand {
  id: number;
  name: string;
}

const Page = () => {
  const [brends, setBrends] = useState<Brand[]>([]);
  const [searchBrend, setSearhBrend] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [selectBrend, setSelectBrend] = useState<Brand | null>(null);
  const [discount, setDiscount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const getBrends = async () => {
    try {
      const res = await $authHost.get('brend/get');
      setBrends(res.data);
    } catch (err) {
      console.error(err);
      alert('Помилка отримання брендів');
    }
  };

  useEffect(() => {
    getBrends();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsShow(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredBrends = brends.filter((x) =>
    x.name.toLowerCase().includes(searchBrend.toLowerCase())
  );

  const handleSelectBrand = (brand: Brand) => {
    setSelectBrend(brand);
    setSearhBrend('');
    setIsShow(false);
  };

  const handleRemoveBrand = () => {
    setSelectBrend(null);
    setDiscount('');
  };

  const handleSave = async () => {
    if (!selectBrend || !discount) return;
    setIsLoading(true);
    try {
      // Змініть 'goods/setDiscountToBrend' на ваш реальний ендпоінт
      await $authHost.post('goods/setDiscountToBrend', {
        brendId: selectBrend.id,
        discount: Number(discount),
      });
      alert('Знижку успішно застосовано!');
      handleRemoveBrand();
    } catch (err) {
      console.error(err);
      alert('Помилка при встановленні знижки');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="discount-brend">
      <h1>Встановити знижку на бренд</h1>

      <div className="search-brend" ref={dropdownRef}>
        <label>Пошук бренду</label>
        <input
          placeholder="Почніть вводити назву..."
          onClick={() => setIsShow(true)}
          value={searchBrend}
          onChange={(e) => {
            setSearhBrend(e.target.value);
            setIsShow(true);
          }}
        />
        {isShow && (
          <div className="dropdown">
            <ul>
              {filteredBrends.length > 0 ? (
                filteredBrends.map((x) => (
                  <li key={x.id} onClick={() => handleSelectBrand(x)}>
                    {x.name}
                  </li>
                ))
              ) : (
                <div className="empty-message">Бренд не знайдено</div>
              )}
            </ul>
          </div>
        )}
      </div>

      {selectBrend && (
        <div className="selected-brend-section">
          <div className="brend-info">
            <h3>Вибрано: {selectBrend.name}</h3>
            <button className="remove-btn" onClick={handleRemoveBrand}>
              Скасувати вибір
            </button>
          </div>
          <div className="discount-input-group">
            <label>Розмір знижки:</label>
            <input
              type="number"
              min="0"
              max="100"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="0"
            />
            <span className="percent-sign">%</span>
          </div>
        </div>
      )}

      <div className="actions">
        <button
          className="btn-cancel"
          onClick={handleRemoveBrand}
          disabled={isLoading || !selectBrend}
        >
          Скасувати
        </button>
        <button
          className="btn-save"
          onClick={handleSave}
          disabled={isLoading || !selectBrend || !discount}
        >
          {isLoading ? 'Збереження...' : 'Зберегти'}
        </button>
      </div>
    </div>
  );
};

export default Page;
