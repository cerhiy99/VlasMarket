const ErrorApi = require('../error/ErrorApi');
const axios = require('axios');
const {
  Goods,
  Volume,
  Order,
  Img,
  Promokods,
  Users,
  UserBronPromokod,
} = require('../models/models');
const jwt = require('jsonwebtoken');
const sendEmail = require('./utils/sendEmail');
const { Op, literal } = require('sequelize');

const TELEGRAM_BOT_TOKEN = process.env.TG_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TG_CHAT_ID;
const MENEGER_TOKEN_ID = process.env.TG_MENEGER_TOKEN_ID;
const MENEGER_CHAT_ID = process.env.TG_MENEGER_CHAT_ID;

const listWayDelivery = [
  {
    id: 1,
    name: 'Оплата на рахунок IBAN або на картку',
    description: 'Очікую дзвінок для уточнення деталей',
  },
  {
    id: 2,
    name: 'Оплата на рахунок IBAN або на картку',
    description: 'Отримати SMS з реквізитами',
  },
  {
    id: 3,
    name: 'Накладений платіж (з передоплатою)',
    description: 'Очікую дзвінок для підтвердження',
  },
];
const FRONTEND_URL = process.env.FRONTEND_URL;
const IS_SEND = process.env.IS_SEND;

class OrderController {
  static NewFastOrder = async (req, resp, next) => {
    try {
      const { name, phone, realIdVolumeAndCountArray } = req.body;

      const basket = [];
      for (let i = 0; i < realIdVolumeAndCountArray.length; i++) {
        const product = await Goods.findOne({
          attributes: ['id', 'nameuk', 'nameru'],
          include: [
            {
              model: Volume,
              where: {
                id: parseInt(realIdVolumeAndCountArray[i].realIdVolume),
              },
              include: [
                {
                  model: Img,

                  raw: true,
                  nest: true,
                },
              ],
              raw: true,
              nest: true,
              required: true,
            },
          ],
          raw: true,
          nest: true,
        });

        if (product) {
          basket.push({
            ...product, // перетворюємо Sequelize model на звичайний об'єкт
            count: realIdVolumeAndCountArray[i].count,
          });
        }
      }

      const sum = basket.reduce(
        (acc, x) => (acc += x.volumes.priceWithDiscount * x.count),
        0
      );

      const message = `
      Користувач ${name} з мобільним телефоном ${phone} натиснув на швидке замовлення.
        
Товари на суму ${sum}
${basket.map(
  (x) => `
назва ${x.nameuk}
${FRONTEND_URL}/goods/${x.volumes.url}`
)}`;

      if (IS_SEND) {
        await axios.post(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML',
          }
        );

        sendEmail('info@baylap.com', message, 'Нове швидке замовлення.');
        sendEmail('7551991@gmail.com', message, `нове швидке замовлення`);
        sendEmail('664645@gmail.com', message, `нове швидке замовлення`);
      }
      /*const res = await Order.create({
        nameUser: name,
        email: '',
        sum,
        basket: JSON.stringify(basket),
        phone: '',
        deliveryType: '',
        city: '',
        comment: '',
        commentMeneger: '',
        oblast: '',
        typePay: '',
      });*/
      //sendEmail('cerhiy99@gmail.com', message, `нове швидке замовлення`);

      return resp.json({ ok: true });
    } catch (err) {
      console.log(4324, err);
      return next(ErrorApi.badRequest(err));
    }
  };

  static FastOrder = async (req, resp, next) => {
    try {
      const { name, phone, goodsID, idVolume, nameProduct, realIdVolume } =
        req.body;
      let basket = [];
      const product = await Goods.findOne({
        where: { id: parseInt(goodsID) },
        attributes: ['id', 'nameuk', 'nameru', 'art'],
        include: [
          {
            model: Volume,
            where: { id: parseInt(realIdVolume) },
            attributes: [
              'id',
              'nameVolume',
              'volume',
              'price',
              'discount',
              'priceWithDiscount',
              'isAvailability',
              'url',
              'art',
            ],
            include: [
              {
                model: Img,
              },
            ],
          },
        ],
      });

      if (product) {
        basket.push({
          ...product.toJSON(), // перетворюємо Sequelize model на звичайний об'єкт
          count: 1,
        });
      }

      const message = `
      Користувач ${name} з мобільним телефоном ${phone} натиснув на швидке замовлення.
        
Товар: ${nameProduct}
Посилання: ${FRONTEND_URL}/goods/${idVolume}`.trim();
      /*ID варіанту (volume): ${idVolume}
          `.trim();*/

      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }
      );

      const res = await Order.create({
        nameUser: name,
        email: '',
        contactInfo: `<p>Телефон:</p> 
<span>${phone}</span>
<p>Ф.И.О.:</p>
<span>${name}</span>
<p>Вариант доставки:</p>
<span>Швидке замовлення</span>
<p>Населений пункт:</p>
<span></span>
<p>відділення/поштомат:</p>
<span></span>
<p>тип оплати</p>
<span>Швидке замовлення</span>
<p>Комментарий:</p>
<span></span>`,
        sum: product.volumes[0].priceWithDiscount,
        basket: JSON.stringify(basket),
        phone: '',
        deliveryType: '',
        city: '',
        comment: '',
        commentMeneger: '',
        oblast: '',
        typePay: '',
      });

      sendEmail('info@baylap.com', message, 'Нове швидке замовлення.');
      sendEmail('7551991@gmail.com', message, `нове швидке замовлення`);
      sendEmail('664645@gmail.com', message, `нове швидке замовлення`);
      //sendEmail('cerhiy99@gmail.com', message, `нове швидке замовлення`);

      return resp.json({ ok: true });
    } catch (err) {
      console.log(4324, err);
      return next(ErrorApi.badRequest(err));
    }
  };

  static SetNewOrder = async (req, resp, next) => {
    try {
      const {
        nameUser,
        phone,
        email,
        basket,
        comment,
        deliveryType,
        typePay,
        oblast,
        city,
        departmentOrPostomatOrAddress,
        token,
        countBonus,
        promokod,
      } = await req.body;

      const realBasket = [];
      let additionalInfo = '';
      for (let i = 0; i < basket.length; i++) {
        const goods = await Goods.findOne({
          attributes: ['id', 'nameuk', 'nameru'],
          include: [
            {
              model: Volume,
              where: { id: basket[i].volume.id },
              include: [
                {
                  model: Img,
                  raw: true,
                  nest: true,
                },
              ],
              required: true,
              raw: true,
              nest: true,
            },
          ],
          raw: true,
          nest: true,
        });
        const goodsWithCount = { ...goods, count: basket[i].count };
        realBasket.push(goodsWithCount);
      }

      let sum = realBasket.reduce(
        (acc, x) => (acc += x.count * x.volumes.priceWithDiscount),
        0
      );
      const userGetBonus = realBasket.reduce(
        (acc, x) =>
          (acc += Math.floor(x.volumes.priceWithDiscount / 100) * x.count),
        0
      );

      let user;
      if (token) {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          user = await Users.findByPk(decoded.id);
          if (
            user.passwordUpdatedAt &&
            decoded.iat * 1000 < user.passwordUpdatedAt.getTime()
          ) {
            return resp.status(403).json({
              message: 'Не вірні дані акаунту, спробуйте вийти і увійти ще раз',
            });
          }
          Users.update(
            { latestActivity: literal('NOW()') },
            { where: { id: decoded.id } }
          );
        } catch (err) {
          return resp.status(403).json({
            message: 'Не вірні дані акаунту, спробуйте вийти і увійти ще раз',
          });
        }
      }

      let fullPromokod;
      if (promokod) {
        additionalInfo = 'Корисутвач використав промкод ' + promokod;
        fullPromokod = await Promokods.findOne({ where: { code: promokod } });
        if (!fullPromokod) {
          return resp
            .status(404)
            .json({ message: 'Промокод видалено або не знайдено' });
        }
        if (fullPromokod.min_price && sum < fullPromokod.min_price) {
          return resp.status(403).json({
            message: `Промокод діє від ${fullPromokod.min_price}, щоб його виористати добавте ще товарів на суму ${fullPromokod.min_price - sum}`,
          });
        }
        if (countBonus > 0) {
          return resp.status(403).json({
            message:
              'Не можна використовувати бонуси якщо використовується промокод',
          });
        }
        if (!token) {
          if (fullPromokod.countPromokods <= 0) {
            return resp
              .status(403)
              .json({ message: 'Промокод вже не дійсний' });
          }
          // якщо є токен то користувач авторизований і промокод за ним зарезервувася і кількість вже зняло
          fullPromokod.countPromokods = fullPromokod.countPromokods - 1;
          await fullPromokod.save();
        } else {
          const userBronPromokod = await UserBronPromokod.findOne({
            where: { userId: user.id, promokodId: fullPromokod.id },
          });
          if (userBronPromokod.isUse) {
            return resp.status(403).json({
              message:
                'Ви вже використовували цей промокод, його можна використати лише раз',
            });
          }
          userBronPromokod.isUse = true;
          await userBronPromokod.save();
        }
        if (
          fullPromokod.type == 'select_goods_discount_sum' ||
          fullPromokod.type == 'select_goods_discount_procent'
        ) {
          const productForDiscount = realBasket.find(
            (x) => x.volumes.art == fullPromokod.selectVolumeArt
          );
          if (!productForDiscount) {
            return resp.status(403).json({
              message: `Промокод діє для товара з артикулом ${fullPromokod.selectVolumeArt}, добавте цей товар в кошик, або не використовуйте промокод.`,
            });
          }
          const product = productForDiscount;
          const nameProductForPromokod = product.nameuk;
          const count = product.count;
          const price = product.volumes.priceWithDiscount;

          if (fullPromokod.type === 'select_goods_discount_sum') {
            const discountPerItem = fullPromokod.price_discount;

            const finalPricePerItem = Math.max(0, price - discountPerItem);
            const discountTotal = (price - finalPricePerItem) * count;

            sum -= discountTotal;

            additionalInfo += `<br>Користувач використав промокод на знижку товару ${nameProductForPromokod} по ${discountPerItem} грн за одиницю, знижка врахована в сумі`;
          } else {
            const percent = fullPromokod.procent;

            const discountPerItem = (price / 100) * percent;
            const finalPricePerItem = Math.max(0, price - discountPerItem);
            const discountTotal = (price - finalPricePerItem) * count;

            sum -= discountTotal;

            additionalInfo += `<br>Користувач використав промокод на знижку товару ${nameProductForPromokod} по ${percent}%, знижка врахована в сумі`;
          }
        } else if (fullPromokod.type === 'select_goods_free') {
          let product = realBasket.find(
            (x) => x.volumes.art === fullPromokod.selectVolumeArt
          );

          if (!product) {
            // ❗ треба підтягнути товар з БД
            const goods = await Goods.findOne({
              include: [
                {
                  model: Volume,
                  where: { art: fullPromokod.selectVolumeArt },
                  required: true,
                },
              ],
            });

            if (!goods) {
              return resp.status(403).json({ message: 'Товар не знайдено' });
            }

            product = { ...goods.dataValues, count: 1, isFree: true };
            realBasket.push(product);

            additionalInfo += `<br>Користувач отримав безкоштовний товар за промокодом (додано автоматично)`;
          } else {
            const price = product.volumes.priceWithDiscount;

            sum = Math.max(0, sum - price);

            additionalInfo += `<br>Користувач отримав 1 безкоштовний товар ${product.nameuk}`;
          }
        } else if (fullPromokod.type == 'procent') {
          additionalInfo += `<br>Користувач використав промокод на знижку -${fullPromokod.procent}%, в сумі знижка врахована`;
          sum = sum - (sum / 100) * fullPromokod.procent;
        } else {
          additionalInfo += `<br>Користувач використав промокод на знижку -${fullPromokod.price_discount} грн, в сумі знижка врахована`;
          sum = sum - fullPromokod.price_discount;
        }
      }
      if (countBonus > 0) {
        if (!token) {
          return resp.status(403).json({
            message: 'Не можна використовувати бонус якщо ви не авторизовані',
          });
        }
        const countAvaibleBonus = await this.GetCountAvailableBonusUser(
          user.id
        );
        if (countBonus > countAvaibleBonus) {
          return resp.status(403).json({
            message: 'Не можна використовувати більше бонусів ніж у вас є',
          });
        }
        if (sum / 2 < countBonus) {
          return resp.status(403).json({
            message:
              'Бонусами можна розрахуватися тільки вартість 50% свого замовленн',
          });
        }
        sum -= countBonus;
        additionalInfo += `Користувач розахувався бонусами в кількості ${countBonus}, знижка бонусів врахована у суму<br>`;
      }

      const order = await Order.create({
        nameUser: nameUser,
        email: email,
        sum: sum,
        basket: JSON.stringify(realBasket),
        phone: phone,
        comment: comment,
        deliveryType: deliveryType,
        countBonus: countBonus,
        typePay: typePay,
        oblast: oblast,
        city: city,
        departmentOrPostomatOrAddress: departmentOrPostomatOrAddress,
        userGetBonus: userGetBonus,
        promokodId: fullPromokod ? fullPromokod.id : null,
        userId: user ? user.id : null,
        additionalInfo,
      });

      resp.json({ order });

      const telegramMessage = `
📦 Нове замовлення

👤 Імʼя: ${nameUser}
📞 Телефон: ${phone}
📧 Email: ${email || '—'}

🚚 Доставка: ${deliveryType}
📍 Адреса: ${oblast}, ${city}, ${departmentOrPostomatOrAddress}

💳 Оплата: ${listWayDelivery.find((x) => x.id == typePay).name}
${listWayDelivery.find((x) => x.id == typePay).description}

🛒 Сума: ${sum} грн
🎁 Бонуси: ${countBonus || 0}
🏷 Промокод: ${promokod || '—'}

📝 Коментар: ${comment || '—'}

🧾 Товари:
${realBasket
  .map(
    (item) =>
      `- ${item.nameuk} × ${item.count} (${item.volumes.priceWithDiscount} грн)`
  )
  .join('\n')}

ℹ️ Додаткова інформація:
${additionalInfo || '—'}
`;
    } catch (err) {
      console.log('Помилка замовлення,', err);
      return next(ErrorApi.badRequest(err));
    }
  };

  //доступні бонуси
  static GetCountAvailableBonusUser = async (userId) => {
    try {
      // 🔹 1. check last order (365 days rule)
      const lastOrder = await Order.findOne({
        where: {
          userId,
          status: {
            [Op.ne]: 'cansel',
          },
        },
        order: [['createdAt', 'DESC']],
      });

      if (lastOrder) {
        const now = new Date();
        const lastDate = new Date(lastOrder.createdAt);

        const diffDays = (now - lastDate) / (1000 * 60 * 60 * 24);

        if (diffDays > 365) {
          return 0;
        }
      }

      // 🔹 2. 20 days rule
      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() - 20);

      const earnedBonus = await Order.sum('userGetBonus', {
        where: {
          userId,
          status: 'finish',
          createdAt: {
            [Op.lte]: limitDate,
          },
        },
      });

      const usedBonus = await Order.sum('countBonus', {
        where: {
          userId,
          status: {
            [Op.ne]: 'cansel',
          },
        },
      });

      const available = (earnedBonus || 0) - (usedBonus || 0);

      return available > 0 ? available : 0;
    } catch (err) {
      console.log('GetCountAvailableBonusUser error:', err);
      return 0;
    }
  };

  //Витрачено за весь час
  static GetCountSpentBonuses = async (userId) => {
    try {
      const usedBonus = await Order.sum('countBonus', {
        where: {
          userId,
          status: {
            [Op.ne]: 'cansel',
          },
          countBonus: {
            [Op.gt]: 0,
          },
        },
      });

      return usedBonus || 0;
    } catch (err) {
      console.log('GetCountSpentBonuses error:', err);
      return 0;
    }
  };

  //Очікують нарахування
  static GetCountPendingBonuses = async (userId) => {
    try {
      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() - 20);

      const pendingBonus = await Order.sum('userGetBonus', {
        where: {
          userId,
          status: {
            [Op.ne]: 'cansel',
          },
          createdAt: {
            [Op.gt]: limitDate, // ще НЕ пройшло 20 днів
          },
        },
      });

      return pendingBonus || 0;
    } catch (err) {
      console.log('GetCountPendingBonuses error:', err);
      return 0;
    }
  };

  //найближчs дні через які бонуси згорають
  static GetDaysUntilBonusExpire = async (userId) => {
    try {
      const { Op } = require('sequelize');

      const lastOrder = await Order.findOne({
        where: {
          userId,
          status: {
            [Op.ne]: 'cansel',
          },
        },
        order: [['createdAt', 'DESC']],
      });

      if (!lastOrder) return 0;

      const now = new Date();
      const lastDate = new Date(lastOrder.createdAt);

      const diffDays = (now - lastDate) / (1000 * 60 * 60 * 24);

      const daysLeft = 365 - diffDays;

      return daysLeft > 0 ? Math.ceil(daysLeft) : 0;
    } catch (err) {
      console.log('GetDaysUntilBonusExpire error:', err);
      return 0;
    }
  };

  static GetBonusFull = async (req, resp, next) => {
    try {
      const userId = req.user.id;

      const available = await this.GetCountAvailableBonusUser(userId); // доступні
      const pending = await this.GetCountPendingBonuses(userId); // очікують
      const spent = await this.GetCountSpentBonuses(userId); // витрачені
      const daysUntilExpire = await this.GetDaysUntilBonusExpire(userId); // до згорання

      return resp.json({
        available,
        pending,
        spent,
        daysUntilExpire,
      });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };

  static SetOrder = async (req, resp, next) => {
    try {
      let {
        surname,
        name,
        phone,
        delivery,
        comment,
        basket,
        typePay,
        token,
        email,
      } = req.body;

      const realProducts = await Promise.all(
        basket.map(async (item) => {
          const product = await Goods.findOne({
            where: { id: item.id },
            attributes: ['id', 'nameuk', 'nameru', 'art'],
            include: [
              {
                model: Volume,
                where: { id: item.volume.id },
                attributes: [
                  'id',
                  'nameVolume',
                  'volume',
                  'price',
                  'discount',
                  'priceWithDiscount',
                  'isAvailability',
                  'url',
                  'art',
                ],
                include: [
                  {
                    model: Img,
                  },
                ],
              },
            ],
          });

          if (product) {
            // додаємо count у повернений об'єкт
            return {
              ...product.toJSON(), // перетворюємо Sequelize model на звичайний об'єкт
              count: item.count,
            };
          }

          return null;
        })
      );

      // фільтруємо null, якщо якийсь товар не знайшовся
      const filteredProducts = realProducts.filter(
        (p) => p !== null && p.volumes.length > 0
      );

      let totalPrice = filteredProducts.reduce(
        (x, j) => x + j.volumes[0].priceWithDiscount * j.count,
        0
      );

      const payType =
        listWayDelivery.find((x) => x.id === typePay)?.name || 'Невідомо';
      const payTypeShort =
        listWayDelivery.find((x) => x.id === typePay)?.shortName || 'Невідомо';
      let deliveryText = '';
      let deliveryTextAdmin = '';
      let city = 'Не вказано';
      let typeDelivery = '';
      let oblast = '';

      if (delivery?.street) {
        // Кур'єр Нова Пошта
        typeDelivery = 'Курєр нова пошта';
        deliveryText = `🚚 Доставка кур'єром Нової Пошти у ${
          delivery?.selectLocality?.AreaDescription
        }, населений пункт: ${delivery?.selectLocality?.Description}, вул. ${
          delivery?.street
        }, буд. ${delivery?.house}${delivery?.apartment ? `, кв. ${delivery.apartment}` : ''}`;
        deliveryTextAdmin = `<p>Населений пункт</p>
<span>${delivery?.selectLocality?.Description}</span>
<p>Місто</p>
<span>${delivery.street}</span>
<p>буд</p>
<span>${delivery.house}</span>
<p>кв.</p>
<span>${delivery.apartment}</span>
`;
        city = delivery.selectLocality?.Description;
      } else if (delivery?.selectInfoDelivery) {
        // Відділення або поштомат НП
        const warehouseType =
          delivery?.selectInfoDelivery?.Description?.toLowerCase().includes(
            'поштомат'
          ) ||
          delivery?.selectInfoDelivery?.TypeOfWarehouse ===
            '5d8a980d-391c-11dd-90d9-001a92567626'
            ? 'поштомат Нової Пошти'
            : 'відділення Нової Пошти';
        typeDelivery = warehouseType;
        city = delivery?.selectLocality?.AreaDescription;
        deliveryText = `🚚 Доставка: ${warehouseType} у ${delivery?.selectLocality?.AreaDescription}, населений пункт: ${delivery?.selectLocality?.Description}, ${delivery?.selectInfoDelivery?.Description}`;
        deliveryTextAdmin = `<p>Населений пункт</p>
<span>${delivery?.selectLocality?.Description}</span>
<p>${warehouseType}</p>
<span>${delivery.selectInfoDelivery.Description}</span>
`;
      } else if (delivery?.oblast && delivery?.city && delivery?.departament) {
        // Укрпошта
        oblast = delivery.oblast;
        typeDelivery = 'Укр пошта';
        city = delivery.city;
        deliveryText = `🚚 Доставка Укрпоштою у ${delivery.oblast}, місто: ${delivery.city}, відділення №${delivery.departament}`;
        deliveryTextAdmin = `<p>Область</p>
        <span>${delivery.oblast}</span>
        <p>Місто</p>
        <span>${delivery.city}</span>
        <p>Відділення</p>
        <span>${delivery.departament}</span>`;
      }

      const basketText = filteredProducts
        .map((item, i) => {
          return `🏪 Кількість товару: (${item.count}) шт
🔗 Посилання на товар ${item.nameru}: ${FRONTEND_URL}/goods/${item.volumes[0].url}`;
        })
        .join('\n\n');

      const contactInfo = `<p>Телефон:</p> 
<span>${phone}</span>
<p>Ф.И.О.:</p>
<span>${name + ' ' + surname}</span>
<p>Вариант доставки:</p>
<span>${typeDelivery}</span>
${deliveryTextAdmin}
<p>тип оплати</p>
<span>${listWayDelivery.find((x) => x.name == payType).shortName}</span>
<p>Комментарий:</p>
<span>${comment}</span>
`;

      let userId = null;
      if (token) {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        userId = decode.id;
        const res = await Order.findAll({
          attributes: ['id', 'sum'],
          where: { userId, status: 'finish' },
        });
        const sum = res.reduce((sum, x) => sum + x.sum, 0);
        let procent = 0;
        if (sum >= 10000) procent = 3;
        else if (sum >= 25000) procent = 5;
        else if (sum >= 50000) procent = 7;
        totalPrice = totalPrice - (totalPrice * procent) / 100;
      }
      const res = await Order.create({
        nameUser: name + ' ' + surname,
        email,
        contactInfo,
        sum: totalPrice,
        basket: JSON.stringify(filteredProducts),
        userId,
        phone,
        deliveryType: typeDelivery,
        city,
        comment,
        typePay: payTypeShort,
      });

      const message = `
<b>ЗАКАЗ №${res.id}</b>

✍️ Надійшло нове замовлення на суму ${totalPrice} грн, від користувача:

😉 Прізвище: ${surname}
👤 Ім'я: ${name}
📲 Телефон: ${phone}

💳 Тип оплати: ${payType}

${deliveryText}
  
✍️ Повідомлення: ${comment || 'відсутнє'}
  
${basketText}


${process.env.FRONTEND_URL + `/ru/admin/orders/edit-order/${res.id}`}`;
      if (IS_SEND) {
        await axios.post(
          `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
          {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
            parse_mode: 'HTML',
          }
        );
      }

      const html = `
        <table style="width: 100%; border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'; background-color: #f4f4f4; padding: 20px;">
  <tr>
    <td align="center" style="padding: 0;">
      <table style="max-width: 600px; width: 100%; background-color: #ffffff; border-collapse: collapse; padding: 20px;">
        <tr>
          <td style="padding: 20px;">
            <table width="100%" style="border-collapse: collapse;">
              <tr>
                <td align="center" style="padding-bottom: 20px;">
                  <img src='https://baylap.com/image/logo.png' alt='logo' width='200px' height='auto' />
                </td>
              </tr>
              <tr>
                <td style="text-align: center;">
                  <h1 style="font-size: 24px; color: #333333; margin: 0; padding-bottom: 10px;">Чудово, все вийшло!</h1>
                  <p style="font-size: 16px; color: #555555; margin: 0;">
                    Замовлення <span style="font-weight: bold; color: #000000;">№${res.id}</span> прийняте і вже обробляється
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        
        <tr>
          <td style="padding: 0 20px 20px 20px;">
            <p style="font-size: 14px; color: #666666; line-height: 1.5; margin: 0;">
              Зовсім скоро менеджер зателефонує, щоб уточнити деталі, якщо товар в наявності. Якщо немає, то чекайте лист на пошту. А поки перевірте, чи нічого не забули купити, і якщо що — на сайті багато знижок.
            </p>
            <p style="font-size: 14px; color: #666666; line-height: 1.5; margin: 10px 0;">
              Також ви маєте змогу подивитися замовлення у вашому <a href="https://baylap.com/user-cabinet" style="color: #007bff; text-decoration: none;">кабінеті</a> після авторизації на сайті.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding: 0 20px 20px 20px;">
            <h2 style="font-size: 18px; color: #333333; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; margin: 0;">Деталі замовлення</h2>
            <table width="100%" style="border-collapse: collapse; font-size: 14px; color: #555555; line-height: 1.5;">
              <tr>
                <td style="padding: 8px 0;">Номер замовлення:</td>
                <td style="padding: 8px 0; text-align: right;">№${res.id}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">Створено:</td>
                <td style="padding: 8px 0; text-align: right;">${new Date().toLocaleString('uk-UA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">Отримувач:</td>
                <td style="padding: 8px 0; text-align: right;">${surname} ${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">Телефон для зв'язку:</td>
                <td style="padding: 8px 0; text-align: right;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">Місто:</td>
                <td style="padding: 8px 0; text-align: right;">${city}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">Варіант доставки:</td>
                <td style="padding: 8px 0; text-align: right;">${typeDelivery}</td>
              </tr>
              ${
                /*<tr>
                <td style="padding: 8px 0;">Відділення:</td>
                <td style="padding: 8px 0; text-align: right;">${delivery}</td>
              </tr>*/ ''
              }
              <tr>
                <td style="padding: 8px 0;">Коментар:</td>
                <td style="padding: 8px 0; text-align: right;">${comment}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">До сплати:</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold; color: #000000;">${totalPrice} грн.</td>
              </tr>
              <tr>
                <td style="padding: 8px 0;">Слідкувати за статусом:</td>
                <td style="padding: 8px 0; text-align: right;"><a href="https://baylap.com/user-cabinet/orders" style="color: #007bff; text-decoration: none;">Переглянути замовлення</a></td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding: 0 20px 20px 20px;">
            <h2 style="font-size: 18px; color: #333333; border-bottom: 1px solid #eeeeee; padding-bottom: 10px; margin: 0;">Деталі замовлення</h2>
            <table width="100%" style="border-collapse: collapse; font-size: 14px; color: #555555;">
              <thead>
                <tr style="background-color: #f8f8f8;">
                  <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eeeeee;">Товар</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 1px solid #eeeeee;">Ціна</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 1px solid #eeeeee;">Кількість</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 1px solid #eeeeee;">Разом</th>
                </tr>
              </thead>
              <tbody>
                ${filteredProducts
                  .map(
                    (product) => `
                <tr>
                  <td style="padding: 12px; text-align: left; border-bottom: 1px solid #eeeeee;">
                    <strong style="color: #000000;">${product.nameuk}</strong><br>
                  </td>
                  <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eeeeee;">${product.volumes[0].priceWithDiscount}</td>
                  <td style="padding: 12px; text-align: center; border-bottom: 1px solid #eeeeee;">${product.count}</td>
                  <td style="padding: 12px; text-align: right; border-bottom: 1px solid #eeeeee;">${product.count * product.volumes[0].priceWithDiscount}</td>
                </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding: 20px;">
            <h3 style="font-size: 16px; color: #333333; margin: 0 0 15px 0;">
              Якщо у Вас виникли будь-які питання, будь ласка, зв'яжіться з нами:
            </h3>
            <table width="100%" style="border-collapse: collapse; font-size: 14px; color: #555555;">
              <tr>
                <td style="padding: 5px 0;">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.99984 15H10.0082M5.83317 1.66669H14.1665C15.087 1.66669 15.8332 2.41288 15.8332 3.33335V16.6667C15.8332 17.5872 15.087 18.3334 14.1665 18.3334H5.83317C4.9127 18.3334 4.1665 17.5872 4.1665 16.6667V3.33335C4.1665 2.41288 4.9127 1.66669 5.83317 1.66669Z" stroke="black" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span style="vertical-align: middle; padding-left: 5px;">Viber / Telegram / WhatsApp: (093) 158-75-51</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.6665 16.6667H1.67484M5.83317 16.6667V13.3333M9.99984 16.6667V10M14.1665 16.6667V6.66668M18.3332 3.33334V16.6667" stroke="black" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span style="vertical-align: middle; padding-left: 5px;">Lifecell: (093) 158-75-51</span>
                </td>
              </tr>
              <tr>
                <td style="padding: 5px 0;">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_2015_4233)">
                  <path d="M9.99984 4.99999V9.99999L13.3332 11.6667M18.3332 9.99999C18.3332 14.6024 14.6022 18.3333 9.99984 18.3333C5.39746 18.3333 1.6665 14.6024 1.6665 9.99999C1.6665 5.39762 5.39746 1.66666 9.99984 1.66666C14.6022 1.66666 18.3332 5.39762 18.3332 9.99999Z" stroke="black" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                  </g>
                  <defs>
                  <clipPath id="clip0_2015_4233">
                  <rect width="20" height="20" fill="white"/>
                  </clipPath>
                  </defs>
                  </svg>
                  <span style="vertical-align: middle; padding-left: 5px;">Kyivstar: (067) 393-99-52 </span>
                </td>
              </tr>
            </table>
            <div style="text-align: right; margin-top: 15px;">
              <a href="" style="text-decoration: none; padding: 0 5px;"><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 37.5781C29.7081 37.5781 37.5781 29.7081 37.5781 20C37.5781 10.2919 29.7081 2.42188 20 2.42188C10.2919 2.42188 2.42188 10.2919 2.42188 20C2.42188 29.7081 10.2919 37.5781 20 37.5781Z" fill="url(#paint0_linear_2015_4237)"/>
<path d="M23.7344 10.2344H16.2734C12.9453 10.2344 10.2422 12.9375 10.2422 16.2656V23.7266C10.2422 27.0547 12.9453 29.7578 16.2734 29.7578H23.7344C27.0625 29.7578 29.7656 27.0547 29.7656 23.7266V16.2656C29.7656 12.9375 27.0625 10.2344 23.7344 10.2344ZM27.5859 23.7344C27.5859 25.8594 25.8594 27.5938 23.7266 27.5938H16.2656C14.1406 27.5938 12.4062 25.8672 12.4062 23.7344V16.2734C12.4062 14.1484 14.1328 12.4141 16.2656 12.4141H23.7266C25.8516 12.4141 27.5859 14.1406 27.5859 16.2734V23.7344Z" fill="white"/>
<path d="M20 15.0078C17.25 15.0078 15.0078 17.25 15.0078 20C15.0078 22.75 17.25 24.9922 20 24.9922C22.75 24.9922 24.9922 22.75 24.9922 20C24.9922 17.25 22.75 15.0078 20 15.0078ZM20 23.0312C18.3281 23.0312 16.9687 21.6719 16.9687 20C16.9687 18.3281 18.3281 16.9687 20 16.9687C21.6719 16.9687 23.0312 18.3281 23.0312 20C23.0312 21.6719 21.6719 23.0312 20 23.0312Z" fill="white"/>
<path d="M25.3731 15.5551C25.833 15.4802 26.1451 15.0467 26.0702 14.5867C25.9953 14.1268 25.5618 13.8147 25.1018 13.8896C24.6419 13.9645 24.3298 14.3981 24.4047 14.858C24.4796 15.3179 24.9131 15.63 25.3731 15.5551Z" fill="white"/>
<defs>
<linearGradient id="paint0_linear_2015_4237" x1="6.61555" y1="33.3845" x2="31.596" y2="8.40398" gradientUnits="userSpaceOnUse">
<stop stop-color="#FEE411"/>
<stop offset="0.052" stop-color="#FEDB16"/>
<stop offset="0.138" stop-color="#FEC125"/>
<stop offset="0.248" stop-color="#FE983D"/>
<stop offset="0.376" stop-color="#FE5F5E"/>
<stop offset="0.5" stop-color="#FE2181"/>
<stop offset="1" stop-color="#9000DC"/>
</linearGradient>
</defs>
</svg>
</a>
              <a href="https://t.me/Bay_Lap" style="text-decoration: none; padding: 0 5px;"><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M19.9999 37.58C29.7091 37.58 37.5799 29.7091 37.5799 20C37.5799 10.2908 29.7091 2.41998 19.9999 2.41998C10.2908 2.41998 2.41992 10.2908 2.41992 20C2.41992 29.7091 10.2908 37.58 19.9999 37.58Z" fill="url(#paint0_linear_2015_4244)"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M10.3779 19.8144C15.5028 17.5816 18.9203 16.1095 20.6301 15.3984C25.5123 13.3677 26.5268 13.015 27.188 13.0033C27.3334 13.0008 27.6586 13.0368 27.8692 13.2077C28.1817 13.4613 28.1834 14.0116 28.1488 14.3758C27.8842 17.1557 26.7394 23.9015 26.157 27.015C25.9105 28.3324 25.4253 28.7741 24.9556 28.8173C23.9347 28.9113 23.1595 28.1426 22.1707 27.4945C20.6234 26.4802 19.7493 25.8489 18.2474 24.8592C16.5117 23.7154 17.6369 23.0867 18.626 22.0593C18.8849 21.7905 23.383 17.6991 23.4701 17.3279C23.481 17.2815 23.4911 17.1084 23.3883 17.0171C23.2855 16.9258 23.1338 16.9569 23.0243 16.9818C22.8691 17.017 20.3973 18.6508 15.609 21.883C14.9074 22.3649 14.2719 22.5996 13.7025 22.5873C13.0748 22.5738 11.8674 22.2324 10.9698 21.9406C9.86885 21.5827 8.99383 21.3935 9.07006 20.7857C9.10975 20.4691 9.54568 20.1454 10.3779 19.8144Z" fill="white"/>
<defs>
<linearGradient id="paint0_linear_2015_4244" x1="19.9999" y1="2.41998" x2="19.9999" y2="37.3053" gradientUnits="userSpaceOnUse">
<stop stop-color="#2AABEE"/>
<stop offset="1" stop-color="#229ED9"/>
</linearGradient>
</defs>
</svg>
</a>
              <a href="" style="text-decoration: none; padding: 0 5px;"><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 37.5781C29.7081 37.5781 37.5781 29.7081 37.5781 20C37.5781 10.2919 29.7081 2.42188 20 2.42188C10.2919 2.42188 2.42188 10.2919 2.42188 20C2.42188 29.7081 10.2919 37.5781 20 37.5781Z" fill="#3B5999"/>
<path d="M25.0469 13.4453V10.2656C25.0469 10.2656 21.7969 10.2344 21.5781 10.2344C20.1094 10.2344 18 11.9062 18 13.8047V17.2109H14.9531V20.8203H17.9531V29.7656H21.5078V20.7734H24.6484L25.0469 17.25H21.5469V14.6641C21.5469 14.0391 22.0156 13.4375 22.7187 13.4375C23.1875 13.4219 25.0469 13.4453 25.0469 13.4453Z" fill="white"/>
</svg>
</a>
              <a href="" style="text-decoration: none; padding: 0 5px;"><svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M20 37.5781C29.7081 37.5781 37.5781 29.7081 37.5781 20C37.5781 10.2919 29.7081 2.42188 20 2.42188C10.2919 2.42188 2.42188 10.2919 2.42188 20C2.42188 29.7081 10.2919 37.5781 20 37.5781Z" fill="#E53935"/>
<path d="M26.2188 13.1953H13.7812C11.8281 13.1953 10.2344 14.7891 10.2344 16.7422V23.25C10.2344 25.2031 11.8281 26.7969 13.7812 26.7969H26.2188C28.1719 26.7969 29.7656 25.2031 29.7656 23.25V16.7422C29.7656 14.7969 28.1719 13.1953 26.2188 13.1953ZM20.5469 21.9219L17.5156 23.7969V16.2969L20.5469 18.1719L23.5781 20.0469L20.5469 21.9219Z" fill="white"/>
</svg>
</a>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
        `;
      const subject = `Ваше замовлення №${res.id} прийнято`;
      try {
        sendEmail(email, html, subject);
      } catch (err) {
        console.log('Помилка відправлення на пошту', err);
      }

      const basketTextToEmail = filteredProducts
        .map((item, i) => {
          return `🏪 Кількість товару: (${item.count}) шт<br>
🔗 Посилання на товар ${item.nameru}: ${FRONTEND_URL}/goods/${item.volumes[0].url}<br>`;
        })
        .join('<br><br>');

      const messageToEmail = `
<b>ЗАКАЗ №${res.id}</b><br><br>
✍️ Надійшло нове замовлення на суму ${totalPrice} грн, від користувача:<br><br>
😉 Прізвище: ${surname}<br>
👤 Ім'я: ${name}<br>
📲 Телефон: ${phone}<br><br>
💳 Тип оплати: ${payType}<br><br>
${deliveryText}<br><br>
✍️ Повідомлення: ${comment || 'відсутнє'}<br><br>
${basketTextToEmail}<br><br><br>
${process.env.FRONTEND_URL + `/ru/admin/orders/edit-order/${res.id}`}`;

      try {
        sendEmail(
          '7551991@gmail.com',
          messageToEmail,
          `нове замовлення №${res.id}`
        );
        sendEmail(
          '664645@gmail.com',
          messageToEmail,
          `нове замовлення №${res.id}`
        );
      } catch (err) {
        console.log('Помилка відправлення на пошту.', err);
      }

      return resp.json({ ok: true, res });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };

  static SendMessage = async (req, resp, next) => {
    try {
      const { message } = req.body;
      await axios.post(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }
      );
      return resp.json({ ok: true });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetOrders = async (req, resp, next) => {
    try {
      let { limit = 10, page = 1, status, startDate, finishDate } = req.query;

      const where = {};

      if (status) {
        where.status = status;
      }

      if (startDate || finishDate) {
        where.createdAt = {};

        if (startDate) {
          where.createdAt[Op.gte] = new Date(startDate);
        }

        if (finishDate) {
          where.createdAt[Op.lte] = new Date(finishDate + 'T23:59:59');
        }
      }

      limit = parseInt(limit) || 10;
      const offset = (page - 1) * limit;

      const res = await Order.findAndCountAll({
        limit,
        offset,
        order: [['id', 'DESC']],
        where,
      });

      const totalPages = Math.ceil(res.count / limit);

      return resp.json({ orders: res.rows, totalPages });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetOrdersMeneger = async (req, resp, next) => {
    try {
      let { limit = 10, page = 1 } = req.query;
      limit = parseInt(limit) || 10;
      const offset = (page - 1) * limit;
      const res = await Order.findAndCountAll({
        limit,
        offset,
        order: [['id', 'DESC']],
        where: { isToMeneger: true },
      });
      const totalPages = Math.ceil(res.count / limit);
      return resp.json({ orders: res.rows, totalPages });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetMyOrders = async (req, resp, next) => {
    try {
      const userId = req.user.id;
      const orders = await Order.findAll({ where: { userId } });
      return resp.json(orders);
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };

  static SetToMeneger = async (req, resp, next) => {
    try {
      const { orderId } = req.body;
      const order = await Order.findByPk(orderId);
      if (order.isToMeneger) {
        await Order.update(
          {
            isToMeneger: false,
          },
          {
            where: { id: orderId },
          }
        );
        return resp.json();
      }
      await Order.update(
        { isToMeneger: true }, // Дані для оновлення
        { where: { id: orderId } } // Умова
      );
      const res = await Order.findOne({ where: { id: orderId } });

      const basketText = JSON.parse(res.basket).map((item, i) => {
        return `
🏪 Кількість товару: (${item.count}) шт
🔗 Посилання на товар ${item.nameru}: ${FRONTEND_URL}/goods/${item.volumes.url}`;
      });

      const message = `<b>ЗАКАЗ №${res.id}</b>
      
  
✍️ Надійшло нове замовлення на суму ${res.sum} грн, від користувача:

👤 Ім'я: ${res.nameUser}
📲 Телефон: ${res.phone}
  
💳 Тип оплати: ${res.typePay}
  
${basketText}`;
      if (IS_SEND) {
        await axios.post(
          `https://api.telegram.org/bot${MENEGER_TOKEN_ID}/sendMessage`,
          {
            chat_id: MENEGER_CHAT_ID,
            text: message,
            parse_mode: 'HTML',
          }
        );
      }
      return resp.json(res);
    } catch (err) {
      console.log(434, err);
      return next(ErrorApi.badRequest(err));
    }
  };
  static SetStatus = async (req, resp, next) => {
    try {
      const { status, ides } = req.body;
      await Promise.all(
        ides.map((id) => Order.update({ status }, { where: { id } }))
      );
      return resp.json();
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static Getorder = async (req, resp, next) => {
    try {
      const { id } = req.params;
      const order = await Order.findOne({
        where: {
          id: parseInt(id),
        },
        include: [
          {
            model: Promokods,
          },
          {
            model: Users,
          },
        ],
      });
      return resp.json(order);
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetProductToOrder = async (req, resp, next) => {
    try {
      const { url } = req.query;
      const product = await Goods.findOne({
        attributes: ['id', 'nameru', 'nameuk'],
        include: [
          {
            model: Volume,
            where: {
              art: url,
            },
            raw: true,
            nest: true,
            required: true,
            include: [
              {
                model: Img,
                raw: true,
                nest: true,
              },
            ],
          },
        ],
        raw: true,
        nest: true,
      });
      return resp.json(product);
    } catch (err) {
      console.log(324, err);
      return next(ErrorApi.badRequest(err));
    }
  };
  static UpdateOrder = async (req, resp, next) => {
    try {
      const { id } = req.params;
      const updateOrderDate = req.body;
      const order = await Order.update(updateOrderDate, {
        where: { id: parseInt(id) },
      });
      resp.json(order);
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static AdminCreate = async (req, resp, next) => {
    try {
      const orderValue = req.body;
      const res = await Order.create(orderValue);
      return resp.json(res);
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static SetProcent = async (req, resp, next) => {
    try {
      const { orderId, procent } = req.body;
      const res = await Order.update({ procent }, { where: { id: orderId } });
      return resp.json({ res });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static async GetBonus(req, resp, next) {
    try {
      const { startBonusDate, finishBonusDate } = req.query;

      // Перевірка, що дати передані
      if (!startBonusDate || !finishBonusDate) {
        return next(
          ErrorApi.badRequest(
            'Необхідно вказати startBonusDate і finishBonusDate'
          )
        );
      }

      // Парсимо дати
      const startDate = new Date(startBonusDate);
      const finishDate = new Date(finishBonusDate);

      if (isNaN(startDate.getTime()) || isNaN(finishDate.getTime())) {
        return next(
          ErrorApi.badRequest(
            'Невірний формат дати. Використовуйте yyyy-mm-dd або ISO формат.'
          )
        );
      }

      // Підправляємо кінцеву дату, щоб включити весь день
      finishDate.setHours(23, 59, 59, 999);

      // Формуємо where
      const whereClause = {
        createdAt: {
          [Op.between]: [startDate, finishDate],
        },
        status: { [Op.not]: 'cansel' },
      };

      // Отримуємо замовлення за період
      const orders = await Order.findAll({
        where: whereClause,
        attributes: ['id', 'userId', 'sum', 'createdAt', 'status', 'procent'],
        order: [['createdAt', 'ASC']],
      });

      // Розрахунок бонусу
      const totalBonus = orders.reduce((acc, order) => {
        let procent = 0;
        if (order.isToMeneger) procent = 3;
        const sum = Number(order.sum) || 0;
        return acc + (sum * procent) / 100;
      }, 0);

      // Загальна сума замовлень
      const totalSum = orders.reduce(
        (acc, order) => acc + (Number(order.sum) || 0),
        0
      );

      return resp.json({
        success: true,
        count: orders.length,
        totalSum,
        totalBonus,
        orders,
      });
    } catch (err) {
      return next(
        ErrorApi.badRequest(err && err.message ? err.message : 'Unknown error')
      );
    }
  }
  static Delete = async (req, resp, next) => {
    try {
      const { id } = req.params;
      await Order.destroy({ where: { id: parseInt(id) } });
      return resp.json();
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetMyOrdersWithPagination = async (req, resp, next) => {
    try {
      const userId = req.user.id;
      let { page, limit } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);
      const offset = (page - 1) * limit;
      const orders = await Order.findAndCountAll({
        where: { userId },
        offset,
        limit,
        order: [['id', 'desc']],
      });
      return resp.json({ orders: orders.rows, count: orders.count });
    } catch (err) {
      console.log(4324, err);
      return next(ErrorApi.badRequest(err));
    }
  };
  static getCountUserBonnus = async (req, resp, next) => {
    try {
      const userId = req.user.id;
      const countBonus = await this.GetCountAvailableBonusUser(userId);
      return resp.json({ countBonus });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
}

module.exports = OrderController;
