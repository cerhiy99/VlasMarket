const { Img, Volume, Goods } = require('../models/models');
const { Op } = require('sequelize');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

class ImageToFullName {
  static UpdateImage = async () => {
    try {
      const images = await Img.findAll({
        where: {
          [Op.and]: [
            { img: { [Op.like]: '%.webp' } },
            {
              [Op.or]: [
                { img: { [Op.notLike]: '%/%' } },
                { img: { [Op.like]: 'hidden/%' } },
              ],
            },
          ],
        },
        include: [
          {
            model: Volume,
            include: [{ model: Goods }],
          },
        ],
      });

      const imagesToProcess = images.filter((image) => {
        const isNew = !image.img.includes('/');
        const wasHiddenButNowOpen =
          image.img.startsWith('hidden/') &&
          image.volume?.good?.isShow === true;
        return isNew || wasHiddenButNowOpen;
      });

      console.log(
        `Знайдено ${imagesToProcess.length} фото для обробки/повернення.`
      );

      const staticDir = path.join(__dirname, '../static');

      for (const image of imagesToProcess) {
        const volume = image.volume;
        const product = volume?.good;

        if (!product || !volume) continue;

        // 1. ОЧИЩЕННЯ НАЗВИ
        let name = product.nameuk
          .replace(/^\[UA\]\s*/i, '')
          .replace(/^\[RU\]\s*/i, '')
          .trim();
        let latinName = name
          .replace(/[а-яА-ЯёЁіІїЇєЄґҐ]/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        if (!latinName || latinName.length < 2) {
          latinName = name.split(' ').slice(0, 3).join(' ');
        }

        const volumeValue = volume.volume.split('||')[0].trim();
        const combinedName = `${latinName} ${volumeValue}`;

        // 2. Створення Slug
        let cleanName = slugify(combinedName, {
          replacement: '-',
          lower: true,
          strict: true,
          locale: 'uk',
        })
          .replace(/-ua$/, '')
          .replace(/^ua-/, '');

        if (cleanName.length > 80) {
          cleanName = cleanName
            .substring(0, 80)
            .split('-')
            .slice(0, -1)
            .join('-');
        }

        // 3. ВИЗНАЧЕННЯ ШЛЯХІВ
        const newRelativeDir = `${product.id}/${image.id}`;
        const newRelativePath = `${newRelativeDir}/${cleanName}.webp`.replace(
          /\\/g,
          '/'
        );

        const fullOldPath = path.join(staticDir, image.img);
        const fullNewDir = path.join(staticDir, newRelativeDir);
        const fullNewPath = path.join(staticDir, newRelativePath);
        const newSmallPath = fullNewPath.replace('.webp', '_small.webp');

        try {
          if (fs.existsSync(fullOldPath)) {
            // Створюємо нову папку, якщо її немає
            if (!fs.existsSync(fullNewDir)) {
              fs.mkdirSync(fullNewDir, { recursive: true });
            }

            // Читаємо старий файл у буфер пам'яті (щоб уникнути блокування файлу операційною системою)
            const imageBuffer = await fs.promises.readFile(fullOldPath);

            // Використовуємо sharp для збереження ОРИГІНАЛУ за новим шляхом
            await sharp(imageBuffer).toFile(fullNewPath);
            console.log(
              `Оригінал переміщено/збережено: ${path.basename(fullNewPath)}`
            );

            // Використовуємо той самий буфер для створення МІНІАТЮРИ (_small)
            await sharp(imageBuffer)
              .resize(300) // Ваша ширина мініатюри
              .toFile(newSmallPath);
            console.log(
              `Мініатюру успішно згенеровано: ${path.basename(newSmallPath)}`
            );

            // Тільки після успішного збереження обох нових файлів видаляємо старі
            if (fs.existsSync(fullOldPath)) {
              fs.unlinkSync(fullOldPath);
            }

            const oldSmallPath = fullOldPath.replace('.webp', '_small.webp');
            if (fs.existsSync(oldSmallPath)) {
              fs.unlinkSync(oldSmallPath);
            }

            // Оновлюємо базу даних
            await image.update({ img: newRelativePath });
            console.log(`БД оновлено: -> ${newRelativePath}`);
          }
        } catch (fileErr) {
          console.error(
            `❌ КРИТИЧНА ПОМИЛКА ОБРОБКИ ФАЙЛУ ${image.img}:`,
            fileErr
          );
        }
      }

      await this.FixAndCleanImages();
      console.log('Процес UpdateImage завершено.');
    } catch (err) {
      console.error('Помилка оновлення фото:', err);
    }
  };

  static FixAndCleanImages = async () => {
    try {
      const images = await Img.findAll({
        where: {
          img: { [Op.like]: '%/%' },
        },
        include: [
          {
            model: Volume,
            include: [
              {
                model: Goods,
                // Забираємо статус відображення
              },
            ],
          },
        ],
      });

      console.log(`Знайдено ${images.length} фото для обробки.`);
      const staticDir = path.join(__dirname, '../static');
      const hiddenDir = path.join(staticDir, 'hidden');

      // Створюємо папку hidden, якщо її немає
      if (!fs.existsSync(hiddenDir)) {
        fs.mkdirSync(hiddenDir, { recursive: true });
      }

      for (const image of images) {
        const volume = image.volume;
        const product = volume?.good;

        if (!product || !volume || !volume.volume) continue;

        // 1. ОЧИЩЕННЯ НАЗВИ (Залишаємо тільки латиницю)
        let name = product.nameuk
          .replace(/^\[UA\]\s*/i, '')
          .replace(/^\[RU\]\s*/i, '')
          .trim();

        // Видаляємо кирилицю
        let latinName = name
          .replace(/[а-яА-ЯёЁіІїЇєЄґҐ]/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        // Якщо раптом назва була суто укр/рус, беремо перші 3 слова як fallback
        if (!latinName || latinName.length < 3) {
          latinName = name.split(' ').slice(0, 3).join(' ');
        }

        const volumeValue = volume.volume.split('||')[0].trim();
        const combinedName = `${latinName} ${volumeValue}`;

        // 2. Створення SLUG
        let cleanName = slugify(combinedName, {
          replacement: '-',
          lower: true,
          strict: true,
          locale: 'uk',
        })
          .replace(/-ua$/, '')
          .replace(/^ua-/, '');

        if (cleanName.length > 80) {
          cleanName = cleanName
            .substring(0, 80)
            .split('-')
            .slice(0, -1)
            .join('-');
        }

        // 3. ВИЗНАЧЕННЯ НОВОГО ШЛЯХУ (з урахуванням isShow)
        const oldRelativePath = image.img;
        const cleanRelativePath = oldRelativePath.replace(/^hidden\//, '');
        const pathParts = cleanRelativePath.split('/');
        // dirPath зазвичай це щось на кшталт "24275/33415"
        const dirPath = pathParts.slice(0, -1).join('/');

        let newRelativePath;
        if (product.isShow === false) {
          // Якщо приховано, шлях буде: hidden/24275/33415/name.avif
          newRelativePath = path.join('hidden', dirPath, `${cleanName}.avif`);
        } else {
          // Якщо відкрито: 24275/33415/name.avif
          newRelativePath = path.join(dirPath, `${cleanName}.avif`);
        }

        // Уніфікуємо роздільники для бази (щоб завжди були '/')
        newRelativePath = newRelativePath.replace(/\\/g, '/');

        if (oldRelativePath === newRelativePath) continue;

        const fullOldPath = path.join(staticDir, oldRelativePath);
        const fullNewPath = path.join(staticDir, newRelativePath);

        try {
          if (fs.existsSync(fullOldPath)) {
            // Створюємо вкладені папки в hidden, якщо треба
            const targetSubDir = path.dirname(fullNewPath);
            if (!fs.existsSync(targetSubDir)) {
              fs.mkdirSync(targetSubDir, { recursive: true });
            }

            // Перейменовуємо/Переміщуємо
            fs.renameSync(fullOldPath, fullNewPath);

            // Оновлюємо базу
            await image.update({ img: newRelativePath });

            console.log(
              `${product.isShow ? 'OK' : 'HIDDEN'}: ${oldRelativePath} -> ${newRelativePath}`
            );
          }
        } catch (fileErr) {
          console.error(`Помилка файлу ${oldRelativePath}:`, fileErr.message);
        }
      }

      await this.removeEmptyDirs(staticDir);
      console.log('Міграція та очищення завершено.');
    } catch (err) {
      console.error('Критична помилка методу:', err);
    }
  };

  // Допоміжний метод для видалення порожніх папок
  static removeEmptyDirs = async (dir) => {
    const filelist = fs.readdirSync(dir);

    for (const file of filelist) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        await this.removeEmptyDirs(fullPath);

        // Після того як обробили вкладені папки, перевіряємо чи ця тепер порожня
        if (fs.readdirSync(fullPath).length === 0) {
          fs.rmdirSync(fullPath);
          console.log(`Видалено порожню папку: ${fullPath}`);
        }
      }
    }
  };
}

module.exports = ImageToFullName;
