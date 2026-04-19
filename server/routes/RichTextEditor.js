// routes/blogRouter.js (або інший файл з роутами)
const router = require('express').Router();
const path = require('path');
const uuid = require('uuid');
const fs = require('fs/promises'); // Імпортуємо модуль fs/promises для роботи з файловою системою
const IsAdminMiddleWare = require('../middleWare/IsAdminMiddleWare');
const ErrorApi = require('../error/ErrorApi');

// Роут для завантаження файлів. Використовуємо async/await для кращої обробки помилок.
router.post('/upload', IsAdminMiddleWare, async (req, res, next) => {
  try {
    // 1. Перевірка наявності файлів у запиті
    // express-fileupload додає об'єкт `files` до `req`
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(ErrorApi.badRequest('Файли не були завантажені.'));
    }

    const image = req.files.image; // Отримуємо файл з іменем 'image'

    // 2. Перевірка, чи це справді зображення
    if (!image || !image.mimetype.startsWith('image/')) {
      return next(ErrorApi.badRequest('Будь ласка, завантажте файл зображення.'));
    }

    // 3. Генерування унікального імені файлу
    const fileName = uuid.v4() + path.extname(image.name);

    // 4. Визначення шляху для збереження файлу
    const uploadDir = path.resolve(__dirname, '..', 'static', 'uploads');
    const uploadPath = path.join(uploadDir, fileName);

    // 5. Перевірка та створення директорії, якщо вона не існує
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (e) {
      console.error('Помилка при створенні директорії:', e);
      return next(
        ErrorApi.internalServerError(
          'Помилка сервера. Неможливо створити директорію для завантажень.'
        )
      );
    }

    // 6. Збереження файлу на сервері
    // Метод `mv` переміщує файл з тимчасового розташування на постійне
    await image.mv(uploadPath, (err) => {
      if (err) {
        console.error('Помилка збереження зображення:', err);
        return next(ErrorApi.internalServerError('Помилка під час збереження файлу.'));
      }
    });

    // 7. Формування URL зображення
    // Замість 'http://localhost:5000' краще використовувати змінну оточення
    const imageUrl = process.env.BECK_URL_IMG + `uploads/${fileName}`;

    // 8. Відправлення успішної відповіді у форматі, очікуваному Editor.js
    return res.json({ imageUrl });
  } catch (e) {
    // Загальна обробка помилок
    console.error('Помилка під час завантаження файлу:', e);
    return next(ErrorApi.internalServerError('Внутрішня помилка сервера.'));
  }
});

module.exports = router;
