'use client';
import React, { useState } from 'react';
import CloseSVG from '../../assest/Goods/Close.svg';
import './LogIn.scss';
import FacebookSVG from '../../assest/Header/Facebook.svg';
import { Locale } from '@/i18n.config';
import { $authHost } from '@/app/http';
import { useDispatch } from 'react-redux';
import { setToken } from '@/app/store/reducers/userReducers';
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginButton from './GoogleAuth';

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
        if (res.status == 200) {
          dispatch(setToken(res.data.token));
          onSubmit(formData);
          close();
        } else {
          setError('error');
        }
      } catch (err: any) {
        setError(err.response.data.message.message);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    console.log(formData);
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    if (!formData.email) errors.email = 'Електронна пошта обов’язкова';
    if (!formData.password) errors.password = 'Пароль обов’язковий';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="logIn-container">
      <div className="log-in">
        <div className="row">
          <h3>Увійти</h3>
          <div onClick={close} className="close">
            <CloseSVG />
          </div>
        </div>
        <label>Електронна пошта</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
        <br />
        <label>Пароль</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <div
          style={{
            margin: '12.5px 0',
            gap: '5px',
            justifyContent: 'left',
          }}
          className="row"
        >
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <span>Запам’ятати мене</span>
        </div>
        <div className="line" />
        {error && (
          <div style={{ marginTop: '10px', color: 'red' }}>{error}</div>
        )}
        <div
          style={{
            margin: '12.5px 0',
          }}
          className="row"
        >
          <div className="forgot-password" onClick={setIsForgorPassword}>
            Забули пароль?
          </div>
          <button className="button-log-in" onClick={handleSubmitLogin}>
            Увійти
          </button>
        </div>
        <button className="register" onClick={onRegisterModal}>
          Зареєструватися
        </button>
        {/*<GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
        >
          <GoogleLoginButton />
        </GoogleOAuthProvider>*/}
      </div>
    </div>
  );
};

export default LogIn;
