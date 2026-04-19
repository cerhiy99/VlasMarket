const { Op } = require('sequelize');
const ErrorApi = require('../error/ErrorApi');
const { Brends, Goods } = require('../models/models');

class BrednController {
  static Add = async (req, resp, next) => {
    try {
      const { name } = req.body;
      const res = await Brends.create({ name });
      return resp.json({ err: 'Успішно добавлено', res });
    } catch (err) {
      return next(
        ErrorApi.badRequest(
          'Не вдалося додати бренд, скоріш за все бренд з такою назвою уже існує.',
        ),
      );
    }
  };

  static Update = async (req, resp, next) => {
    try {
      const { id } = req.params;
      const { name, descriptionuk, descriptionru } = req.body;
      const res = await Brends.update(
        { name, descriptionuk, descriptionru },
        { where: { id: parseInt(id) } },
      );
      return resp.json({ res });
    } catch (err) {
      return next(ErrorApi.badRequest('Не вдалося Оновити бренд.'));
    }
  };

  static GetForLetter = async (req, resp, next) => {
    try {
      const { letter } = req.query;
      if (letter == 'number') {
        const brendsWithNumber = await Brends.findAll({
          where: {
            name: {
              [Op.regexp]: '^[0-9]', // Бренди, які починаються з цифри
            },
          },
          order: [['name', 'ASC']], // Сортування за назвою
        });
        return resp.json({ res: brendsWithNumber });
      }
      if (!letter || letter.length !== 1) {
        return next(
          ErrorApi.badRequest(
            "Необхідно вказати одну літеру, або 'number' для пошуку.",
          ),
        );
      }
      const res = await Brends.findAll({
        where: {
          name: {
            [Op.regexp]: `^${letter}`, // Пошук брендів, що починаються на letter
          },
        },
        order: [['name', 'ASC']], // Сортування за назвою
      });

      return resp.json({ res });
    } catch (err) {
      return next(
        ErrorApi.badRequest(err.message || 'Помилка при отриманні брендів.'),
      );
    }
  };

  static Get = async (req, resp, next) => {
    try {
      const res = await Brends.findAll({ order: [['name', 'asc']] });
      return resp.json(res);
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };

  static GetForListBrends = async (req, resp, next) => {
    try {
      // Отримуємо всі бренди, що мають хоча б один товар з isShow: true
      const allBrends = await Brends.findAll({
        include: [
          {
            model: Goods,
            attributes: [],
            where: { isShow: true },
            required: true,
          },
        ],
        order: [['name', 'ASC']],
      });

      // Групуємо за першою буквою
      const grouped = {};

      for (let brend of allBrends) {
        const firstChar = brend.name[0]?.toLowerCase();

        const key = /^[0-9]/.test(firstChar) ? '0-9' : firstChar;
        if (!grouped[key]) {
          grouped[key] = [];
        }

        grouped[key].push(brend);
      }

      // Приводимо до формату масиву з ключами у правильному порядку
      const alphabet = ['0-9', ...'abcdefghijklmnopqrstuvwxyz'];
      const res = [];

      for (let key of alphabet) {
        if (grouped[key]) {
          res.push({ startWith: key.toUpperCase(), brends: grouped[key] });
        }
      }

      return resp.json({ res });
    } catch (err) {
      return next(ErrorApi.badRequest(err.message));
    }
    try {
      const res = await Brends.findAll({
        include: [
          {
            model: Goods,
            attributes: [], // не повертати товари, тільки фільтрація
            where: { isShow: true },
            required: true, // важливо! тільки бренди, які мають товари
          },
        ],
      });

      return resp.json(res);
    } catch (err) {
      return next(ErrorApi.badRequest(err.message));
    }
  };

  static GetFirstLetters = async (req, resp, next) => {
    try {
      let res = [];
      const brendsWithNumber = await Brends.findAll({
        where: {
          name: {
            [Op.regexp]: '^[0-9]', // Бренди, які починаються з цифри
          },
        },
        order: [['name', 'ASC']], // Сортування за назвою
      });
      res.push({ startWith: '0-9', brends: brendsWithNumber });
      for (let letter of [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f',
        'g',
        'h',
        'i',
        'j',
        'k',
        'l',
        'm',
        'n',
        'o',
        'p',
        'q',
        'r',
        's',
        't',
        'u',
        'v',
        'w',
        'x',
        'y',
        'z',
      ]) {
        const brends = await Brends.findAll({
          where: {
            name: {
              [Op.regexp]: `^${letter}`, // Для баз даних, які підтримують REGEXP
            },
          },
          order: [['name', 'ASC']], // Сортування за назвою
        });
        if (brends.length > 0)
          res.push({ startWith: letter.toLocaleUpperCase(), brends });
      }

      return resp.json({ res });
    } catch (err) {
      return next(ErrorApi.badRequest(err.message));
    }
  };
}

module.exports = BrednController;
