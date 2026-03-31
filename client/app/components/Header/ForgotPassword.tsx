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
        <label>
          Електронна пошта <span>*</span>
        </label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="email"
        />

        <br />
        <span>
          Вам надійде смс з посиланням для оновлення паролю, він буде дійсний
          годину.
        </span>
        <br />
        {message && (
          <>
            <div style={{ color: 'green' }}>{message}</div> <br />
          </>
        )}
        {error && (
          <>
            <div style={{ color: 'red' }}>{error}</div> <br />
          </>
        )}
        <div className="button-right">
          <button>Надіслати</button>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
