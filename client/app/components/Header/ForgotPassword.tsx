import React, { useState } from 'react';
import './FogotPassword.scss';
import CloseSVG from '../../assest/Goods/Close.svg';
import { $host } from '@/app/http';

type Props = {
  close: any;
};

const ForgotPassword = ({ close }: Props) => {
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
        setError('email не знайдено.');
      } else {
        setMeessage('Лист надійшов вам на пошту');
      }
    } catch (error) {
      setError('Сталася помилка, спробуйте пізніше.');
    }
  };

  return (
    <div className="forgot-password-container">
      <form onSubmit={send} className="forgot-password">
        <div className="row">
          <h3>Забули пароль</h3>
          <div onClick={close} className="close">
            <CloseSVG />
          </div>
        </div>

        <div className="form-group">
          <label>
            Електронна пошта <span>*</span>
          </label>

          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Введіть електронну пошту"
          />
        </div>

        <p className="forgot-password-text">
          Вам надійде смс з посиланням для оновлення паролю, він буде дійсний
          годину.
        </p>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="button-right">
          <button type="submit">Надіслати</button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;