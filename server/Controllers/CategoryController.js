const path = require('path');
const uuid = require('uuid');
const ErrorApi = require('../error/ErrorApi'); // Замініть на ваш шлях до ErrorApi
const {
  Category,
  CategoryTitle,
  Subcategory,
  Goods,
} = require('../models/models');
const fs = require('fs');

class CategoryController {
  static Add = async (req, resp, next) => {
    try {
      const { nameua, nameru } = req.body;

      // Перевірка полів
      if (!nameua || !nameru) {
        return next(
          ErrorApi.badRequest('Всі текстові поля повинні бути заповнені.'),
        );
      }

      let imageName = null;

      // Перевірка та збереження зображення
      if (req.files && req.files.image) {
        const image = req.files.image;
        // Отримуємо розширення файлу
        const ext = path.extname(image.name);
        // Перевірка підтримуваних форматів (опціонально)
        const allowedExt = ['.svg', '.png', '.jpg', '.jpeg', '.webp'];
        if (!allowedExt.includes(ext.toLowerCase())) {
          return next(
            ErrorApi.badRequest('Непідтримуваний формат зображення.'),
          );
        }

        // Генеруємо унікальне ім’я файлу
        imageName = uuid.v4() + ext;

        // Шлях до директорії збереження файлу
        const imagePath = path.resolve(__dirname, '..', 'static', imageName);
        // Зберігаємо файл
        await image.mv(imagePath);
      } else {
        return next(ErrorApi.badRequest("Зображення є обов'язковим."));
      }
      // Створюємо категорію
      const res = await Category.create({
        nameuk: nameua,
        nameru,
        svg: imageName, // або svg: imageName — як називається поле у вас
      });

      return resp.json({ res, message: 'Категорія успішно додана.' });
    } catch (err) {
      return next(ErrorApi.badRequest(err.message || 'Сталася помилка.'));
    }
  };
  static Update = async (req, resp, next) => {
    try {
      const { id } = req.params;
      const { nameua, nameru, descriptionuk, descriptionru } = req.body;

      if (!id || !nameua || !nameru) {
        return next(
          ErrorApi.badRequest('Всі текстові поля повинні бути заповнені.'),
        );
      }
      const category = await Category.findByPk(id);
      if (!category) {
        return next(ErrorApi.badRequest('Категорію не знайдено.'));
      }

      let imageName = category.svg;
      if (req.files && req.files.image) {
        const image = req.files.image;
        const ext = path.extname(image.name);
        const allowedExt = ['.svg', '.png', '.jpg', '.jpeg', '.webp'];

        if (!allowedExt.includes(ext.toLowerCase())) {
          return next(
            ErrorApi.badRequest('Непідтримуваний формат зображення.'),
          );
        }
        // Видаляємо старе зображення (якщо є)
        if (imageName) {
          const oldImagePath = path.resolve(
            __dirname,
            '..',
            'static',
            imageName,
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }

        // Зберігаємо нове зображення
        imageName = uuid.v4() + ext;
        const imagePath = path.resolve(__dirname, '..', 'static', imageName);
        await image.mv(imagePath);
      }
      await category.update({
        nameuk: nameua,
        nameru,
        descriptionuk,
        descriptionru,
        svg: imageName,
      });

      return resp.json({
        message: 'Категорія успішно оновлена.',
        data: category,
      });
    } catch (err) {
      return next(ErrorApi.badRequest(err.message || 'Сталася помилка.'));
    }
  };

  static Get = async (req, resp, next) => {
    try {
      const res = await Category.findAll({ order: [['sort', 'asc']] });
      return resp.json({ res });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetFull = async (req, resp, next) => {
    try {
      let { lang } = req.query;
      if (lang != 'ru') lang = 'uk';
      const category = await Category.findAll({
        order: [
          ['sort', 'asc'], // сортування категорій
          [Subcategory, `name${lang}`, 'asc'], // сортування підкатегорій по nameuk
        ],
        include: [
          {
            model: Subcategory,
          },
        ],
      });

      return resp.json({ category });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetCategoryAndSubcategoryWithProduct = async (req, resp, next) => {
    try {
      let { lang } = req.query;
      if (lang != 'ru') lang = 'uk';

      const categories = await Category.findAll({
        order: [['sort', 'ASC']],
        attributes: ['id', 'nameuk', 'nameru', 'svg'],

        include: [
          {
            model: Subcategory,
            required: true,
            attributes: ['id', 'nameuk', 'nameru', 'img'],
            order: [['sort', 'ASC']],

            include: [
              {
                model: Goods,
                required: true,
                paranoid: false,
                attributes: ['id'],
                where: {
                  isShow: true,
                },
              },
            ],
          },

          // 🔥 ВАЖЛИВО: цей include часто дублює фільтр → можна прибрати
          // якщо не потрібні прямі товари категорії
        ],
        distinct: true,
      });

      const result = categories
        .filter(cat => cat.subcategories?.length)
        .map(cat => ({
          id: cat.id,
          nameuk: cat.nameuk,
          nameru: cat.nameru,
          svg: cat.svg,
          subcategories: cat.subcategories
            .filter(sub => sub.goods?.length)
            .map(sub => ({
              id: sub.id,
              nameuk: sub.nameuk,
              nameru: sub.nameru,
              img: sub.img,
            })),
        }));

      return resp.json({ category: result });
    } catch (err) {
      console.log(err);
      return next(ErrorApi.badRequest(err.message));
    }
  };
}

module.exports = CategoryController;
