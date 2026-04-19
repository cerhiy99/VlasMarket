const { Img, Volume, Goods } = require('../models/models');
const { Op } = require('sequelize');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');

class ImageToFullName {
  static UpdateImage = async () => {
    try {
      const images = await Img.findAll({
        where: {
          [Op.and]: [
            { img: { [Op.like]: '%.webp' } },
            {
              [Op.or]: [
                { img: { [Op.notLike]: '%/%' } }, // Нові фото (лежать в корені)
                { img: { [Op.like]: 'hidden/%' } }, // Фото в папці hidden
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

      // Фільтруємо: якщо фото в hidden, беремо тільки ті, де isShow став true
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

        // 1. ОЧИЩЕННЯ НАЗВИ (Тільки латиниця, як просила Людмила)
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

        // 2. Створення Slug (макс 80 символів)
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

        // 3. ВИЗНАЧЕННЯ НОВОГО ШЛЯХУ
        // Формуємо чистий шлях: id_товару/id_фото/назва.avif
        const newRelativeDir = `${product.id}/${image.id}`;
        const newRelativePath = `${newRelativeDir}/${cleanName}.webp`.replace(
          /\\/g,
          '/'
        );

        const fullOldPath = path.join(staticDir, image.img);
        const fullNewDir = path.join(staticDir, newRelativeDir);
        const fullNewPath = path.join(staticDir, newRelativePath);

        try {
          if (fs.existsSync(fullOldPath)) {
            // Створюємо папку (якщо її ще немає)
            if (!fs.existsSync(fullNewDir)) {
              fs.mkdirSync(fullNewDir, { recursive: true });
            }

            // --- ЛОГІКА ДЛЯ ОСНОВНОГО ФАЙЛУ ---
            fs.renameSync(fullOldPath, fullNewPath);

            // --- ЛОГІКА ДЛЯ МАЛЕНЬКОГО ФАЙЛУ (_small) ---
            const oldSmallPath = fullOldPath.replace('.webp', '_small.webp');
            const newSmallPath = fullNewPath.replace('.webp', '_small.webp');

            if (fs.existsSync(oldSmallPath)) {
              fs.renameSync(oldSmallPath, newSmallPath);
              console.log(
                `Також переміщено мініатюру: ${path.basename(newSmallPath)}`
              );
            }

            // Оновлюємо БД (записуємо тільки основний шлях)
            await image.update({ img: newRelativePath });

            console.log(`Оновлено: ${image.img} -> ${newRelativePath}`);
          }
        } catch (fileErr) {
          console.error(`Помилка файлу ${image.img}:`, fileErr.message);
        }
      }

      // Чистимо порожні папки в hidden після того, як звідти пішли файли
      await this.removeEmptyDirs(path.join(staticDir, 'hidden'));
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
        const pathParts = oldRelativePath.split('/');
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
