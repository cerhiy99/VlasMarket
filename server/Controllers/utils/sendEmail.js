const nodemailer = require('nodemailer');

// Функція для надсилання повідомлення на пошту
const sendEmail = async (to, messageHtml, subject) => {
  try {
    // Налаштування транспорту (використовуємо Gmail)
    const transporter = nodemailer.createTransport({
      host: 'mail.baylap.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER_SEND,
        pass: process.env.GMAIL_PASS,
      },
      tls: {
        // Відключення перевірки сертифіката.
        // Використовуйте тільки якщо ви довіряєте серверу.
        rejectUnauthorized: false,
      },
    });

    // Параметри електронного листа
    const mailOptions = {
      from: `"Baylap - інтернет магазин" <${process.env.GMAIL_USER_SEND}>`, // Від кого
      to, // Кому надсилаємо
      subject, // Тема листа
      html: messageHtml, // HTML-контент листа
    };

    // Відправка листа
    await transporter.sendMail(mailOptions);

    // Якщо лист успішно надіслано
    return {
      status: 200,
      message: 'Лист успішно надіслано',
    };
  } catch (error) {
    console.log('Помилка відправлення на пошту', error);
    // Визначаємо, який тип помилки стався
    if (error.response && error.response.code === 550) {
      return {
        status: 404,
        message: 'Електронна адреса отримувача не знайдена',
      };
    }
    // Якщо виникла інша помилка
    return {
      status: 500,
      message: `Помилка під час надсилання листа: ${error.message}`,
    };
  }
};

module.exports = sendEmail;
