const { Img } = require('../models/models');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const { Op } = require('sequelize');
class ConvertPngToWebP {
  static convertOneToWebp = async (id) => {
    try {
      const img = await Img.findOne({ where: { id } });
      if (!img) return;

      const src = img.img;
      const originalPath = path.join(__dirname, '..', 'static', src);

      if (!fs.existsSync(originalPath)) return;

      // Створюємо базове ім'я без розширення
      const baseName = src.replace(/\.(png|jpeg|jpg|avif|webp)$/i, '');

      const webpFileName = `${baseName}.webp`;
      const smallFileName = `${baseName}_small.webp`; // Ім'я для мобільної версії

      const webpPath = path.join(__dirname, '..', 'static', webpFileName);
      const smallPath = path.join(__dirname, '..', 'static', smallFileName);

      const sharpInstance = sharp(originalPath);

      // 1. Створюємо основне зображення (888x888)
      await sharpInstance
        .clone()
        .resize(888, 888, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .webp({ quality: 80, effort: 4 })
        .toFile(webpPath);

      // 2. Створюємо мобільну версію (400x400)
      await sharpInstance
        .clone()
        .resize(400, 400, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .webp({ quality: 70, effort: 4 }) // Трохи сильніше стиснення для мобілок
        .toFile(smallPath);

      // 3. Оновлюємо базу (тільки основним ім'ям)
      img.img = webpFileName;
      await img.save();

      // 4. Видалення оригіналу, якщо він не був основним .webp
      if (originalPath !== webpPath && fs.existsSync(originalPath)) {
        fs.unlinkSync(originalPath);
      }

      //console.log(`✅ Оброблено: ${webpFileName} та ${smallFileName}`);
    } catch (err) {
      console.error(`Помилка ID ${id}:`, err);
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

      console.log(
        `Знайдено ${imgs.length} зображень для конвертації у WebP...`
      );

      for (let i = 0; i < imgs.length; i++) {
        // Виводимо прогрес: поточний індекс / загальна кількість
        //console.log(`Обробка: ${i + 1}/${imgs.length} (ID: ${imgs[i].id})`);

        // Викликаємо ваш метод конвертації
        await this.convertOneToWebp(imgs[i].id);
      }

      console.log(`✅ Конвертація ${imgs.length} зображень завершена.`);
    } catch (err) {
      console.error('Помилка під час масового оновлення:', err);
    }
  };
  static generateSmallForAllExistingWebp = async () => {
    try {
      // 1. Шукаємо в базі всі зображення, які вже є у форматі webp
      const imgs = await Img.findAll({
        where: {
          img: { [Op.like]: '%.webp' },
        },
      });

      console.log(
        `Знайдено ${imgs.length} зображень для перевірки/створення мініатюр...`
      );

      const staticDir = path.join(__dirname, '../static');
      let createdCount = 0;
      let skippedCount = 0;

      for (let i = 0; i < imgs.length; i++) {
        const image = imgs[i];
        const fullPath = path.join(staticDir, image.img);

        // Формуємо ім'я для маленької копії
        const smallPath = fullPath.replace('.webp', '_small.webp');

        // Перевіряємо, чи існує основне фото і чи ще НЕМАЄ маленького
        if (fs.existsSync(fullPath)) {
          if (!fs.existsSync(smallPath)) {
            try {
              await sharp(fullPath)
                .resize(400, 400, {
                  fit: 'contain',
                  background: { r: 255, g: 255, b: 255, alpha: 1 },
                })
                .webp({ quality: 70, effort: 4 })
                .toFile(smallPath);

              createdCount++;
            } catch (sharpErr) {
              console.error(
                `Помилка Sharp для файлу ${image.img}:`,
                sharpErr.message
              );
            }
          } else {
            skippedCount++;
          }
        }

        // Виводимо прогрес кожні 100 файлів, щоб не спамити в консоль
        if (i % 100 === 0) {
          console.log(`Прогрес: ${i}/${imgs.length}...`);
        }
      }

      console.log(`--- ЗАВЕРШЕНО ---`);
      console.log(`Створено нових мініатюр: ${createdCount}`);
      console.log(`Вже існували (пропущено): ${skippedCount}`);
    } catch (err) {
      console.error('Критична помилка при генерації мініатюр:', err);
    }
  };
}

module.exports = ConvertPngToWebP;
