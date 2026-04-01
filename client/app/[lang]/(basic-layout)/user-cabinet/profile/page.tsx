import React from 'react';
import './Profile.scss';

type Props = {};

const page = (props: Props) => {
  return (
    <div className="profile-container">
      <h1 className="profile-title">Профіль</h1>

      <form className="profile-form">
        <div className="profile-row profile-row-top">
          <div className="profile-field">
            <label>
              Ім&apos;я <span>*</span>
            </label>
            <input type="text" placeholder="Введіть ім'я" />
          </div>

          <div className="profile-field">
            <label>
              Прізвище <span>*</span>
            </label>
            <input type="text" placeholder="Введіть прізвище" />
          </div>

          <div className="profile-field profile-field-birthday">
            <label>День народження</label>

            <div className="profile-input-icon">
              <input type="text" placeholder="Оберіть дату" />
              <img src="/images/calendar-icon.svg" alt="calendar" />
            </div>

            <p className="birthday-note">
              <span>Знижка 10%</span> у День Народження
            </p>
          </div>
        </div>

        <div className="profile-row profile-row-bottom">
          <div className="profile-field">
            <label>
              Номер телефону <span>*</span>
            </label>

            <div className="profile-phone">
              <button type="button" className="profile-phone-flag">
                <img src="/images/ua-flag.svg" alt="UA" />
                <img src="/images/arrow-down-icon.svg" alt="open" />
              </button>

              <input type="text" value="+380" readOnly />
            </div>
          </div>

          <div className="profile-field">
            <label>
              Електронна пошта <span>*</span>
            </label>
            <input type="email" placeholder="Введіть електронну пошту" />
          </div>

          <div className="profile-field">
            <label>Місто</label>

            <div className="profile-select">
              <select defaultValue="">
                <option value="" disabled>
                  Оберіть місто
                </option>
                <option value="lviv">Львів</option>
                <option value="kyiv">Київ</option>
                <option value="odesa">Одеса</option>
              </select>

              <img src="/images/arrow-down-icon.svg" alt="open" />
            </div>
          </div>

          <div className="profile-field">
            <label>Змінити пароль</label>
            <input type="password" placeholder="Введіть новий пароль" />
          </div>
        </div>

        <p className="profile-error">
          Будь ласка, заповніть усі поля, позначені зірочкою (*).
        </p>

        <button type="submit" className="profile-save-btn">
          Зберегти
        </button>
      </form>
    </div>
  );
};

export default page;