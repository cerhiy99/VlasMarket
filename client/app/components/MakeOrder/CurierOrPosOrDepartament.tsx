import React, { useEffect, useState, useMemo } from 'react';
import './CurierOrPosOrDepartament.scss';
import {
  CityDataNewPost,
  fetchBranchesByCityRef,
  WarehouseData,
} from './apiNewPost';
import { useTranslation } from '@/context/TranslationProvider';
import { Locale } from '@/i18n.config';

type Props = {
  typeDelivery: 'department' | 'post' | 'curier';
  selectLocality: CityDataNewPost;
  selectFinishDelivery: (data: any) => void;
  lang: Locale;
};

const CurierOrPosOrDepartament = ({
  typeDelivery,
  selectLocality,
  selectFinishDelivery,
  lang,
}: Props) => {
  const { t } = useTranslation();

  // Дані з API (повний список для конкретного міста)
  const [infoDelivery, setInfoDelivery] = useState<WarehouseData[]>([]);
  // Стан пошукового рядка
  const [searchQuery, setSearchQuery] = useState('');
  // Вибране відділення
  const [selectedBranch, setSelectedBranch] = useState<WarehouseData | null>(
    null
  );

  // Стан для кур'єра
  const [address, setAddress] = useState({
    street: '',
    house: '',
    apartment: '',
  });
  const [isSubListOpen, setIsSubListOpen] = useState(false);

  // 1. Завантаження даних при зміні міста або типу доставки
  useEffect(() => {
    const loadData = async () => {
      if (typeDelivery !== 'curier' && selectLocality?.Ref) {
        const res = await fetchBranchesByCityRef(
          selectLocality.Ref,
          typeDelivery
        );
        setInfoDelivery(res);
      } else {
        setInfoDelivery([]);
      }
      // Скидаємо старі вибори при зміні міста/типу
      setSearchQuery('');
      setSelectedBranch(null);
      setIsSubListOpen(false);
    };

    loadData();
  }, [selectLocality.Ref, typeDelivery]);

  // 2. Розумна фільтрація (обчислюється лише коли змінюється запит або масив даних)
  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return infoDelivery;

    const query = searchQuery.toLowerCase().trim();
    const searchWords = query.split(/\s+/);

    return infoDelivery
      .filter((item) => {
        const desc = (
          lang === 'ru' ? item.DescriptionRu : item.Description
        ).toLowerCase();
        // Перевірка, чи всі слова з пошуку є в описі (AND logic)
        return searchWords.every((word) => desc.includes(word));
      })
      .sort((a, b) => {
        const aDesc = (
          lang === 'ru' ? a.DescriptionRu : a.Description
        ).toLowerCase();
        const bDesc = (
          lang === 'ru' ? b.DescriptionRu : b.Description
        ).toLowerCase();

        const aStarts = aDesc.startsWith(query);
        const bStarts = bDesc.startsWith(query);

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return aDesc.localeCompare(bDesc);
      });
  }, [searchQuery, infoDelivery, lang]);

  // 3. Перевірка валідності форми
  const isFormValid = useMemo(() => {
    if (typeDelivery === 'curier') {
      return address.street.length > 2 && address.house.length > 0;
    }
    return !!selectedBranch;
  }, [typeDelivery, address, selectedBranch]);

  const handleSelectBranch = (branch: WarehouseData) => {
    setSelectedBranch(branch);
    setSearchQuery(lang === 'ru' ? branch.DescriptionRu : branch.Description);
    setIsSubListOpen(false);
  };

  const handleSubmit = (e: any) => {
    const payload =
      typeDelivery === 'curier'
        ? { typeDelivery, selectLocality, ...address }
        : { typeDelivery, selectLocality, selectInfoDelivery: selectedBranch };

    if (!isFormValid) return;
    e.preventDefault();
    e.stopPropagation();
    let res = {};
    if (typeDelivery == 'curier') {
      res = {
        typeDelivery,
        selectLocality,
        ...address,
      };
    } else {
      res = {
        typeDelivery,
        selectLocality,
        selectInfoDelivery: {
          Ref: selectedBranch?.Ref,
          DescriptionRu: selectedBranch?.DescriptionRu,
          Description: selectedBranch?.Description,
          SettlementDescription: selectedBranch?.SettlementDescription,
          TypeOfWarehouse: selectedBranch?.TypeOfWarehouse,
        },
      };
    }
    selectFinishDelivery(res);
  };

  return (
    <div className="curier-or-post-or-departament">
      {typeDelivery !== 'curier' ? (
        <div className="post-or-departament">
          <p>
            {typeDelivery === 'department' ? 'Відділення' : 'Поштомат'}
            <span>*</span>
          </p>
          <input
            value={searchQuery}
            onFocus={() => setIsSubListOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedBranch(null); // Скидаємо вибране, якщо користувач знову почав друкувати
              setIsSubListOpen(true);
            }}
            placeholder={
              typeDelivery === 'department'
                ? (t('makeOrder.departament') as string)
                : (t('makeOrder.delivery.postomat') as string)
            }
          />

          {isSubListOpen && filteredList.length > 0 && (
            <ul className="dropdown-list">
              {filteredList.slice(0, 20).map(
                (
                  item // Обмежуємо вивід до 20 для швидкості DOM
                ) => (
                  <li key={item.Ref} onClick={() => handleSelectBranch(item)}>
                    {lang === 'ru' ? item.DescriptionRu : item.Description}
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      ) : (
        <div className="curier">
          {['street', 'house', 'apartment'].map((field) => (
            <React.Fragment key={field}>
              <p>
                {t(`makeOrder.delivery.${field}`)}{' '}
                {field !== 'apartment' && <span>*</span>}
              </p>
              <input
                value={(address as any)[field]}
                onChange={(e) =>
                  setAddress({ ...address, [field]: e.target.value })
                }
                placeholder={t(`makeOrder.delivery.${field}`) as string}
              />
            </React.Fragment>
          ))}
        </div>
      )}

      <button
        type="button"
        className={`submit-btn ${isFormValid ? 'active' : 'disabled'}`}
        disabled={!isFormValid}
        onClick={handleSubmit}
      >
        {t('makeOrder.continie')}
      </button>
    </div>
  );
};

export default CurierOrPosOrDepartament;

/*
import React, { useEffect, useState } from 'react';
import './CurierOrPosOrDepartament.scss';
import {
  CityDataNewPost,
  fetchBranchesByCityRef,
  WarehouseData,
} from './apiNewPost';
import { useTranslation } from '@/context/TranslationProvider';
import { Locale } from '@/i18n.config';

type Props = {
  typeDelivery: 'department' | 'post' | 'curier';
  selectLocality: CityDataNewPost;
  selectFinishDelivery: any;
  lang: Locale;
};

const CurierOrPosOrDepartament = ({
  typeDelivery,
  selectLocality,
  selectFinishDelivery,
  lang,
}: Props) => {
  const [isFinishSelect, setIsFinishSelect] = useState(false);
  const [searchPostOrDepartament, setSearchPostOrDepartament] = useState('');
  const [infoDelivery, setInfoDelivery] = useState<WarehouseData[]>([]);
  const [filterInfoDelivery, setFilterInfoDelivery] = useState<WarehouseData[]>(
    []
  );
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [apartment, setApartment] = useState('');
  const [selectInfoDelivery, setSelectFilterDeilvery] =
    useState<WarehouseData | null>(null);

  const [isSubList, setSubList] = useState<boolean>(true);
  const selectDelivery = (value: WarehouseData) => {
    setIsFinishSelect(true);
    setSelectFilterDeilvery(value);
    setSearchPostOrDepartament(
      lang == 'ru' ? value.DescriptionRu : value.Description
    );
    setSubList(false);
  };
  const changeSearchPost = async (value: string) => {
    setSearchPostOrDepartament(value);

    const filterInfoDelivery = infoDelivery.filter((item) => {
      const description = item.Description.toLowerCase();
      const searchQuery = value.toLowerCase();

      // Розбиваємо пошуковий запит на слова
      const searchWords = searchQuery.split(/\s+/).filter(Boolean);

      // Генеруємо регулярку для перевірки входження всіх слів
      const regexAllWords = new RegExp(
        searchWords.map((word) => `(?=.*${word})`).join(''),
        'i'
      );

      // Пріоритет для точного збігу ліворуч (на початку рядка)
      const exactMatchStart = new RegExp(`^${searchQuery}`, 'i');

      if (exactMatchStart.test(description)) {
        return true; // Точний збіг на початку
      }

      // Перевірка на входження всіх слів (ігноруючи спеціальні символи)
      return regexAllWords.test(description);
    });

    // Сортування: спочатку точні збіги, потім решта
    const sortedDelivery = filterInfoDelivery.sort((a, b) => {
      const aDescription = a.Description.toLowerCase();
      const bDescription = b.Description.toLowerCase();
      const searchQuery = value.toLowerCase();

      const aStartsWith = aDescription.startsWith(searchQuery);
      const bStartsWith = bDescription.startsWith(searchQuery);

      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;

      return aDescription.localeCompare(bDescription); // Алфавітний порядок для решти
    });

    setFilterInfoDelivery(sortedDelivery);
  };

  const getInfoForDelivery = async () => {
    if (typeDelivery != 'curier') {
      const res = await fetchBranchesByCityRef(
        selectLocality.Ref,
        typeDelivery
      );
      setInfoDelivery(res);
      setFilterInfoDelivery(res);
    }
  };
  useEffect(() => {
    setSubList(false);
  }, [typeDelivery]);

  useEffect(() => {
    getInfoForDelivery();
    setIsFinishSelect(false);
    setSearchPostOrDepartament('');
  }, [selectLocality, typeDelivery]);

  useEffect(() => {
    if (street.length > 2 && house.length > 0) {
      setIsFinishSelect(true);
    }
  }, [street, house]);

  const sendIfoDelivery = (e: any) => {
    if (!isFinishSelect) return;
    e.preventDefault();
    e.stopPropagation();
    let res = {};
    if (typeDelivery == 'curier') {
      res = {
        typeDelivery,
        selectLocality,
        street,
        house,
        apartment,
      };
    } else {
      res = {
        typeDelivery,
        selectLocality,
        selectInfoDelivery,
      };
    }
    selectFinishDelivery(res);
  };
  const { t } = useTranslation();

  const title = {
    department: t('makeOrder.departament').slice(
      0,
      t('makeOrder.departament').length - 1
    ),
    post: t('makeOrder.delivery.postomat'),
    curier: t('makeOrder.curier'),
  };

  return (
    <div className="curier-or-post-or-departament">
      {typeDelivery != 'curier' ? (
        <div className="post-or-departament">
          <p style={{ marginTop: '7.5px' }}>
            {typeDelivery == 'department' ? 'Віділення' : 'поштомат'}
            <span>*</span>
          </p>
          <input
            value={searchPostOrDepartament}
            onClick={() => {
              setSubList(true);
            }}
            onChange={(e) => changeSearchPost(e.target.value)}
            type="text"
            placeholder={
              typeDelivery == 'department'
                ? (t('makeOrder.departament') as string)
                : (t('makeOrder.delivery.postomat') as string)
            }
          />
          {isSubList && (
            <ul>
              {filterInfoDelivery.map((x) => (
                <li
                  key={x.Ref}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    selectDelivery(x);
                  }}
                >
                  {lang == 'ru' ? x.DescriptionRu : x.Description}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="curier">
          <p style={{ marginTop: '7.5px' }}>
            {t('makeOrder.delivery.street')} <span>*</span>
          </p>
          <input
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder={t('makeOrder.delivery.street') as string}
          />
          <p style={{ marginTop: '7.5px' }}>
            {t('makeOrder.delivery.house')} <span>*</span>
          </p>
          <input
            value={house}
            onChange={(e) => setHouse(e.target.value)}
            placeholder={t('makeOrder.delivery.house') as string}
          />
          <p style={{ marginTop: '7.5px' }}>
            {t('makeOrder.delivery.apartment')} <span>*</span>
          </p>
          <input
            value={apartment}
            onChange={(e) => setApartment(e.target.value)}
            placeholder={t('makeOrder.delivery.apartment') as string}
          />
        </div>
      )}
      <button
        type="button"
        style={{
          opacity: isFinishSelect ? 1 : 0.3,
          cursor: isFinishSelect ? 'pointer' : 'unset',
        }}
        onClick={(e) => sendIfoDelivery(e)}
      >
        {t('makeOrder.continie')}
      </button>
    </div>
  );
};

export default CurierOrPosOrDepartament;
*/
