const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const { Op } = require('sequelize');
const ErrorApi = require('../error/ErrorApi');
const { Subcategory, sequelize } = require('../models/models');
const sharp = require('sharp');

class SubcategoryController {
  static Add = async (req, resp, next) => {
    try {
      const { nameua, nameru, categoryId } = req.body;

      // Перевірка полів
      if (!nameua || !nameru || !categoryId) {
        return next(ErrorApi.badRequest('Всі поля повинні бути заповнені.'));
      }

      // Перевірка на дублікати
      const existingSubcategory = await Subcategory.findOne({
        where: { nameuk: nameua },
      });
      if (existingSubcategory) {
        return next(
          ErrorApi.badRequest('Підкатегорія з такою назвою вже існує.')
        );
      }

      let imageName = null;

      // Перевірка та збереження зображення
      if (req.files && req.files.image) {
        const image = req.files.image;
        const ext = path.extname(image.name).toLowerCase();
        const allowedExt = ['.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif'];

        if (!allowedExt.includes(ext)) {
          return next(
            ErrorApi.badRequest('Непідтримуваний формат зображення.')
          );
        }

        imageName = uuid.v4() + '.webp';
        const imagePath = path.resolve(__dirname, '..', 'static', imageName);
        await sharp(image.data).webp({ quality: 80 }).toFile(imagePath);
      } else {
        return next(ErrorApi.badRequest("Зображення є обов'язковим."));
      }

      // Створення підкатегорії
      const newSubcategory = await Subcategory.create({
        nameuk: nameua,
        nameru,
        categoryId,
        img: imageName, // збереження шляху до зображення
      });

      return resp.status(201).json({
        message: 'Підкатегорія успішно додана.',
        data: newSubcategory,
      });
    } catch (err) {
      return next(ErrorApi.badRequest(err.message || 'Сталася помилка.'));
    }
  };
  static Update = async (req, resp, next) => {
    try {
      const { id } = req.params;
      const { nameua, nameru, descriptionuk, descriptionru, categoryId, sort } =
        req.body;

      // Перевірка полів
      if (!id || !nameua || !nameru || !categoryId) {
        return next(ErrorApi.badRequest('Всі поля повинні бути заповнені.'));
      }

      // Пошук підкатегорії
      const subcategory = await Subcategory.findByPk(id);
      if (!subcategory) {
        return next(ErrorApi.badRequest('Підкатегорію не знайдено.'));
      }

      // Перевірка на дублікати (інша підкатегорія з таким же ім’ям)
      const existing = await Subcategory.findOne({
        where: {
          nameuk: nameua,
          id: { [Op.ne]: id }, // не поточна
        },
      });
      if (existing) {
        return next(
          ErrorApi.badRequest('Підкатегорія з такою назвою вже існує.')
        );
      }

      let imageName = subcategory.img;

      // Якщо передано нове зображення — оновити
      if (req.files && req.files.image) {
        const image = req.files.image;
        const ext = path.extname(image.name).toLowerCase();
        const allowedExt = ['.svg', '.png', '.jpg', '.jpeg', '.webp', '.avif'];

        if (!allowedExt.includes(ext)) {
          return next(
            ErrorApi.badRequest('Непідтримуваний формат зображення.')
          );
        }

        // Видалення старого зображення (опційно)
        if (imageName) {
          const oldPath = path.resolve(__dirname, '..', 'static', imageName);
          if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        // Збереження нового
        imageName = uuid.v4() + '.webp';
        const imagePath = path.resolve(__dirname, '..', 'static', imageName);
        await sharp(image.data).webp({ quality: 80 }).toFile(imagePath);
      }

      // Оновлення
      await subcategory.update({
        nameuk: nameua,
        nameru,
        descriptionuk,
        descriptionru,
        categoryId,
        img: imageName,
        sort: sort == 'null' ? null : parseInt(sort),
      });

      return resp.status(200).json({
        message: 'Підкатегорія успішно оновлена.',
        data: subcategory,
      });
    } catch (err) {
      return next(ErrorApi.badRequest(err.message || 'Сталася помилка.'));
    }
  };

  static Get = async (req, resp, next) => {
    try {
      const { categoryId } = req.query;
      const res = await Subcategory.findAll({ where: { categoryId } });
      return resp.json({ res });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };

  static Patch = async (req, resp, next) => {
    try {
      const { id } = req.params;
      const { sort } = req.body;
      const subcategory = await Subcategory.findOne({
        where: { id: parseInt(id) },
      });
      if (!subcategory)
        return ErrorApi.badRequest('Не існує підкатегорії з таким id');
      subcategory.sort = sort !== null ? parseInt(sort) : null;
      await subcategory.save();
      return resp.json({ subcategory });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static ReOrder = async (req, resp, next) => {
    const transaction = await sequelize.transaction();

    try {
      const { items } = req.body;

      if (!Array.isArray(items)) {
        return next(ErrorApi.badRequest('items має бути масивом'));
      }

      for (const item of items) {
        if (!item.id) continue;

        await Subcategory.update(
          {
            sort: item.sort !== null ? parseInt(item.sort) : null,
          },
          {
            where: { id: item.id },
            transaction,
          }
        );
      }

      await transaction.commit();

      return resp.json({
        message: 'Сортування оновлено',
        success: true,
      });
    } catch (err) {
      await transaction.rollback();
      return next(ErrorApi.badRequest(err.message));
    }
  };
}

module.exports = SubcategoryController;
