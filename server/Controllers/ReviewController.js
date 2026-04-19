const svgCaptcha = require('svg-captcha');
const { Reviews, Goods, Volume, Img, Users } = require('../models/models');
const ErrorApi = require('../error/ErrorApi');
const { Op } = require('sequelize');

// Простий глобальний стор для капч
const captchaStore = new Map();

class ReviewController {
  static UpdateMyOrder = async (req, resp, next) => {
    try {
      const userId = req.user.id;
      const { orderId } = req.params;
      const { newDescription } = req.body;
      const review = await Reviews.findOne({ where: { id: parseInt(orderId) } });
      if (!review) {
        return next(ErrorApi.badRequest('Відгук не знайдено'));
      }
      if (review.userId == userId) {
        review.description = newDescription;
        await review.save();
        await resp.json();
      } else {
        return next(ErrorApi.badRequest());
      }
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static DeleteMyOrder = async (req, resp, next) => {
    try {
      const userId = req.user.id;
      const { orderId } = req.body;
      const review = await Reviews.findOne({ where: { id: orderId } });
      if (review.userId == userId) {
        await review.destroy();
        return resp.json();
      } else return next(ErrorApi.badRequest(err));
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetMyComment = async (req, resp, next) => {
    try {
      let { page, limit } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      const userId = req.user.id;
      const offset = (page - 1) * limit;

      const reviews = await Reviews.findAll({
        where: { userId, reviewId: { [Op.ne]: null }, isShow: true },
        offset,
        limit,
        include: [
          {
            model: Goods,
            attributes: ['id', 'nameuk', 'nameru'],
            include: [
              {
                model: Volume,
                attributes: ['id', 'url'],
                include: [
                  {
                    model: Img,
                  },
                ],
              },
              {
                model: Reviews,
                attributes: ['id', 'rating'],
              },
            ],
          },
          {
            model: Reviews,
            as: 'Parent',
            include: [
              {
                model: Users,
                attributes: ['id', 'name', 'surname'],
              },
            ],
          },
        ],
      });
      const reviewsCount = (
        await Reviews.findAll({
          where: { userId, reviewId: { [Op.ne]: null }, isShow: true },
          attributes: ['id'],
        })
      ).length;
      const countPages = Math.ceil(reviewsCount / limit);
      return resp.json({ reviews, countPages });
    } catch (err) {
      console.log(434, err);
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetMyReview = async (req, resp, next) => {
    try {
      let { page, limit } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      const userId = req.user.id;
      const offset = (page - 1) * limit;

      const reviews = await Reviews.findAll({
        where: { userId, reviewId: null, isShow: true },
        offset,
        limit,
        include: [
          {
            model: Goods,
            attributes: ['id', 'nameuk', 'nameru'],
            include: [
              {
                model: Volume,
                attributes: ['id', 'url'],
                include: [
                  {
                    model: Img,
                  },
                ],
              },
              {
                model: Reviews,
                attributes: ['id', 'rating'],
              },
            ],
          },
        ],
      });
      const reviewsCount = (
        await Reviews.findAll({
          where: { userId, reviewId: null, isShow: true },
          attributes: ['id'],
        })
      ).length;
      const countPages = Math.ceil(reviewsCount / limit);
      return resp.json({ reviews, countPages });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static StartWriteCaptcha = async (req, resp, next) => {
    try {
      const userId = req.user.id;
      const { goodsId } = req.body; // якщо потрібно, можна використовувати

      // Генеруємо капчу
      const captcha = svgCaptcha.create({
        size: 5,
        noise: 2,
        color: true,
        ignoreChars: '0o1il', // щоб було легше вводити
      });

      // Зберігаємо текст капчі в нижньому регістрі у Map
      captchaStore.set(userId, captcha.text.toLowerCase());

      // Через 5 хв видаляємо, щоб не захаращувати пам'ять
      setTimeout(
        () => {
          captchaStore.delete(userId);
        },
        5 * 60 * 1000
      );

      // Віддаємо svg картинку в тілі відповіді
      resp.type('svg');
      resp.status(200).send(captcha.data);
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };

  // Метод для перевірки капчі при відправці відгуку
  static CheckCaptchaAndSaveReview = async (req, resp, next) => {
    try {
      const userId = req.user.id;
      const { name, surname } = req.user;
      const { captchaText, comment, goodsId, reviewId, rating } = req.body;

      const expected = captchaStore.get(userId);

      if (!expected || expected !== captchaText.toLowerCase()) {
        return resp.status(250).json({ message: 'Невірна капча' });
      }
      // Капча використана, видаляємо
      captchaStore.delete(userId);
      const review = await Reviews.create({
        nameUser: name + ' ' + surname,
        description: comment,
        rating: rating,
        userId,
        reviewId,
        goodsId,
      });

      // TODO: Логіка збереження відгуку в базу
      // Наприклад:
      // await ReviewModel.create({ userId, goodsId, comment, ... })

      resp.status(200).json({ message: 'Відгук успішно збережено' });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetAllReviews = async (req, resp, next) => {
    try {
      let { page = 1, limit } = req.query;
      page = parseInt(page);
      limit = parseInt(limit || 20);
      const offset = (page - 1) * limit;
      const reviews = await Reviews.findAndCountAll({
        limit,
        offset,
        include: [
          {
            model: Goods,
            attributes: ['nameuk', 'nameru'],
            include: [
              {
                model: Volume,
                attributes: ['id', 'url'],
              },
            ],
          },
        ],
      });
      const res = reviews.rows.map((x) => ({
        id: x.id,
        text: x.description,
        author: x.nameUser,
        rating: x.rating,
        published: x.good.nameru,
        date: new Date(x.createdAt)
          .toLocaleString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
          .replace(',', ' |'),
        good: x.good,
        isShow: x.isShow,
      }));
      return resp.json({ res, count: reviews.count });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static UpdateStatus = async (req, resp, next) => {
    try {
      const { status, ides } = req.body;
      for (let i = 0; i < ides.length; i++) {
        if (status == 'del') {
          await Reviews.destroy({ where: { id: ides[i] } });
        } else {
          await Reviews.update(
            {
              isShow: status == 'show' ? true : false,
            },
            { where: { id: ides[i] } } // <-- тут виправлено
          );
        }
      }
      return resp.json();
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
}

module.exports = ReviewController;
