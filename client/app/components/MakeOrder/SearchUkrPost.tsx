'use client';
import React, { useEffect, useState } from 'react';
import './SearchUkrPost.scss';
import { Locale } from '@/i18n.config';

type Props = {
  selectFinishDelivery: any;
  infoDelivery: any;
  lang: Locale;
};

const SearchUkrPost = ({ selectFinishDelivery, infoDelivery, lang }: Props) => {
  const [isFinish, setIsFinish] = useState(false);
  const [oblast, setOblast] = useState('');
  const [city, setCity] = useState('');
  const [departament, setDepartament] = useState('');
  const [isFinishSelect, setIsFinishSelect] = useState(false);
  const sendIfoDelivery = (e: any) => {
    if (!isFinish) return;
    e.preventDefault();
    e.stopPropagation();
    let res = {
      oblast,
      city,
      departament,
    };
    selectFinishDelivery(res);
  };

  useEffect(() => {
    if (oblast.length > 3 && city.length > 0 && departament.length > 0) {
      setIsFinishSelect(true);
      setIsFinish(true);
    } else {
      setIsFinishSelect(false);
      setIsFinish(false);
    }
  }, [oblast, city, departament]);
  useEffect(() => {
    if (infoDelivery.oblast && infoDelivery.city && infoDelivery.departament) {
      setOblast(infoDelivery.oblast);
      setCity(infoDelivery.city);
      setDepartament(infoDelivery.departament);
    } else {
      setOblast('');
      setCity('');
      setDepartament('');
    }
  }, [infoDelivery]);
  return (
    <div className="search-ukr-post-container">
      <fieldset>
        <div className="select-input">
          <p>{lang == 'ru' ? 'В отделение' : 'У відділення'}</p>
        </div>
      </fieldset>
      <label>{lang == 'ru' ? 'Область' : 'Область'}</label>
      <input
        value={oblast}
        onChange={(e) => setOblast(e.target.value)}
        placeholder={lang == 'ru' ? 'Область' : 'Область'}
      />
      <label>{lang == 'ru' ? 'Населенный пункт' : 'Населений пункт'}</label>
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder={lang == 'ru' ? 'Населенный пункт' : 'Населений пункт'}
      />
      <label>{lang == 'ru' ? 'Отделение' : 'Відділення'}</label>
      <input
        value={departament}
        onChange={(e) => setDepartament(e.target.value)}
        placeholder={lang == 'ru' ? 'Отделение' : 'Відділення'}
      />
      <button
        type="button"
        style={{
          opacity: isFinishSelect ? 1 : 0.3,
          cursor: isFinishSelect ? 'pointer' : 'unset',
        }}
        onClick={(e) => sendIfoDelivery(e)}
      >
        {lang == 'ru' ? 'Продолжить' : 'Продовжити'}
      </button>
    </div>
  );
};

export default SearchUkrPost;
