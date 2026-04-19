const path = require('path');
const ErrorApi = require('../error/ErrorApi');
const { Baners } = require('../models/models'); // Ваша модель
const uuid = require('uuid');
const fs = require('fs').promises; // Для асинхронного видалення файлів

// Шлях до статичних файлів
const STATIC_PATH = path.resolve(__dirname, '..', 'static');

// Список імен полів зображень для ітерації
const IMAGE_FIELDS = ['mobileImg_uk', 'pcImg_uk', 'mobileImg_ru', 'pcImg_ru'];

/**
 * Допоміжна функція для безпечного видалення файлу
 * @param {string} fileName - Ім'я файлу, яке зберігається у БД
 */
const safeUnlink = async (fileName) => {
  try {
    if (fileName) {
      await fs.unlink(path.join(STATIC_PATH, fileName));
    }
  } catch (e) {
    // Логуємо помилку, але не зупиняємо виконання, якщо файл не знайдено
    if (e.code !== 'ENOENT') {
      // ENOENT = File not found
      console.warn(`Warning: Could not delete file ${fileName}:`, e.message);
    }
  }
};

class BanersController {
  // Метод Add (залишається як у попередньому робочому варіанті)
  static Add = async (req, resp, next) => {
    try {
      let { href, sort } = req.body;
      sort = parseInt(sort);

      // 1. Перевірка наявності ВСІХ чотирьох файлів
      if (
        !req.files ||
        !req.files.mobileImg_uk ||
        !req.files.pcImg_uk ||
        !req.files.mobileImg_ru ||
        !req.files.pcImg_ru
      ) {
        return next(
          ErrorApi.badRequest(
            'Не завантажено одне або кілька зображень для обох мов (UK/RU).',
          ),
        );
      }

      const files = req.files;
      const fileNames = {};

      // Зберігаємо всі 4 файли
      for (const field of IMAGE_FIELDS) {
        const file = files[field];
        const newName = uuid.v4() + '.avif';
        await file.mv(path.join(STATIC_PATH, newName));
        fileNames[field] = newName;
      }

      // 3. Створення запису в базі даних
      const res = await Baners.create({
        href: href || null,
        sort,
        ...fileNames, // Додає mobileImg_uk, pcImg_uk, mobileImg_ru, pcImg_ru
      });

      return resp.json(res);
    } catch (err) {
      console.error('Error in SlidesController.Add:', err);
      return next(
        ErrorApi.badRequest(err.message || 'Помилка при додаванні слайда'),
      );
    }
  };

  // --- ОНОВЛЕННЯ (UPDATE) ---
  static Update = async (req, resp, next) => {
    try {
      let { id, href, sort } = req.body;
      id = parseInt(id);
      sort = parseInt(sort);

      // 1. Знаходимо слайд
      const slide = await Baners.findOne({ where: { id } });
      if (!slide) {
        return next(ErrorApi.notFound('Слайд не знайдено.'));
      }

      const files = req.files || {};
      const updateData = {};

      // 2. Обробка та оновлення всіх 4 полів зображень
      for (const field of IMAGE_FIELDS) {
        const newFile = files[field];

        if (newFile) {
          // 2a. Видаляємо старий файл
          await safeUnlink(slide[field]);

          // 2b. Зберігаємо новий файл
          const newFileName = uuid.v4() + '.avif';
          await newFile.mv(path.join(STATIC_PATH, newFileName));

          // 2c. Додаємо ім'я нового файлу до даних для оновлення БД
          updateData[field] = newFileName;
        } else {
          // Якщо файл не завантажено, залишаємо старе ім'я
          updateData[field] = slide[field];
        }
      }

      // 3. Оновлення полів в БД (href і sort)
      updateData.href = href !== undefined ? href || null : slide.href;
      updateData.sort = sort !== undefined ? sort : slide.sort;

      await slide.update(updateData);

      return resp.json({ message: 'Слайд успішно оновлено', slide: slide });
    } catch (err) {
      console.error('Error in SlidesController.Update:', err);
      return next(
        ErrorApi.badRequest(err.message || 'Помилка при оновленні слайда'),
      );
    }
  };

  // --- ВИДАЛЕННЯ (DELETE) ---
  static Delete = async (req, resp, next) => {
    try {
      const { id } = req.query;
      const slideId = parseInt(id);

      if (isNaN(slideId)) {
        return next(ErrorApi.badRequest('Некоректний ID слайда.'));
      }

      // 1. Знаходимо слайд, щоб отримати імена файлів
      const slide = await Baners.findOne({ where: { id: slideId } });
      if (!slide) {
        return next(ErrorApi.notFound('Слайд не знайдено.'));
      }

      // 2. Видаляємо всі 4 файли зображень з файлової системи
      for (const field of IMAGE_FIELDS) {
        await safeUnlink(slide[field]);
      }

      // 3. Видаляємо запис з бази даних
      await Baners.destroy({ where: { id: slideId } });

      return resp.json({ message: `Слайд ID ${slideId} успішно видалено.` });
    } catch (err) {
      console.error('Error in SlidesController.Delete:', err);
      return next(
        ErrorApi.internal(err.message || 'Помилка при видаленні слайда.'),
      );
    }
  };

  static Get = async (req, resp, next) => {
    try {
      // Сортуємо банери за полем 'sort'
      const res = await Baners.findAll({ order: [['sort', 'ASC']] });
      return resp.json({ slides: res });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
}

module.exports = BanersController;
