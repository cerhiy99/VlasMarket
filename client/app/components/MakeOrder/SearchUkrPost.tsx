'use client';
import React, { useEffect, useState } from 'react';
import './SearchUkrPost.scss';

type Props = {
  selectFinishDelivery: any;
  infoDelivery: any;
};

const SearchUkrPost = ({ selectFinishDelivery, infoDelivery }: Props) => {
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
          <p>У відділення</p>
        </div>
      </fieldset>
      <label>Область</label>
      <input
        value={oblast}
        onChange={(e) => setOblast(e.target.value)}
        placeholder="Область"
      />
      <label>Населений пункт</label>
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Населений пункт"
      />
      <label>Відділення</label>
      <input
        value={departament}
        onChange={(e) => setDepartament(e.target.value)}
        placeholder="Відділення"
      />
      <button
        type="button"
        style={{
          opacity: isFinishSelect ? 1 : 0.3,
          cursor: isFinishSelect ? 'pointer' : 'unset',
        }}
        onClick={(e) => sendIfoDelivery(e)}
      >
        Продовжити
      </button>
    </div>
  );
};

export default SearchUkrPost;
