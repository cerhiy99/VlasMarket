'use client';

import { $host } from '@/app/http';
import { useTranslation } from '@/context/TranslationProvider';
import React, { useState, useEffect } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './AboutForm.scss';

const AboutForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let isValidEmail = true;
    if (formData.email) {
      isValidEmail =
        formData.email === '' || /\S+@\S+\.\S+/.test(formData.email);
    }
    const isValid =
      formData.name.trim() !== '' &&
      formData.phone.length === 12 &&
      formData.message.trim() !== '' &&
      isValidEmail;
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (value: string) => {
    setFormData({ ...formData, phone: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Приветствую! Пришло новое смс из формы «О НАС»‼️

👤 Имя: ${formData.name}
📲 Телефон: ${formData.phone}
📥 E-mail: ${formData.email}
✍️ Сообщение: ${formData.message}`;
    try {
      const res = await $host.post('order/sendMessage', { message });
      setSuccessMessage('Дякуємо, Ваше запитання надіслалось!');
      if (res.data.ok) {
        setSuccessMessage('Дякуємо, Ваше запитання надіслалось!');
        setTimeout(() => {
          setSuccessMessage(null);
          setFormData({ name: '', email: '', phone: '+380', message: '' });
        }, 3000);
      } else {
        setErrorMessage('Сталася помилка, спробуйте пізніше');
        console.error('Помилка при надсиланні в Telegram:', res.data);
      }
    } catch (err) {
      setErrorMessage('Сталася помилка, спробуйте пізніше');
      console.log(err);
    }
    // Показуємо повідомлення про успіх

    // Очищуємо форму
    setFormData({
      name: '',
      phone: '+380',
      email: '',
      message: '',
    });

    // Прибираємо повідомлення через 3 секунди
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };
  const { t } = useTranslation();
  return (
    <div className="about-form block">
      <h2>{t('aboutForm.title')}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            {t('aboutForm.name')}
            <span>*</span>
          </label>
          <input
            className="input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>
            {t('aboutForm.phone')} <span>*</span>
          </label>
          <PhoneInput
            country={'ua'}
            placeholder=""
            value={formData.phone}
            onChange={handlePhoneChange}
            inputProps={{
              name: 'phone',
              required: true,
              pattern:
                '^\\+380 \\(\\d{2}\\\\) \\d{3} \\d{2} \\d{2}$|^(?!\\+380).{7,20}$',
            }}
          />
        </div>

        <div>
          <label>E-mail</label>
          <input
            className="input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>
            {t('aboutForm.message')}
            <span>*</span>
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          className={isFormValid ? 'but-active' : ''}
          disabled={!isFormValid}
        >
          {t('aboutForm.send')}
        </button>
      </form>
      {/* Відображення повідомлення про успіх */}
      {successMessage && (
        <p style={{ color: 'green' }} className="success-message">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p style={{ color: 'red' }} className="success-message">
          {errorMessage}
        </p>
      )}{' '}
    </div>
  );
};

export default AboutForm;
