'use client';
import { $authHost } from '@/app/http';
import { useEffect, useState } from 'react';
import { typesPromokods } from './AddPromokods';
import './GetPromokods.scss';

export type PromokodInterface = {
  id: number;
  code: string;
  nameuk: string;
  nameru: string;
  descriptionuk: string;
  descriptionru: string;
  type:
    | 'procent'
    | 'price'
    | 'select_goods_free'
    | 'select_goods_discount_sum'
    | 'select_goods_discount_procent';
  procent: null;
  min_price: null;
  countPromokods: 0;
  selectVolumeArt: null | string;
  img: null | File;
  price_discount: null | number;
};

export type PromokodFromDBInterface = {
  id: number;
  code: string;
  nameuk: string;
  nameru: string;
  descriptionuk: string;
  descriptionru: string;
  type:
    | 'procent'
    | 'price'
    | 'select_goods_free'
    | 'select_goods_discount_sum'
    | 'select_goods_discount_procent';
  procent: null;
  min_price: null;
  countPromokods: 0;
  selectVolumeArt: null | string;
  img: string;
  price_discount: null | number;
};

type Props = {};

const GetPromokods = (props: Props) => {
  const [findPromokods, setFindPromokods] = useState('');
  const [promokods, setPromokods] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectPromokod, setSelectPromokod] = useState<{
    id: number;
    code: string;
    nameuk: string;
    nameru: string;
    descriptionuk: string;
    descriptionru: string;
    type:
      | 'procent'
      | 'price'
      | 'select_goods_free'
      | 'select_goods_discount_sum'
      | 'select_goods_discount_procent';
    procent: null;
    min_price: null;
    countPromokods: 0;
    selectVolumeArt: null | string;
    img: null | File;
    price_discount: null | number;
  } | null>(null);

  const getPromokods = async () => {
    try {
      const res = await $authHost.get('promokods/get');
      setPromokods(res.data.promokods);
    } catch (err) {
      alert('Помилка при отриманні');
    }
  };

  useEffect(() => {
    getPromokods();
  }, []);

  return (
    <div className="get-promokods">
      <h2>Перегляд сертифіків</h2>
      <div className="find-promokod">
        <input
          onClick={() => setIsOpen(true)}
          onChange={(e) => {
            setFindPromokods(e.target.value);
            setSelectPromokod(null);
          }}
          type="text"
          value={findPromokods}
        />
        <div className={`dropdown ${isOpen ? 'open' : 'close'}`}>
          <div
            onClick={() => {
              setSelectPromokod(null);
              setIsOpen(false);
            }}
            className="promokod"
          >
            Виберіть прмокод
          </div>
          {promokods
            .filter(
              (x: any) =>
                x.nameuk.includes(findPromokods) ||
                x.nameru.includes(findPromokods)
            )
            .map((x: any) => (
              <div
                onClick={() => {
                  setSelectPromokod(x);
                  setIsOpen(false);
                }}
                className="promokod"
              >
                {x.code}
              </div>
            ))}
        </div>
        {selectPromokod != null && (
          <div className="select-promokod">
            <div className="value">
              <label htmlFor="">Код</label>
              <input type="text" value={selectPromokod.code} />
            </div>
            <div className="value">
              <label htmlFor="">{"ім'я"} українською</label>
              <input type="text" value={selectPromokod.nameuk} />
            </div>
            <div className="value">
              <label htmlFor="">{"ім'я"} російською</label>
              <input type="text" value={selectPromokod.nameru} />
            </div>
            <div className="value">
              <label htmlFor="">опис українською</label>
              <input type="text" value={selectPromokod.descriptionuk} />
            </div>
            <div className="value">
              <label htmlFor="">опис російською</label>
              <input type="text" value={selectPromokod.descriptionru} />
            </div>
            <div className="value">
              <label htmlFor="">Тип</label>
              <div>
                {
                  typesPromokods.find((x) => x.type == selectPromokod.type)
                    ?.description
                }
              </div>
            </div>
            <div className="value">
              <label htmlFor="">Тип</label>
              <input type="text" value={selectPromokod.type} />
            </div>
            <div className="value">
              <label>Кількість промокодів (залишилося)</label>
              <input
                type="text"
                value={Number(selectPromokod.countPromokods)}
                name="countPromokods"
                required
              />
            </div>
            {selectPromokod.type.startsWith('select_goods') && (
              <div className="value">
                <label>Артикул на товар</label>
                <input
                  type="text"
                  value={selectPromokod.selectVolumeArt || ''}
                  name="selectVolumeArt"
                  required
                />
              </div>
            )}
            {(selectPromokod.type.startsWith('select_goods_discount_procent') ||
              selectPromokod.type == 'procent') && (
              <div className="value">
                <label>Відсоток знижки</label>
                <input
                  value={Number(selectPromokod.procent)}
                  name="procent"
                  required
                />
              </div>
            )}
            {selectPromokod.type == 'price' && (
              <div className="value">
                <label>Мінімальна ціна для знижку в грн</label>
                <input
                  value={Number(selectPromokod.min_price)}
                  name="min_price"
                  required
                />
              </div>
            )}
            {selectPromokod.type == 'price' && (
              <div className="value">
                <label>Знижка в грн</label>
                <input
                  value={Number(selectPromokod.price_discount)}
                  name="price_discount"
                  required
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GetPromokods;
