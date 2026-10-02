const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: '127.0.0.1',
  port: 25,
  secure: false,
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = async (to, messageHtml, subject) => {
  try {
    const mailOptions = {
      from: `"vlasmarket.com.ua - інтернет магазин" <${process.env.MAIL_USER}>`,
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
