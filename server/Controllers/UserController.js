const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ErrorApi = require('../error/ErrorApi'); // припускаю, що є ErrorApi
const { Users, PersonalDate, Order, Goods, Volume, Img } = require('../models/models');
const dayjs = require('dayjs');
const sendEmail = require('./utils/sendEmail');

const secretKey = process.env.JWT_SECRET;

const generateJwt = async (id, email, adminAccess, name, surname, phone, isRemember = true) => {
  return jwt.sign({ id, email, adminAccess, name, surname, phone }, process.env.JWT_SECRET, {
    expiresIn: isRemember ? '1y' : '1h',
  });
};

class UserController {
  static Register = async (req, res, next) => {
    try {
      const { name, surname, phone, email, password } = req.body;
      // 1️⃣ Перевірка обов'язкових полів
      if (!email || !password) {
        return next(ErrorApi.badRequest('Email і пароль обов’язкові'));
      }

      // 2️⃣ Перевірка, чи користувач вже існує
      const candidate = await Users.findOne({ where: { email } });
      if (candidate) {
        return next(ErrorApi.badRequest('Користувач з таким email вже існує'));
      }

      // 3️⃣ Хешування пароля
      const hashedPassword = await bcrypt.hash(password, 10);

      // 4️⃣ Створення користувача
      const user = await Users.create({
        name,
        surname,
        phone,
        email,
        password: hashedPassword,
      });

      // 5️⃣ Генерація JWT токена
      const token = await generateJwt(
        user.id,
        user.email,
        user.adminAccess,
        user.name,
        user.surname,
        user.phone,
        true
      );

      // 6️⃣ Повернення токена у відповідь
      return res.json({ token });
    } catch (err) {
      return next(ErrorApi.badRequest(err.message));
    }
  };

  static Login = async (req, res, next) => {
    try {
      const { email, password, isRemember } = req.body;

      // 1️⃣ Перевірка наявності email і password
      if (!email || !password) {
        return next(ErrorApi.badRequest('Email і пароль обов’язкові'));
      }

      // 2️⃣ Перевірка, чи користувач існує в базі
      const user = await Users.findOne({ where: { email } });
      if (!user) {
        return next(ErrorApi.badRequest('Користувача з таким email не знайдено'));
      }

      // 3️⃣ Перевірка правильності пароля
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return next(ErrorApi.badRequest('Невірний пароль'));
      }
      // 4️⃣ Генерація JWT токена
      const token = await generateJwt(
        user.id,
        user.email,
        user.adminAccess,
        user.name,
        user.surname,
        user.phone,
        isRemember
      );

      // 5️⃣ Повернення токена в відповіді
      return res.json({ token });
    } catch (err) {
      return next(ErrorApi.badRequest(err.message));
    }
  };
  static Active = async (req, resp, next) => {
    try {
      return resp.json(200);
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetUsers = async (req, resp, next) => {
    try {
      const users = await Users.findAll({
        attributes: ['id', 'name', 'surname', 'email', 'phone', 'latestActivity', 'createdAt'],
      });
      const res = [];
      for (let i = 0; i < users.length; i++) {
        const orders = await Order.findAndCountAll({
          attributes: ['id', 'sum'],
          where: { userId: users[i].id, status: 'finish' },
        });
        const countOrders = orders.count;

        const sum = orders.rows.reduce((sum, x) => sum + x.sum, 0);

        const x = users[i];
        res.push({
          id: x.id,
          name: x.name + ' ' + x.surname,
          email: x.email,
          stayActive: dayjs(x.latestActivity).format('DD.MM.YYYY | HH:mm'),
          dateRegister: dayjs(x.createdAt).format('DD.MM.YYYY'),
          countOrders: countOrders,
          sumOrders: sum,
        });
      }

      const date = new Date();
      //date.
      return resp.json({ res });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };

  static setPersonalDate = async (req, resp, next) => {
    try {
      const {
        deliveryType,
        firstName,
        lastName,
        novaPoshtaApartment,
        novaPoshtaBuilding,
        novaPoshtaCityName,
        novaPoshtaCityRef,
        novaPoshtaStreet,
        novaPoshtaWarehouseName,
        novaPoshtaWarehouseRef,
        phone,
        ukrPoshtaCity,
        ukrPoshtaDepartment,
        ukrPoshtaRegion,
        token,
      } = req.body;

      const userId = req.user.id;

      // Оновлення користувача
      await Users.update(
        { name: firstName, surname: lastName, phone: phone },
        { where: { id: userId } }
      );
      const user = await Users.findOne({ where: { id: userId } });

      // Оновлення або створення адреси
      const existing = await PersonalDate.findOne({ where: { userId } });

      const payload = {
        id: user.id,
        email: user.email,
        adminAccess: user.adminAccess,
        name: user.name,
        surname: user.surname,
        phone: user.phone,
      };

      if (existing) {
        await existing.update({
          deliveryType,
          firstName,
          lastName,
          novaPoshtaApartment,
          novaPoshtaBuilding,
          novaPoshtaCityName,
          novaPoshtaStreet,
          novaPoshtaWarehouseName,
          novaPoshtaWarehouseRef,
          phone,
          ukrPoshtaCity,
          ukrPoshtaDepartment,
          ukrPoshtaRegion,
          novaPoshtaCityRef,
        });
      } else {
        await PersonalDate.create({
          userId,
          deliveryType,
          firstName,
          lastName,
          novaPoshtaApartment,
          novaPoshtaBuilding,
          novaPoshtaCityName,
          novaPoshtaStreet,
          novaPoshtaWarehouseName,
          novaPoshtaWarehouseRef,
          phone,
          ukrPoshtaCity,
          ukrPoshtaDepartment,
          ukrPoshtaRegion,
          novaPoshtaCityRef,
        });
      }

      // Отримати TTL зі старого токена
      const decoded = jwt.decode(token);
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = decoded.exp - now;

      if (timeLeft <= 0) {
        return next(ErrorApi.unauthorized('Термін дії токена завершено'));
      }

      // Створити новий токен з тим же часом життя
      const newToken = jwt.sign(payload, secretKey, { expiresIn: timeLeft });

      return resp.json({
        message: 'Особисті дані збережено',
        token: newToken,
      });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };

  static getPersonal = async (req, resp, next) => {
    try {
      const userId = req.user.id;
      const personal = await PersonalDate.findOne({ where: { userId } });
      return resp.json({ personal });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static getPersonalDiscountAndOrders = async (req, resp, next) => {
    try {
      const userId = req.user.id;
      const res = await Order.findAll({
        attributes: ['id', 'sum'],
        where: { userId, status: 'finish' },
      });
      const sum = res.reduce((sum, x) => sum + x.sum, 0);
      let procent = 0;
      if (sum >= 10000) procent = 3;
      else if (sum >= 25000) procent = 5;
      else if (sum >= 50000) procent = 7;
      return resp.json({ sum, procent, orderCount: res.length });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static getPersonalDiscount = async (req, resp, next) => {
    try {
      const userId = req.user.id;
      const res = await Order.findAll({
        attributes: ['id', 'sum'],
        where: { userId, status: 'finish' },
      });
      const sum = res.reduce((sum, x) => sum + x.sum, 0);
      let procent = 0;
      if (sum >= 10000) procent = 3;
      else if (sum >= 25000) procent = 5;
      else if (sum >= 50000) procent = 7;
      return resp.json({ sum, procent });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static ForgotPassword = async (req, resp, next) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ where: { email } });

      if (!user) {
        return resp.status(239).json({ message: 'Email не знайдено' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });

      const resetUrl = `${process.env.FRONTEND_URL}/ua/forgot-password/${token}`;

      const subject = 'Скидання паролю на Baylap';

      const htmlMessage = `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f6f6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #333333;">Скидання паролю</h2>
            <p style="font-size: 16px; color: #555555;">
              Ви отримали цей лист, тому що для вашого облікового запису на <strong>Baylap</strong> був надісланий запит на скидання паролю.
            </p>
            <p style="font-size: 16px; color: #555555;">
              Щоб встановити новий пароль, натисніть на кнопку нижче:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #107bb1; color: white; text-decoration: none; padding: 12px 20px; border-radius: 5px; font-size: 16px;">
                Скинути пароль
              </a>
            </div>
            <p style="font-size: 14px; color: #888888;">
              Якщо ви не надсилали запит на скидання паролю, просто проігноруйте цей лист.
            </p>
            <p style="font-size: 14px; color: #cccccc; text-align: center; margin-top: 30px;">
              © ${new Date().getFullYear()} Baylap. Усі права захищено.
            </p>
          </div>
        </div>
      `;

      // Виклик функції відправки пошти
      await sendEmail(email, htmlMessage, subject);

      return resp.status(200).json({ message: 'Інструкції надіслано на email' });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static ResetPassword = async (req, resp, next) => {
    try {
      const { password, token } = req.body;

      // 1️⃣ Перевірка, чи є новий пароль
      if (!password) {
        return next(ErrorApi.badRequest('Новий пароль обов’язковий'));
      }

      // 2️⃣ Перевірка то кена
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return resp.status(401).json({ message: 'Термін дії посилання минув або воно недійсне' });
      }

      // 3️⃣ Пошук користувача по ID
      const user = await Users.findByPk(decoded.id);
      if (!user) {
        return resp.status(404).json({ message: 'Користувача не знайдено' });
      }

      // 4️⃣ Хешування нового пароля
      const hashedPassword = await bcrypt.hash(password, 10);

      // 5️⃣ Оновлення пароля
      user.password = hashedPassword;
      await user.save();

      // 6️⃣ Успішна відповідь
      return resp.json({ message: 'Пароль успішно змінено' });
    } catch (err) {
      return next(ErrorApi.badRequest(err.message));
    }
  };

  static RepeatOrder = async (req, resp, next) => {
    try {
      const { orderId } = req.params;
      const order = await Order.findByPk(parseInt(orderId));
      const basket = JSON.parse(order.basket);
      const newBasket = [];
      for (let i = 0; i < basket.length; i++) {
        try {
          const x = await Goods.findOne({
            where: { id: basket[i].id },
            attributes: ['id', 'nameuk', 'nameru', 'art'],
            include: [
              {
                model: Volume,
                where: { id: basket[i].volumes[0].id },
                include: [{ model: Img }],
              },
            ],
          });

          const goodsTrueFormat = {
            id: x.id,
            art: x.count,
            count: basket[i].count,
            nameuk: x.nameuk,
            nameru: x.nameru,
            volume: {
              discount: x.volumes[0].discount,
              id: x.volumes[0].id,
              isAvailability: x.volumes[0].isAvailability,
              price: x.volumes[0].price,
              priceWithDiscount: x.volumes[0].priceWithDiscount,
              volume: x.volumes[0].volume,
              img: x.volumes[0].imgs[0].img,
            },
          };
          newBasket.push(goodsTrueFormat);
        } catch (err) {
          console.log(err);
        }
      }

      return resp.json(newBasket);
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
}

module.exports = UserController;
