'use client';

import { $host } from '@/app/http';
import { jwtDecode } from 'jwt-decode';
import React, { use, useEffect, useState } from 'react';
import './ForgotPassword.scss';
import { useTranslation } from '@/context/TranslationProvider';
import NotFound from '@/app/not-found';
import { useSearchParams, useParams } from 'next/navigation';

const ResetPasswordPage = ({}: {}) => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { t } = useTranslation();

  const [expired, setExpired] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (!token) return;
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

  if (!token) return NotFound(); //тимчасово

  if (expired) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container expired">
          <h1>{t('forgorPass.falseUrl')}</h1>
          <p>{t('forgorPass.falseUrlDescription')}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container success">
          <h1>{t('forgorPass.trueTitle')}</h1>
          <p>{t('forgorPass.trueDescription')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h1>{t('forgorPass.title')}</h1>

        <form onSubmit={handleSubmit} className="reset-password-form">
          <div className="form-group">
            <label>
              {t('forgorPass.newPassword')} <span>*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder={t('forgorPass.writeNew') as string}
            />
          </div>

          <div className="form-group">
            <label>
              {t('forgorPass.comfirmPass')} <span>*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder={t('forgorPass.writeNew2') as string}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? t('forgorPass.downoload') : t('forgorPass.savePassword')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
