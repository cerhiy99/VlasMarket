'use client';

import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './Cooperation.scss';
import { $host } from '@/app/http';

const FormCooperation = ({ dictionary }: { dictionary: any }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '380',
    message: '',
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const isValidEmail = /\S+@\S+\.\S+/.test(formData.email.trim());

    const isValid =
      formData.name.trim() !== '' &&
      formData.email.trim() !== '' &&
      isValidEmail &&
      formData.message.trim() !== '' &&
      formData.phone.trim().length >= 12;

    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhoneChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      phone: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    setSuccessMessage(null);
    setErrorMessage('');

    try {
      const message = `
${dictionary?.telegramTitle || 'Приветствую, VlasMarket! 🙌'}
${dictionary?.telegramSubtitle || 'С вашей компанией хотят сотрудничать. 🤑'}
${dictionary?.telegramName || "🏢 Ім'я поставщика:"} ${formData.name}
${dictionary?.telegramPhone || '📲 Номер телефона:'} +${formData.phone}
${dictionary?.telegramEmail || '📧 E-mail:'} ${formData.email}
${dictionary?.telegramMessage || '✍️ Сообщение:'} ${formData.message}
      `;

      const res = await $host.post('order/sendMessage', { message });

      if (res.data.ok) {
        setSuccessMessage(
          dictionary?.successMessage || 'Дякуємо, Ваше запитання надіслалось!'
        );

        setFormData({
          name: '',
          email: '',
          phone: '380',
          message: '',
        });

        setTimeout(() => {
          setSuccessMessage(null);
        }, 3000);
      } else {
        setErrorMessage(
          dictionary?.errorMessage || 'Сталася помилка, спробуйте пізніше'
        );
      }
    } catch (err) {
      console.error('Помилка при відправці форми:', err);
      setErrorMessage(
        dictionary?.errorMessage || 'Сталася помилка, спробуйте пізніше'
      );
    }
  };

  return (
    <div className="form-container block">
      <h3>
        {dictionary?.title || 'Заповніть форму, щоб розпочати співпрацю як постачальник'}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">
              {dictionary?.nameLabel || "Ім'я"} <span>*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={dictionary?.namePlaceholder || "Введіть ім'я"}
              required
            />
          </div>

          <div className="form-group phone-group">
            <label htmlFor="phone">
              {dictionary?.phoneLabel || 'Номер телефону'} <span>*</span>
            </label>

            <PhoneInput
              country="ua"
              value={formData.phone}
              onChange={handlePhoneChange}
              enableSearch={true}
              disableSearchIcon={true}
              countryCodeEditable={false}
              searchPlaceholder={dictionary?.phoneSearchPlaceholder || 'Пошук'}
              specialLabel=""
              inputProps={{
                name: 'phone',
                required: true,
                id: 'phone',
              }}
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="email">
            {dictionary?.emailLabel || 'Електронна пошта'} <span>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={
              dictionary?.emailPlaceholder || 'Введіть електронну пошту'
            }
            required
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="message">
            {dictionary?.messageLabel || 'Повідомлення'} <span>*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={
              dictionary?.messagePlaceholder || 'Введіть повідомлення'
            }
            required
          />
        </div>

        <button
          type="submit"
          className={`submit-btn ${isFormValid ? 'active' : ''}`}
          disabled={!isFormValid}
        >
          {dictionary?.send || 'Відправити'}
        </button>
      </form>

      {successMessage && (
        <p className="success-message success-message--success">
          {successMessage}
        </p>
      )}

      {errorMessage && (
        <p className="success-message success-message--error">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default FormCooperation;