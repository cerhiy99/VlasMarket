const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid'); // Для створення унікальних ID
const axios = require('axios'); // Для завантаження зображень

// --- ВАЖЛИВО: Імпортуйте ваші моделі Sequelize тут ---
// Ваш рядок імпорту моделей:
const {
  Goods,
  Img,
  Volume,
  Category,
  CountryMade,
  Brends,
} = require('../models/models'); // Переконайтеся, що шлях до моделеи правильний

// Шлях до директорії, де будуть зберігатися зображення
const STATIC_DIR = path.resolve(__dirname, '..', 'static');
// Ім'я файлу зображення за замовчуванням, якщо для товару немає фото
const NO_IMAGE_FILENAME = 'no-image.png'; // Переконайтеся, що цей файл існує у ../static/

/**
 * Допоміжна функція для завантаження зображень.
 * Завантажує зображення з URL, зберігає локально з унікальним ім'ям UUID.png.
 * Повертає локальне ім'я файлу або 'no-image.png' у разі помилки/відсутності URL.
 * @param {string} imageUrl - URL зображення для завантаження.
 * @param {string} itemId - ID товару (для логування та контексту).
 * @param {string} defaultImageFilename - Назва файлу зображення за замовчуванням.
 * @returns {Promise<string>} - Локальне ім'я файлу (наприклад, 'uuid.png') або 'no-image.png'.
 */
async function downloadImage(
  imageUrl,
  itemId,
  defaultImageFilename = NO_IMAGE_FILENAME,
) {
  // Якщо URL порожній або складається лише з пробілів, використовуємо зображення за замовчуванням
  if (!imageUrl || imageUrl.trim() === '') {
    console.warn(
      `[ID товару: ${itemId}] Недійсний URL зображення. Використовуємо за замовчуванням: ${defaultImageFilename}`,
    );
    return defaultImageFilename;
  }

  // Створюємо унікальне ім'я файлу (UUID.png)
  const filename = `${uuidv4()}.png`; // Зберігаємо як .png, як ви просили
  const fullPath = path.join(STATIC_DIR, filename);

  try {
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'stream', // Завантажуємо як потік для ефективності
      timeout: 15000, // Таймаут 15 секунд для завантаження
    });

    // Якщо статус відповіді не 200 (OK), вважаємо завантаження невдалим
    if (response.status !== 200) {
      console.warn(
        `[ID товару: ${itemId}] Не вдалося завантажити зображення з ${imageUrl}. Статус: ${response.status}. Використовуємо за замовчуванням: ${defaultImageFilename}`,
      );
      return defaultImageFilename;
    }

    // Створюємо потік запису у файл
    const writer = fs.createWriteStream(fullPath);
    // Передаємо дані з потоку відповіді у потік запису
    response.data.pipe(writer);

    // Повертаємо Promise, який буде виконаний після завершення запису файлу
    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(
          `[ID товару: ${itemId}] Завантажено ${imageUrl} до ${fullPath}`,
        );
        resolve(filename); // Повертаємо лише ім'я файлу для зберігання у БД
      });
      writer.on('error', (err) => {
        console.error(
          `[ID товару: ${itemId}] Помилка при збереженні зображення з ${imageUrl}:`,
          err.message,
        );
        // Спроба видалити частково завантажений файл у разі помилки
        fs.unlink(fullPath, () => {});
        resolve(defaultImageFilename); // Використовуємо дефолтне, якщо збереження не вдалося
      });
    });
  } catch (error) {
    // Обробка мережевих помилок (наприклад, відсутність підключення, недійсний URL, таймаут)
    console.error(
      `[ID товару: ${itemId}] Помилка під час завантаження зображення з ${imageUrl}:`,
      error.message,
    );
    return defaultImageFilename; // Використовуємо дефолтне, якщо завантаження не вдалося
  }
}

class ParseFromFile {
  // Метод для читання CSV-файлу
  static ReadFile = async () => {
    // Шлях до CSV-файлу. Використовуйте path.join(__dirname, '..', '...') для кращої кросплатформності
    const filePath = path.join(__dirname, 'CD products 9.07.25 - _CD.csv');

    const res = new Promise((resolve, reject) => {
      const results = [];
      try {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            console.log(`Файл "${filePath}" успішно прочитано.`);
            resolve(results);
          })
          .on('error', (error) => {
            console.error(`Помилка читання CSV-файлу "${filePath}":`, error);
            reject(error);
          });
      } catch (err) {
        console.error('Помилка при створенні потоку читання файлу:', err);
        reject(err);
      }
    });
    return res;
  };

  // Метод для імпорту спарсених даних у базу даних
  static async importCsvToDatabase() {
    console.log('Починаємо імпорт даних з CSV до БД...');
    try {
      const csvData = await this.ReadFile();
      console.log(`Прочитано ${csvData.length} рядків з CSV.`);

      for (const row of csvData) {
        // Пропускаємо порожні або неповні рядки, якщо вони не містять критичних даних
        if (
          !row.id || // Додаємо перевірку на ID, оскільки він використовується як артикул
          !row.title ||
          !row.price ||
          !row.category ||
          !row.vendor ||
          !row.country
        ) {
          console.warn(
            'Пропущено рядок через відсутність критичних даних:',
            row,
          );
          continue; // Переходимо до наступного рядка
        }

        // --- 1. Обробка Brand (Brends) ---
        let brand;
        if (row.vendor && row.vendor.trim() !== '') {
          [brand] = await Brends.findOrCreate({
            where: { name: row.vendor.trim() },
            defaults: { name: row.vendor.trim() },
          });
        } else {
          console.warn(
            `[ID товару: ${row.id}] Vendor не вказано для товару "${row.title}". Використовуємо "Невідомий бренд".`,
          );
          [brand] = await Brends.findOrCreate({
            where: { name: 'Невідомий бренд' },
            defaults: { name: 'Невідомий бренд' },
          });
        }

        // --- 2. Обробка Country (CountryMade) ---
        let country;
        if (row.country && row.country.trim() !== '') {
          [country] = await CountryMade.findOrCreate({
            where: { nameru: row.country.trim() },
            defaults: {
              nameru: row.country.trim(),
              nameuk: `[UA] ${row.country.trim()}`,
            },
          });
        } else {
          console.warn(
            `[ID товару: ${row.id}] Country не вказано для товару "${row.title}". Використовуємо "Невідома країна".`,
          );
          [country] = await CountryMade.findOrCreate({
            where: { nameru: 'Невідома країна' },
            defaults: {
              nameru: 'Невідома країна',
              nameuk: 'Невідома країна [UA]',
            },
          });
        }

        // --- 3. Обробка Category ---
        let category;
        const categoriesInCsv = row.category
          .split(',')
          .map((cat) => cat.trim())
          .filter((cat) => cat !== ''); // Фільтруємо порожні рядки
        if (categoriesInCsv.length > 0) {
          const firstCategoryNameRu = categoriesInCsv[0];
          [category] = await Category.findOrCreate({
            where: { nameru: firstCategoryNameRu },
            defaults: {
              nameru: firstCategoryNameRu,
              nameuk: `[UA] ${firstCategoryNameRu}`,
              svg:
                '<svg fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>', // Плейсхолдер для SVG
            },
          });
        } else {
          console.warn(
            `[ID товару: ${row.id}] Category не вказано для товару "${row.title}". Використовуємо "Без категорії".`,
          );
          [category] = await Category.findOrCreate({
            where: { nameru: 'Без категорії' },
            defaults: {
              nameru: 'Без категорії',
              nameuk: 'Без категорії [UA]',
              svg:
                '<svg fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>',
            },
          });
        }

        // --- Нова логіка для обробки Goods та Volume ---
        // Видаляємо інформацію про об'єм з назви товару, щоб отримати "базову" назву
        // Цей regex видаляє "(XXX ml)" або "(XXX L)" тощо з кінця назви
        const baseTitleRu = row.title
          .replace(/\s*\(\d+(?:[xX]\d+)?(?:\.\d+)?\s*(?:ml|L|л|мл)\)\s*$/i, '')
          .trim();
        const baseTitleUk = row.title ? `[UA] ${baseTitleRu}` : '';

        // Знаходимо або створюємо запис для базового товару
        // Використовуємо baseTitleRu, brendId, categoryId та countryMadeId для унікальності товару
        let goods;
        let goodsCreated; // Прапорець, щоб знати, чи товар був створений
        [goods, goodsCreated] = await Goods.findOrCreate({
          where: {
            nameru: baseTitleRu,
            brendId: brand ? brand.id : null,
            categoryId: category ? category.id : null,
            countryMadeId: country ? country.id : null, // Додаємо країну для унікальності товару
          },
          defaults: {
            nameru: baseTitleRu,
            nameuk: baseTitleUk,
            descriptionru: row.body || '',
            descriptionuk: row.body ? `[UA] ${row.body}` : '',
            // ART встановлюємо лише при першому створенні товару
            // Це буде ART першого знайденого/створеного варіанту цього товару
            art: String(row.id),
            characteristicuk: '[UA] Характеристики не вказані',
            characteristicru: '[RU] Характеристики не вказані',
            video: row.video || null,
            isDiscount: false,
            isBestseller: false,
            isNovetly: false,
            isHit: false,
            isFreeDelivery: false,
            views: 0,
            brendId: brand ? brand.id : null,
            categoryId: category ? category.id : null,
            countryMadeId: country ? country.id : null,
          },
        });

        if (goodsCreated) {
          console.log(
            `[ID товару: ${row.id}] Створено новий базовий товар: ${goods.nameru} (ID: ${goods.id}, ART: ${goods.art})`,
          );
        } else {
          console.log(
            `[ID товару: ${row.id}] Знайдено існуючий базовий товар: ${goods.nameru} (ID: ${goods.id}, ART: ${goods.art}) - додаємо новий об'єм.`,
          );
          // Якщо товар вже існував, ми не оновлюємо його ART або інші базові дані з поточної строки,
          // оскільки вони були встановлені при першому створенні цього товару.
        }

        // --- 5. Обробка Volume (об'єму) ---
        let volumeValue = '';
        let volumeName = 'мл';
        // Регулярний вираз для парсингу об'єму, включаючи формати типу "2x250" або "1000"
        const valueMatch = row.value.match(
          /(\d+(?:[xX]\d+)?(?:\.\d+)?)\s*(ml|L|л|мл)?/i,
        );
        if (valueMatch) {
          volumeValue = valueMatch[1]; // Наприклад, "250", "2x250"
          if (valueMatch[2]) {
            volumeName = valueMatch[2].toLowerCase();
            // Стандартизуємо одиниці об'єму
            if (volumeName === 'l') volumeName = 'л';
            if (volumeName === 'ml') volumeName = 'мл';
          }
        } else {
          console.warn(
            `[ID товару: ${row.id}] Не вдалося розібрати об'єм "${row.value}" для товару "${row.title}". Використовуємо "0".`,
          );
          volumeValue = '0';
          volumeName = 'мл';
        }

        // Якщо volumeValue містить "x", обчислюємо загальний об'єм
        let parsedVolume = 0;
        if (volumeValue.includes('x') || volumeValue.includes('X')) {
          const parts = volumeValue.split(/[xX]/);
          if (
            parts.length === 2 &&
            !isNaN(Number(parts[0])) &&
            !isNaN(Number(parts[1]))
          ) {
            parsedVolume = parseFloat(parts[0]) * parseFloat(parts[1]);
          } else {
            parsedVolume = parseFloat(volumeValue) || 0;
          }
        } else {
          parsedVolume = parseFloat(volumeValue) || 0;
        }

        // Тепер створюємо Volume та пов'язуємо його з goods.id
        const volumeData = {
          // Зберігаємо обчислений числовий об'єм
          volume: parsedVolume,
          nameVolume: volumeName,
          price: parseFloat(row.price),
          discount: 0,
          priceWithDiscount: parseFloat(row.price),
          isAvailability: 'inStock', // Припускаємо, що товар є в наявності
          goodId: goods.id, // Пов'язуємо з ідентифікатором базового товару
        };

        const volume = await Volume.create(volumeData);
        console.log(
          `[ID товару: ${row.id}]   Створено об'єм: ${volume.volume}${volume.nameVolume} (Ціна: ${volume.price}) для товару ID: ${goods.id}`,
        );

        // --- 6. Обробка Img (зображення) ---
        // Якщо у CSV є кілька URL-адрес зображень, розділених комою, беремо тільки перше для основної картинки
        const imageUrls = row.img
          ? row.img
              .split(',')
              .map((url) => url.trim())
              .filter((url) => url !== '')
          : [];
        const mainImageUrl = imageUrls[0] || ''; // Беремо перше посилання, або порожній рядок

        // Завантажуємо зображення та отримуємо локальне ім'я файлу
        const localImageFilename = await downloadImage(mainImageUrl, row.id);

        await Img.create({
          img: localImageFilename, // Зберігаємо локальне ім'я файлу (uuid.png або no-image.png)
          volumeuk: `${volume.volume} ${volume.nameVolume} [UA]`, // Використовуємо спарсений об'єм
          volumeru: `${volume.volume} ${volume.nameVolume} [RU]`, // Використовуємо спарсений об'єм
          volumeId: volume.id,
        });
        console.log(
          `[ID товару: ${row.id}]   Створено зображення для об'єму: ${localImageFilename}`,
        );
      }

      console.log('Імпорт даних завершено успішно!');
    } catch (error) {
      console.error('Помилка під час імпорту даних:', error);
      throw error; // Перекидаємо помилку далі, щоб її можна було обробити у точці виклику
    }
  }
}

module.exports = ParseFromFile;
