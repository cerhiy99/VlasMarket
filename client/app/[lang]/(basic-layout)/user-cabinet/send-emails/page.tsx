'use client';
import React, { use, useEffect, useState } from 'react';
import './SendEmails.scss';
import { Locale } from '@/i18n.config';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store';
import { $authHost } from '@/app/http';

type Props = {
  params: Promise<{ lang: Locale }>;
};

const page = ({ params }: Props) => {
  const { user } = useSelector((state: RootState) => state.user);
  const { lang } = use(params);

  const getFormData = async () => {
    try {
      const res = await $authHost.get('user/getMy');
      const user = res.data.user;
      setFormData({
        emailSendAnswersReview: user.emailSendAnswersReview,
        emailSendRememberToReview: user.emailSendRememberToReview,
        emaildSendDiscount: user.emaildSendDiscount,
        emailSendProposion: user.emailSendProposion,
      });
    } catch (err) {
      console.log(545, err);
    }
  };

  useEffect(() => {
    getFormData();
  }, []);

  const [formData, setFormData] = useState({
    emailSendAnswersReview: false,
    emailSendRememberToReview: false,
    emaildSendDiscount: false,
    emailSendProposion: false,
  });

  const updateValue = async (value: any) => {
    try {
      const res = await $authHost.put('user/updateSendEmail', value);
    } catch (err) {
      alert('Помилка');
    }
  };

  return (
    <div className="send-emailes-container">
      <h1 className="send-emailes-title">
        {lang == 'ru' ? 'Рассылка на почту' : 'Розсилка на пошту'}
      </h1>

      <div className="send-emailes-info">
        <span className="send-emailes-label">
          {lang == 'ru' ? 'Email для сообщений' : 'Email для повідомлень'}
        </span>
        <p className="send-emailes-email">{user?.email}</p>
      </div>

      <div className="send-emailes-grid">
        <label className="send-emailes-card">
          <input
            onChange={(e) => {
              const value = {
                ...formData,
                emailSendAnswersReview: e.target.checked,
              };
              updateValue(value);
              setFormData(value);
            }}
            checked={formData.emailSendAnswersReview}
            type="checkbox"
          />
          <span className="send-emailes-checkmark"></span>

          <div className="send-emailes-card-content">
            <h3>
              {lang == 'ru'
                ? 'Ответы на ваши отзывы'
                : 'Відповіді на ваші відгуки'}
            </h3>
            <p>
              {lang == 'ru'
                ? 'Получайте уведомления об ответах'
                : 'Отримуйте сповіщення про відповіді'}
            </p>
          </div>
        </label>

        <label className="send-emailes-card">
          <input
            onChange={(e) => {
              const value = {
                ...formData,
                emailSendRememberToReview: e.target.checked,
              };
              updateValue(value);
              setFormData(value);
            }}
            checked={formData.emailSendRememberToReview}
            type="checkbox"
          />
          <span className="send-emailes-checkmark"></span>

          <div className="send-emailes-card-content">
            <h3>
              {lang == 'ru'
                ? 'Напоминание об отзыве'
                : 'Нагадування про відгук'}
            </h3>
            <p>
              {lang == 'ru'
                ? 'Письмо-напоминание после покупки'
                : 'Лист-нагадування після покупки'}
            </p>
          </div>
        </label>

        <label className="send-emailes-card">
          <input
            onChange={(e) => {
              const value = {
                ...formData,
                emaildSendDiscount: e.target.checked,
              };
              updateValue(value);
              setFormData(value);
            }}
            checked={formData.emaildSendDiscount}
            type="checkbox"
          />
          <span className="send-emailes-checkmark"></span>

          <div className="send-emailes-card-content">
            <h3>{lang == 'ru' ? 'Акции и скидки' : 'Акції та знижки'}</h3>
            <p>
              {lang == 'ru'
                ? 'Получайте уведомления об актуальных акциях и спецпредложениях'
                : 'Отримуйте повідомлення про актуальні акції та спеціальні пропозиції'}
            </p>
          </div>
        </label>

        <label className="send-emailes-card">
          <input
            onChange={(e) => {
              const value = {
                ...formData,
                emailSendProposion: e.target.checked,
              };
              updateValue(value);
              setFormData(value);
            }}
            checked={formData.emailSendProposion}
            type="checkbox"
          />
          <span className="send-emailes-checkmark"></span>

          <div className="send-emailes-card-content">
            <h3>
              {lang == 'ru'
                ? 'Новые выгодные предложения'
                : 'Нові вигідні пропозиції'}
            </h3>
            <p>
              {lang == 'ru'
                ? 'Будьте первыми, кто узнает о новинках и выгодных предложениях'
                : 'Будьте першими, хто дізнається про новинки та вигідні пропозиції'}
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default page;
