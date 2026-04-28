'use client';
import { Locale } from '@/i18n.config';
import './Promokods.scss';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { $authHost } from '@/app/http';
import DownSVG from '../../assest/MakeOrder/ArrowDown.svg';
import { PromokodFromDBInterface } from '@/app/[lang]/(admin-layout)/admin/promokods/GetPromokods';

type Props = {
  lang: Locale;
  setPromokod: any;
  promokod: PromokodFromDBInterface | null;
};

const Promokods = ({ lang, setPromokod, promokod }: Props) => {
  const { isAuthorize } = useSelector((state: RootState) => state.user);
  const [promokods, setPromokods] = useState<PromokodFromDBInterface[]>([]);
  const [seachPromokod, setSeachPromokod] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const [colorMessage, setColorMessage] = useState<'green' | 'red'>('green');
  const [message, setMessage] = useState('');

  const getMyPromokods = async () => {
    try {
      const res = await $authHost.get('promokods/getMy');
      const filterPromokods = res.data.myPromokods.filter((x: any) => !x.isUse);
      const promokods = filterPromokods.map((x: any) => x.promokod);
      setPromokods(promokods);
    } catch (err) {
      console.log(2323, err);
    }
  };

  const searchPromokod = async () => {
    try {
      if (!seachPromokod) {
        setColorMessage('red');
        setMessage(
          lang == 'ru' ? 'Сначала введите код' : 'Спочатку введіть код'
        );
        return;
      }
      if (isAuthorize) {
        try {
          const res = await $authHost.get(
            'promokods/checkPromokod?promokodCode=' + seachPromokod
          );
          await getMyPromokods();
          setPromokod(res.data.promokod);
        } catch (err: any) {
          setColorMessage('red');
          setMessage(err.response.data.message);
        }
      } else {
        try {
          const res = await $authHost.get(
            'promokods/checkPromokodNoAuth?promokodCode=' + seachPromokod
          );
          setPromokod(res.data.promokod);
          setPromokods([res.data.promokod]);
        } catch (err: any) {
          setColorMessage('red');
          setMessage(err.response.data.message);
        }
      }
    } catch (err) {
      setColorMessage('red');
      setMessage(
        lang == 'ru'
          ? 'Произошла неизвестная ошибка'
          : 'Сталася невідома помилка'
      );
    }
  };

  useEffect(() => {
    if (isAuthorize) {
      getMyPromokods();
    }
  }, [isAuthorize]);

  useEffect(() => {}, [promokods]);

  const setNewPromokod = (x: PromokodFromDBInterface) => {
    if (promokod === null || promokod.id != x.id) {
      setPromokod(x);
    } else {
      setPromokod(null);
    }
  };

  return (
    <div className="promokods-container">
      <h3>{lang == 'ru' ? 'Промокоды' : 'Промокоди'}</h3>
      <input
        type="text"
        value={seachPromokod}
        onChange={(e) => {
          setMessage('');
          setSeachPromokod(e.target.value);
        }}
        placeholder={lang == 'ru' ? 'Введите промокод' : 'Введіть промокод'}
      />
      {message && (
        <div style={{ color: colorMessage }} className="promokod-message">
          {message}
        </div>
      )}
      <p>
        {lang == 'ru'
          ? 'Если у вас есть промокод – введите его для получения скидки'
          : 'Якщо у вас є промокод — введіть його для отримання знижки'}
      </p>
      <button onClick={searchPromokod}>
        {lang == 'ru' ? 'Применить' : 'Застосувати'}
      </button>
      {promokods.length > 0 && (
        <div className={`list-promokods ${isOpen ? 'open' : 'close'}`}>
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="list-promokod-header"
          >
            <div className="list-promokod-title">
              {lang == 'ru' ? 'Доступные промокоды' : 'Доступні промокоди'}
            </div>
            <div className="list-promokod-svg">
              <DownSVG />
            </div>
          </div>
          <div className="list-promokod-dropdown">
            {promokods.map((x) => (
              <div
                onClick={(e) => setNewPromokod(x)}
                className={`promokod ${promokod && promokod.id == x.id ? 'promokod-select' : ''}`}
              >
                <img
                  src={process.env.NEXT_PUBLIC_SERVER + x.img}
                  alt={lang == 'ru' ? x.nameru : x.nameuk}
                  width={100}
                  height={32}
                />
                <div className="promokod-name">
                  {lang == 'ru' ? x.nameru : x.nameuk}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Promokods;
