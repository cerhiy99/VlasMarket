'use client';

import type React from 'react';
import CloseSVG from '../../assest/Goods/Close.svg';
import { useState } from 'react';
import './Registration.scss';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Locale } from '@/i18n.config';
import { $authHost } from '@/app/http';
import { useDispatch } from 'react-redux';
import { setToken } from '@/app/store/reducers/userReducers';
export type FormRegisterProps = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
};

interface RegistrationModalProps {
  lang: Locale;
  onSubmit: (e: React.FormEvent, formData: FormRegisterProps) => void;
  onClose: () => void;
}
export default function RegistrationModal({
  onClose,
  onSubmit,
  lang,
}: RegistrationModalProps) {
  const dispatch = useDispatch();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormRegisterProps>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleChangeNumber = (value: string) => {
    setFormData((prev) => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (formData.phone.length != 12) {
      setError('Не вірний номер телефону.');
      return;
    }
    if (formData.password != formData.confirmPassword) {
      setError('Паролі не співпадають.');
      return;
    }
    try {
      const res = await $authHost.post('user/register', {
        name: formData.firstName,
        surname: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      });

      dispatch(setToken(res.data.token));
      onSubmit(e, formData);
    } catch (err: any) {
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.message &&
        err.response.data.message.message
      )
        setError(err.response.data.message.message);
      else setError('Невідома помилка');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="registration-modal">
        <div className="row">
          <h3>Реєстрація</h3>
          <div onClick={onClose} className="close">
            <CloseSVG />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Ім&apos;я <span className="required">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Введіть ім'я..."
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Прізвище <span className="required">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Введіть прізвище..."
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Номер телефону <span className="required">*</span>
            </label>
            <div className="phone-input-container">
              <PhoneInput
                country={'ua'}
                placeholder=""
                value={formData.phone}
                onChange={handleChangeNumber}
                inputProps={{
                  type: 'tel',

                  required: true,
                  pattern:
                    '^\\+380 \\(\\d{2}\\\\) \\d{3} \\d{2} \\d{2}$|^(?!\\+380).{7,20}$',
                }}
              />
              {/* <input
                type='tel'
                name='phone'
                placeholder='+380(_)_-__-__'
                value={formData.phone}
                onChange={handleChange}
                required
              /> */}
            </div>
          </div>

          <div className="form-group">
            <label>
              Електронна пошта <span className="required">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Введіть електронну пошту..."
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Пароль <span className="required">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Введіть пароль..."
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>
              Підтвердити пароль <span className="required">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Введіть повторно пароль..."
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          {error && (
            <div style={{ margin: '10px 0', color: 'red' }}>{error}</div>
          )}

          <button type="submit" className="register-button">
            Зареєструватися
          </button>
        </form>
      </div>
    </div>
  );
}
