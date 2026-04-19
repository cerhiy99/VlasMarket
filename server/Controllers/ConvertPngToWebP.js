const { Img } = require('../models/models');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const { Op } = require('sequelize');
class ConvertPngToWebP {
  static convertOneToWebp = async (id) => {
    try {
      const img = await Img.findOne({ where: { id } });
      if (!img) {
        console.log('Зображення з таким ID не знайдено.');
        return;
      }

      const src = img.img;
      const originalPath = path.join(__dirname, '..', 'static', src);

      if (!fs.existsSync(originalPath)) {
        console.log('Файл не знайдено за шляхом:', originalPath);
        return;
      }

      // 1. Змінюємо розширення на .webp.
      // Регулярний вираз тепер враховує і .avif, якщо раптом такі файли вже є
      const webpFileName = src.replace(/\.(png|jpeg|jpg|avif)$/i, '.webp');
      const webpPath = path.join(__dirname, '..', 'static', webpFileName);

      // 2. Конвертація через Sharp
      await sharp(originalPath)
        .resize(888, 888, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .webp({
          quality: 80,
          effort: 4, // Баланс між швидкістю та стисненням (0-6)
        })
        .toFile(webpPath);

      // 3. Оновлюємо запис в базі даних
      img.img = webpFileName;
      await img.save();

      // 4. ОПЦІЙНО: Видалення старого файлу
      // Якщо шлях змінився (наприклад, був .jpg, став .webp), старий файл треба видалити
      if (originalPath !== webpPath && fs.existsSync(originalPath)) {
        fs.unlinkSync(originalPath);
      }

      console.log(`Успішно: ${src} -> ${webpFileName}`);
    } catch (err) {
      console.error(`Помилка при конвертації ID ${id}:`, err);
    }
  };

  static UpdateAll = async () => {
    try {
      const imgs = await Img.findAll({ attributes: ['id'] });
      imgs.forEach((x) => this.convertOneForTest(x.id));
    } catch (err) {
      console.error('Помилка оновлення всіх');
    }
  };
  static UpdateNoWebp = async () => {
    try {
      const imgs = await Img.findAll({
        attributes: ['id', 'img'], // Додав 'img' для логування, якщо треба
        where: {
          img: {
            // Шукаємо все, що НЕ закінчується на .webp
            [Op.notLike]: '%.webp',
          },
        },
      });

      if (imgs.length === 0) {
        console.log('Усі зображення вже у форматі WebP.');
        return;
      }

      console.log(`Знайдено ${imgs.length} зображень для конвертації у WebP...`);

      for (let i = 0; i < imgs.length; i++) {
        // Виводимо прогрес: поточний індекс / загальна кількість
        console.log(`Обробка: ${i + 1}/${imgs.length} (ID: ${imgs[i].id})`);

        // Викликаємо ваш метод конвертації
        await this.convertOneToWebp(imgs[i].id);
      }

      console.log(`✅ Конвертація ${imgs.length} зображень завершена.`);
    } catch (err) {
      console.error('Помилка під час масового оновлення:', err);
    }
  };
}

module.exports = ConvertPngToWebP;
