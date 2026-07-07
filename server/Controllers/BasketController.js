const jwt = require('jsonwebtoken');
const ErrorApi = require('../error/ErrorApi');
const { Basket, Users } = require('../models/models');

class BasketController {
  static AddOrCreateBasket = async (req, res, next) => {
    try {
      let { products, token, guestId, infoUser } = req.body;

      let basket;

      if (token) {
        const { id: userId } = jwt.verify(token, process.env.JWT_SECRET);

        basket = await Basket.findOne({
          where: { userId },
        });

        if (!basket) {
          basket = await Basket.create({
            userId,
            products,
            infoUser: infoUser ?? null,
          });
        } else {
          basket.products = products;

          if (infoUser != null) {
            basket.infoUser = {
              email: infoUser.email,
              name: infoUser.name,
              phone: infoUser.phone,
              address: infoUser.address,
            };
          }

          await basket.save();
        }
      } else {
        basket = await Basket.findOne({
          where: { guestId: guestId },
        });

        if (!basket) {
          basket = await Basket.create({
            guestId: guestId,
            products,
            infoUser: infoUser ?? null,
          });
        } else {
          basket.products = products;

          if (infoUser != null) {
            basket.infoUser = {
              email: infoUser.email,
              name: infoUser.name,
              phone: infoUser.phone,
              address: infoUser.address,
            };
          }

          await basket.save();
        }
      }
      return res.json(basket);
    } catch (err) {
      console.error('Error Basket AddOrCreateBasket', err);
      return next(ErrorApi.badRequest(err.message || err));
    }
  };

  static Get = async (req, res, next) => {
    try {
      let { limit = 10, page = 1 } = req.query;

      page = Number(page);
      limit = Number(limit);

      const offset = page * limit - limit;

      const result = await Basket.findAndCountAll({
        offset,
        limit,
        order: [['updatedAt', 'DESC']],
        include: [{ model: Users }],
      });

      return res.json({
        result: result.rows,
        count: result.count,
      });
    } catch (err) {
      console.error('Помилка отримати список кошиків.', err);
      return next(ErrorApi.badRequest(err.message));
    }
  };
}

module.exports = BasketController;
