const nodemailer = require('nodemailer');

// Ініціалізуємо транспорт один раз на рівні модуля
const transporter = nodemailer.createTransport({
  host: 'mail.adm.tools', // надійний прямий хост поштового сервера
  port: 465,
  secure: true, // SSL
  auth: {
    user: process.env.GMAIL_USER_SEND,
    pass: process.env.GMAIL_PASS,
  },
  pool: true, // повторне використання з'єднань для швидкості
});

// Функція для надсилання повідомлення на пошту
const sendEmail = async (to, messageHtml, subject) => {
  try {
    const mailOptions = {
      from: `"vlasmarket.com.ua - інтернет магазин" <${process.env.GMAIL_USER_SEND}>`,
      to,
      subject,
      html: messageHtml,
    };

    await transporter.sendMail(mailOptions);
    console.log('Лист успішно надіслано на:', to);

    return {
      status: 200,
      message: 'Лист успішно надіслано',
    };
  } catch (error) {
    console.error('Помилка відправлення на пошту:', error);

    if (error.response && error.response.code === 550) {
      return {
        status: 404,
        message: 'Електронна адреса отримувача не знайдена',
      };
    }

    return {
      status: 500,
      message: `Помилка під час надсилання листа: ${error.message}`,
    };
  }
};

module.exports = sendEmail;
