const path = require('path');
const ErrorApi = require('../error/ErrorApi');
const uuid = require('uuid');
const { Blog } = require('../models/models');
const { Op, where } = require('sequelize');

class BlogController {
  static AddBlog = async (req, resp, next) => {
    try {
      const { url, nameuk, nameru, descriptionuk, descriptionru } = req.body;
      const { img } = req.files;

      // Перевірка наявності всіх необхідних даних
      if (
        !url ||
        !nameuk ||
        !nameru ||
        !descriptionuk ||
        !descriptionru ||
        !img
      ) {
        return next(
          ErrorApi.badRequest("Не всі обов'язкові поля були надані.")
        );
      }

      // Перевірка формату файлу (наприклад, лише зображення)
      if (!img.mimetype.startsWith('image/')) {
        return next(ErrorApi.badRequest('Файл повинен бути зображенням.'));
      }

      const imageName = uuid.v4() + '.png';
      const imagePath = path.resolve(__dirname, '..', 'static', imageName);

      // Використовуємо async/await для завантаження файлу
      await img.mv(imagePath);

      const res = await Blog.create({
        url,
        nameuk,
        nameru,
        descriptionru,
        descriptionuk,
        img: imageName,
      });

      return resp.json({ res });
    } catch (err) {
      // Більш деталізована обробка помилок
      if (err instanceof ErrorApi) {
        return next(err); // Якщо це вже наша кастомна помилка, передаємо її
      }
      // Якщо це помилка Sequelize або інша, повертаємо Bad Request з повідомленням
      return next(
        ErrorApi.badRequest(`Помилка під час створення запису: ${err.message}`)
      );
    }
  };
  static Get = async (req, resp, next) => {
    try {
      let { page = '1', limit = '20' } = req.query;

      // Перетворюємо в числа
      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // Обчислюємо зсув
      const offset = (pageNum - 1) * limitNum;

      // Отримуємо дані з пагінацією
      const { rows, count } = await Blog.findAndCountAll({
        limit: limitNum,
        offset: offset,
        order: [['createdAt', 'DESC']], // сортування за датою створення
      });

      // Загальна кількість сторінок
      const totalPages = Math.ceil(count / limitNum);

      return resp.json({
        blog: rows,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalPages,
          totalItems: count,
        },
      });
    } catch (err) {
      return next(
        ErrorApi.badRequest(`Помилка отримання блогу: ${err.message || err}`)
      );
    }
  };
  static GetOne = async (req, resp, next) => {
    try {
      const { url } = req.params;
      const res = await Blog.findOne({ where: { url }, raw: true });

      const otherBlog = await Blog.findAll({
        limit: 8,
        where: {
          id: { [Op.not]: res.id },
        },
        order: [['id', 'ASC']],
      });

      return resp.json({ blog: res, otherBlog });
    } catch (err) {
      console.log(err);
      return next(ErrorApi.badRequest(err));
    }
  };
  static Update = async (req, resp, next) => {
    try {
      const { url } = req.params;
      const { nameuk, nameru, descriptionuk, descriptionru } = req.body;
      let res;
      if (req.files && req.files.img) {
        const img = req.files.img;
        const imageName = uuid.v4() + '.png';
        const imagePath = path.resolve(__dirname, '..', 'static', imageName);
        // Використовуємо async/await для завантаження файлу
        await img.mv(imagePath);
        res = await Blog.update(
          { nameuk, nameru, descriptionuk, descriptionru, img: imageName },
          { where: { url } }
        );
      } else {
        res = await Blog.update(
          { nameuk, nameru, descriptionuk, descriptionru },
          { where: { url } }
        );
      }
      return resp.json({ res });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetPagesBlogFromSiteMap = async (req, resp, next) => {
    try {
      const blogs = await Blog.findAndCountAll({ attributes: ['id'] });
      return resp.json(Math.ceil(blogs.count / 20));
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetSelectBlogFromSiteMap = async (req, resp, next) => {
    try {
      const blogs = await Blog.findAll({ attributes: ['url'] });
      const res = blogs.map((x) => x.url);
      return resp.json(res);
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static Del = async (req, resp, next) => {
    try {
      const { id } = req.params;
      const res = await Blog.destroy({ where: { id: parseInt(id) } });
      return resp.json({ res });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
}

module.exports = BlogController;
