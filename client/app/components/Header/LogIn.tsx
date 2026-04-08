'use client';
import React, { useState } from 'react';
import CloseSVG from '../../assest/Goods/Close.svg';
import './LogIn.scss';
import { Locale } from '@/i18n.config';
import { $authHost } from '@/app/http';
import { useDispatch } from 'react-redux';
import { setToken } from '@/app/store/reducers/userReducers';

export type FormLoginProps = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type Props = {
  lang: Locale;
  onSubmit: (formData: FormLoginProps) => void;
  onRegisterModal: () => void;
  close: () => void;
  setIsForgorPassword: any;
};

const LogIn = ({
  onRegisterModal,
  close,
  lang,
  onSubmit,
  setIsForgorPassword,
}: Props) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState<FormLoginProps>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const handleSubmitLogin = async () => {
    setError('');

    if (validateForm()) {
      try {
        const res = await $authHost.post('user/login', {
          email: formData.email,
          password: formData.password,
          isRemember: formData.rememberMe,
        });

        if (res.status === 200) {
          dispatch(setToken(res.data.token));
          onSubmit(formData);
          close();
        } else {
          setError('Сталася помилка');
        }
      } catch (err: any) {
        setError(err?.response?.data?.message?.message || 'Сталася помилка');
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    if (error) setError('');
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email =
        lang === 'ru'
          ? 'Электронная почта обязательна'
          : "Електронна пошта обов’язкова";
    }

    if (!formData.password.trim()) {
      newErrors.password =
        lang === 'ru' ? 'Пароль обязателен' : "Пароль обов’язковий";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="logIn-container">
      <div className="log-in">
        <div className="login-header">
          <h3>{lang === 'ru' ? 'Войти' : 'Увійти'}</h3>

          <button type="button" onClick={close} className="close-button">
            <CloseSVG />
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="login-email">
            {lang === 'ru' ? 'Электронная почта' : 'Електронна пошта'}{' '}
            <span>*</span>
          </label>

          <input
            id="login-email"
            type="text"
            name="email"
            placeholder={
              lang === 'ru'
                ? 'Введите электронную почту'
                : 'Введіть електронну пошту'
            }
            value={formData.email}
            onChange={handleChange}
          />

          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="login-password">
            {lang === 'ru' ? 'Пароль' : 'Пароль'} <span>*</span>
          </label>

          <input
            id="login-password"
            type="password"
            name="password"
            placeholder={lang === 'ru' ? 'Введите пароль' : 'Введіть пароль'}
            value={formData.password}
            onChange={handleChange}
          />

          {errors.password && (
            <div className="field-error">{errors.password}</div>
          )}
        </div>

        <div className="remember-forgot-row">
          <label className="remember-me">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
            />
            <span>
              {lang === 'ru' ? 'Запомнить меня' : "Запам'ятати мене"}
            </span>
          </label>

          <button
            type="button"
            className="forgot-password"
            onClick={setIsForgorPassword}
          >
            {lang === 'ru' ? 'Забыли пароль?' : 'Забули пароль?'}
          </button>
        </div>

        {error && <div className="main-error">{error}</div>}

        <button className="button-log-in" onClick={handleSubmitLogin}>
          {lang === 'ru' ? 'Войти' : 'Увійти'}
        </button>

        <div className="no-account">
          {lang === 'ru' ? 'Еще нет аккаунта?' : 'Ще немає акаунту?'}
          <button className="register" onClick={onRegisterModal}>
            {lang === 'ru' ? 'Зарегистрироваться' : 'Зареєструватися'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogIn;