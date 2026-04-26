const ErrorApi = require('../error/ErrorApi');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const toSlug = require('./utils/ToSlug'); // Припускаю, вона чистить текст
const { Promokods, UserBronPromokod } = require('../models/models');

class PromokodsController {
  static Add = async (req, resp, next) => {
    try {
      const {
        code,
        nameuk,
        nameru,
        descriptionuk,
        descriptionru,
        type,
        procent,
        min_price,
        countPromokods,
        selectVolumeArt,
        price_discount,
      } = req.body;

      // Перевірка на наявність файлу (для express-fileupload)
      if (!req.files || !req.files.img) {
        return next(ErrorApi.badRequest('Відсутня картинка'));
      }

      const file = req.files.img;

      // 1. Правильний слаг з назви (використовуємо значення nameuk)
      // Додаємо Date.now(), щоб назви файлів були унікальними
      const slugName = toSlug(nameuk) || 'promo';
      const fileName = `${slugName}_${Date.now()}.webp`;

      const dirPath = path.resolve(__dirname, '..', 'static', 'promokods');

      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const fullPath = path.join(dirPath, fileName);

      // 2. Оптимізація та збереження через Sharp
      await sharp(file.data).webp({ quality: 80 }).toFile(fullPath);

      const imgPath = `promokods/${fileName}`;

      // 3. Створення запису
      const res = await Promokods.create({
        code,
        nameuk,
        nameru,
        descriptionuk,
        descriptionru,
        type,
        // Перетворюємо на числа, бо з FormData приходять рядки
        procent: procent ? parseInt(procent) : null,
        min_price: min_price ? parseInt(min_price) : null,
        countPromokods: parseInt(countPromokods) || 0,
        selectVolumeArt: selectVolumeArt || null,
        price_discount: price_discount ? parseInt(price_discount) : null,
        img: imgPath,
      });

      // 4. ОБОВ'ЯЗКОВО відправляємо відповідь
      return resp.status(201).json(res);
    } catch (err) {
      console.error(err);
      return next(ErrorApi.badRequest(err));
    }
  };
  static Get = async (req, resp, next) => {
    try {
      const promokods = await Promokods.findAll();
      return resp.json({ promokods });
    } catch (err) {
      console.error('Помилка отримання промокодів', err);
      return next(ErrorApi.badRequest(err));
    }
  };

  static Check = async (req, resp, next) => {
    try {
      const userId = req.user.id;
      const { promokodCode } = req.query;

      const promokod = await Promokods.findOne({
        where: { code: promokodCode },
      });

      if (!promokod) {
        return resp.status(404).json({ message: 'Промкод не знайдено' });
      }

      const alreadyUsed = await UserBronPromokod.findOne({
        where: {
          userId,
          promokodId: promokod.id,
        },
      });

      if (alreadyUsed) {
        return resp.status(409).json({
          message: 'Ви вже бронювали цей промокод',
        });
      }

      if (promokod.countPromokods <= 0) {
        return resp.status(400).json({
          message: 'Промокод закінчився',
        });
      }

      await UserBronPromokod.create({
        userId,
        promokodId: promokod.id,
      });

      promokod.countPromokods -= 1;
      await promokod.save();

      return resp.json({
        message: 'Промокод успішно використано',
        promokod,
      });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };

  static Check = async (req, resp, next) => {
    try {
      const userId = req.user.id;
      const { promokodCode } = req.query;

      const promokod = await Promokods.findOne({
        where: { code: promokodCode },
      });

      if (!promokod) {
        return resp.status(404).json({ message: 'Промкод не знайдено' });
      }

      const alreadyUsed = await UserBronPromokod.findOne({
        where: {
          userId,
          promokodId: promokod.id,
        },
      });

      if (alreadyUsed) {
        return resp.status(409).json({
          message: 'Ви вже бронювали цей промокод',
        });
      }

      if (promokod.countPromokods <= 0) {
        return resp.status(400).json({
          message: 'Промокод закінчився',
        });
      }

      await UserBronPromokod.create({
        userId,
        promokodId: promokod.id,
      });

      promokod.countPromokods -= 1;
      await promokod.save();

      return resp.json({
        message: 'Промокод успішно використано',
        promokod,
      });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };

  static CheckNoAuth = async (req, resp, next) => {
    try {
      const { promokodCode } = req.query;

      const promokod = await Promokods.findOne({
        where: { code: promokodCode },
      });

      if (!promokod) {
        return resp.status(404).json({ message: 'Промкод не знайдено' });
      }

      if (promokod.countPromokods <= 0) {
        return resp.status(400).json({
          message: 'Промокод закінчився',
        });
      }

      return resp.json({
        message: 'Промокод застусовано',
        promokod,
      });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };

  static GetMyPromokods = async (req, resp, next) => {
    try {
      const userId = req.user.id;
      const userPromokods = await UserBronPromokod.findAll({
        where: { userId },
        include: [
          {
            model: Promokods,
          },
        ],
      });

      return resp.json({ myPromokods: userPromokods });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
}

module.exports = PromokodsController;
