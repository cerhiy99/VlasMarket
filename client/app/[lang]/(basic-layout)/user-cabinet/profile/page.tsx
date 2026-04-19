'use client';
import { use, useEffect, useState } from 'react';
import './Profile.scss';
import { $authHost } from '@/app/http';
import { Locale } from '@/i18n.config';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setToken } from '@/app/store/reducers/userReducers';

type Props = {
  params: Promise<{ lang: Locale }>;
};

const formatDateForInput = (date: any) => {
  if (!date) return '';

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const page = ({ params }: Props) => {
  const { lang } = use(params);
  //const { user } = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    dateBirsday: '',
    phone: '',
    email: '',
    city: '',
    cityKey: '',
    password: '',
  });

  const [birshaySelect, setBirshaySelect] = useState('');

  const getData = async () => {
    try {
      const res = await $authHost.get('user/getMy');
      const user = res.data.user;
      setBirshaySelect(formatDateForInput(user.dateBirsday));
      if (user.city) setFindCity(user.city);
      setFormData({
        name: user.name,
        surname: user.surname,
        dateBirsday: user.dateBirsday,
        phone: user.phone,
        email: user.email,
        city: user.city,
        cityKey: user.cityKey,
        password: '',
      });
    } catch (err) {
      console.log(err);
    }
  };
  const [cities, setCities] = useState([]);
  const [findCity, setFindCity] = useState('');
  const [isDropdown, setIsDropdown] = useState(false);
  const getCities = async () => {
    const res = await axios.post('https://api.novaposhta.ua/v2.0/json/', {
      //apiKey: process.env.NP_API_KEY,
      modelName: 'Address',
      calledMethod: 'getCities',
      methodProperties: {
        FindByString: findCity,
        Page: '1',
        Limit: '50',
      },
    });

    setCities(res.data.data);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    getCities();
  }, [findCity]);

  const dispatch = useDispatch();

  const sumbit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const res = await $authHost.put('user/myDate', formData);
      dispatch(setToken(res.data.token));
    } catch (err) {
      alert('Помилка');
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">{lang == 'ru' ? 'Профиль' : 'Профіль'}</h1>

      <form onSubmit={sumbit} className="profile-form">
        <div className="profile-row profile-row-top">
          <div className="profile-field">
            <label>
              {lang == 'ru' ? 'Имя' : "Ім'я"} <span>*</span>
            </label>
            <input
              value={formData.name}
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={lang == 'ru' ? 'Введите имя' : "Введіть ім'я"}
              required
            />
          </div>

          <div className="profile-field">
            <label>
              {lang == 'ru' ? 'Фамилия' : 'Прізвище'} <span>*</span>
            </label>
            <input
              value={formData.surname}
              type="text"
              placeholder={
                lang == 'ru' ? 'Введите фамилию' : 'Введіть прізвище'
              }
              onChange={(e) =>
                setFormData({ ...formData, surname: e.target.value })
              }
              required
            />
          </div>

          <div className="profile-field profile-field-birthday">
            <label>{lang == 'ru' ? 'День Рождения' : 'День народження'}</label>

            <div className="profile-input-icon">
              {
                //<input type="text" placeholder="Оберіть дату" />
              }
              <input
                onChange={(e) => {
                  if (birshaySelect == '') {
                    setFormData({ ...formData, dateBirsday: e.target.value });
                  }
                }}
                value={
                  birshaySelect == '' ? formData.dateBirsday : birshaySelect
                }
                type="date"
              />
            </div>

            <p className="birthday-note">
              <span>{lang == 'ru' ? '' : 'Знижка 10%'}</span>{' '}
              {lang == 'ru' ? 'в День Рождения' : 'у День Народження'}
            </p>
          </div>
        </div>

        <div className="profile-row profile-row-bottom">
          <div className="profile-field">
            <label>
              {lang == 'ru' ? 'Номер телефона' : 'Номер телефону'}{' '}
              <span>*</span>
            </label>

            <div className="profile-phone">
              <button type="button" className="profile-phone-flag">
                <img src="/images/ua-flag.svg" alt="UA" />
                <img src="/images/arrow-down-icon.svg" alt="open" />
              </button>

              <input
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                type="text"
                defaultValue={'+380'}
                readOnly
                required
              />
            </div>
          </div>

          <div className="profile-field">
            <label>
              {lang == 'ru' ? 'Электронная почта' : 'Електронна пошта'}{' '}
              <span>*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              placeholder={
                lang == 'ru'
                  ? 'Введите электронную почту'
                  : 'Введіть електронну пошту'
              }
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="profile-field">
            <label>{lang == 'ru' ? 'Город' : 'Місто'}</label>
            <input
              value={findCity}
              onChange={(e) => {
                setFindCity(e.target.value);
                setIsDropdown(true);
              }}
              onClick={() => setIsDropdown(!isDropdown)}
              //onSelect={() => setIsDropdown(true)}
            />

            <div className="profile-select">
              <div className={`dropdown ${isDropdown ? 'open' : 'close'}`}>
                {cities.map((x: any) => (
                  <div
                    onClick={() => {
                      setIsDropdown(false);
                      setFindCity(
                        lang == 'ru' ? x.DescriptionRu : x.Description
                      );
                      setFormData({
                        ...formData,
                        city: lang == 'ru' ? x.DescriptionRu : x.Description,
                        cityKey: x.Ref,
                      });
                    }}
                    key={x.id}
                    className="city"
                  >
                    {lang == 'ru' ? x.DescriptionRu : x.Description}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="profile-field">
            <label>{lang == 'ru' ? 'Изменить пароль' : 'Змінити пароль'}</label>
            <input
              type="password"
              placeholder={
                lang == 'ru' ? 'Введите новый пароль' : 'Введіть новий пароль'
              }
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
        </div>

        <p className="profile-error">
          {lang == 'ru'
            ? 'Пожалуйста, заполните все поля, отмеченные звездочкой (*).'
            : 'Будь ласка, заповніть усі поля, позначені зірочкою (*).'}
        </p>

        <button type="submit" className="profile-save-btn">
          {lang == 'ru' ? 'Сохранить' : 'Зберегти'}
        </button>
      </form>
    </div>
  );
};

export default page;
