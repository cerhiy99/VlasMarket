import React, { useState } from 'react';
import './FogotPassword.scss';
import CloseSVG from '../../assest/Goods/Close.svg';
import { $host } from '@/app/http';
import { Locale } from '@/i18n.config';

type Props = {
  close: any;
  lang: Locale;
};

const ForgotPassword = ({ close, lang }: Props) => {
  const [email, setEmail] = useState('');
  const [message, setMeessage] = useState('');
  const [error, setError] = useState('');

  const send = async (e: any) => {
    e.preventDefault();
    setError('');
    setMeessage('');

    try {
      const res = await $host.post('user/forgotPassword', { email });

      if (res.status == 239) {
        setError(lang == 'ru' ? 'email не найден.' : 'email не знайдено.');
      } else {
        setMeessage(
          lang == 'ru'
            ? 'Письмо пришло вам на почту'
            : 'Лист надійшов вам на пошту'
        );
      }
    } catch (error) {
      setError('Сталася помилка, спробуйте пізніше.');
    }
  };

  return (
    <div className="forgot-password-container">
      <form onSubmit={send} className="forgot-password">
        <div className="row">
          <h3>{lang == 'ru' ? 'Забыли пароль' : 'Забули пароль'}</h3>
          <div onClick={close} className="close">
            <CloseSVG />
          </div>
        </div>

        <div className="form-group">
          <label>
            {lang == 'ru' ? 'Электронная почта' : 'Електронна пошта'}{' '}
            <span>*</span>
          </label>

          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder={
              lang == 'ru'
                ? 'Введите электронную почту'
                : 'Введіть електронну пошту'
            }
          />
        </div>

        <p className="forgot-password-text">
          {lang == 'ru'
            ? 'Вам придет смс со ссылкой для обновления пароля, он будет настоящий час.'
            : 'Вам надійде смс з посиланням для оновлення паролю, він буде дійсний годину.'}
        </p>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="button-right">
          <button type="submit">
            {lang == 'ru' ? 'Отправить' : 'Надіслати'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
