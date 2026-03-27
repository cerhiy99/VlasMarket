'use client';

import { $host } from '@/app/http';
import { jwtDecode } from 'jwt-decode';
import React, { use, useEffect, useState } from 'react';
import '../ForgotPassword.scss';
import { useTranslation } from '@/context/TranslationProvider';

const ResetPasswordPage = ({ params }: { params: Promise<{ token: string }> }) => {
  const { token } = use(params);
  const { t } = useTranslation();
  const [expired, setExpired] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const decoded: any = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp < now) {
        setExpired(true);
      }
    } catch (err) {
      setExpired(true);
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t('forgorPass.error') as string);
      return;
    }

    try {
      setLoading(true);
      await $host.post('user/reset-password', {
        token,
        password,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(t('error') as string);
    } finally {
      setLoading(false);
    }
  };

  if (expired) {
    return (
      <div className="reset-password-container expired">
        <h1>{t('forgorPass.falseUrl')}</h1>
        <p>{t('forgorPass.falseUrlDescription')}</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="reset-password-container success">
        <h1>{t('forgorPass.trueTitle')}</h1>
        <p>{t('forgorPass.trueDescription')}</p>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <h1>{t('forgorPass.title')}</h1>
      <form onSubmit={handleSubmit} className="reset-password-form">
        <label>
          {t('forgorPass.newPassword')}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder={t('forgorPass.writeNew') as string}
          />
        </label>

        <label>
          {t('forgorPass.comfirmPass')}
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder={t('forgorPass.writeNew2') as string}
          />
        </label>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? t('forgorPass.downoload') : t('forgorPass.savePassword')}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
