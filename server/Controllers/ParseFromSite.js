const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const {
  Goods,
  CountryMade,
  Category,
  Subcategory,
  Linia,
} = require('../models/models'); // Припустимо, що моделі знаходяться у папці 'models'
const { Op, Sequelize: sequelize } = require('sequelize');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, 300));

// Клас для парсингу з сайту
class ParseFromSite {
  static parseParseCurrentProduct = async (urluk, urlru) => {
    try {
      console.log(
        `Починаємо парсинг продукту з URL: ${urluk} (UA) та ${urlru} (RU)`,
      );
      await sleep(1000);
      const ukPageResponse = await axios.get(urluk, { timeout: 30000 });
      const $uk = cheerio.load(ukPageResponse.data);
      await sleep(2000);

      const ruPageResponse = await axios.get(urlru, { timeout: 30000 });
      const $ru = cheerio.load(ruPageResponse.data);

      const productDataUK = {};
      productDataUK.article = $uk('div.commerce-product-sku')
        .text()
        .replace('Артикул:', '')
        .trim();
      productDataUK.name = $uk('h1.field-name-title-field')
        .text()
        .trim();
      productDataUK.description =
        $uk('div.field-name-body')
          .html()
          ?.trim() || '';
      productDataUK.country = $uk(
        'div.field-name-field-country .field-item.even',
      )
        .text()
        .trim();

      const breadcrumbsUK = [];
      $uk('div.breadcrumb a').each((index, element) => {
        const title = $uk(element)
          .text()
          .trim();
        let url = $uk(element).attr('href');
        if (url && !url.startsWith('http')) {
          url = `https://constant-delight.com.ua${url}`;
        }
        breadcrumbsUK.push({ title, url });
      });
      productDataUK.breadcrumbs = breadcrumbsUK;

      const productDataRU = {};
      productDataRU.article = $ru('div.commerce-product-sku')
        .text()
        .replace('Артикул:', '')
        .trim();
      productDataRU.name = $ru('h1.field-name-title-field')
        .text()
        .trim();
      productDataRU.description =
        $ru('div.field-name-body')
          .html()
          ?.trim() || '';
      productDataRU.country = $ru(
        'div.field-name-field-country .field-item.even',
      )
        .text()
        .trim();

      const breadcrumbsRU = [];
      $ru('div.breadcrumb a').each((index, element) => {
        const title = $ru(element)
          .text()
          .trim();
        let url = $ru(element).attr('href');
        if (url && !url.startsWith('http')) {
          url = `https://constant-delight.com.ua${url}`;
        }
        breadcrumbsRU.push({ title, url });
      });
      productDataRU.breadcrumbs = breadcrumbsRU;

      console.log('\n--- Зібрані дані з сайту ---');
      console.log('Артикул:', productDataUK.article);
      console.log('Назва (UA):', productDataUK.name);
      console.log('Назва (RU):', productDataRU.name);
      console.log('Країна (UA):', productDataUK.country);
      // console.log('Країна (RU):', productDataRU.country); // Прибрано зайвий console.log
      console.log('Хлібні крихти (UA):', productDataUK.breadcrumbs);
      // console.log('Хлібні крихти (RU):', productDataRU.breadcrumbs); // Прибрано зайвий console.log

      console.log('\n--- Оновлення бази даних ---');

      // 1. Оновлення товару (Goods) за артикулом
      const [updatedRowsCountGoods] = await Goods.update(
        {
          nameuk: productDataUK.name,
          nameru: productDataRU.name,
          descriptionuk: productDataUK.description,
          descriptionru: productDataRU.description,
        },
        {
          where: { art: productDataUK.article },
        },
      );
      if (updatedRowsCountGoods > 0) {
        console.log(
          `Оновлено інформацію для товару з артикулом **${productDataUK.article}**.`,
        );
      } else {
        console.log(
          `Товар з артикулом **${productDataUK.article}** не знайдено для оновлення.`,
        );
      }

      // 2. Оновлення countryMadeId для товару
      let countryId = null;
      if (productDataRU.country) {
        const countryRecord = await CountryMade.findOne({
          where: sequelize.where(
            sequelize.fn('LOWER', sequelize.col('nameru')),
            Op.eq,
            productDataRU.country.toLowerCase().trim(),
          ),
        });

        if (countryRecord) {
          // Оновлюємо nameuk для країни, якщо знайдено
          if (countryRecord.nameuk !== productDataUK.country.trim()) {
            await countryRecord.update({
              nameuk: productDataUK.country.trim(),
            });
            console.log(
              `Оновлено українську назву країни '${
                countryRecord.nameru
              }' на **${productDataUK.country.trim()}**.`,
            );
          }
          countryId = countryRecord.id;
          await Goods.update(
            { countryMadeId: countryId },
            { where: { art: productDataUK.article } },
          );
          console.log(
            `Оновлено країну виробника для товару **${productDataUK.article}** на ID: **${countryId}**.`,
          );
        } else {
          console.log(
            `Країну виробника '${productDataRU.country}' не знайдено в базі даних.`,
          );
        }
      }

      // 3. Обробка хлібних крихт (категорії та ПЕРШОЇ підкатегорії)
      if (productDataRU.breadcrumbs.length > 2) {
        const categoryBreadcrumbRU = productDataRU.breadcrumbs[2];
        const categoryBreadcrumbUK = productDataUK.breadcrumbs[2];
        let currentCategoryId = null;

        if (categoryBreadcrumbRU) {
          // 3.1. Обробка Категорії (третя крихта)
          let categoryRecord = await Category.findOne({
            where: sequelize.where(
              sequelize.fn('LOWER', sequelize.col('nameru')),
              Op.eq,
              categoryBreadcrumbRU.title.toLowerCase().trim(),
            ),
          });

          if (categoryRecord) {
            if (categoryRecord.nameuk !== categoryBreadcrumbUK.title.trim()) {
              await categoryRecord.update({
                nameuk: categoryBreadcrumbUK.title.trim(),
              });
              console.log(
                `Оновлено українську назву категорії '${
                  categoryRecord.nameru
                }' на **${categoryBreadcrumbUK.title.trim()}**.`,
              );
            } else {
              // console.log(`Українська назва категорії '${categoryRecord.nameru}' вже актуальна.`); // Прибрано зайвий console.log
            }
            currentCategoryId = categoryRecord.id;
          } else {
            console.log(
              `Категорію **'${categoryBreadcrumbRU.title}'** не знайдено в базі даних. Підкатегорії для цього товару не будуть оброблені.`,
            );
          }
        }

        // 3.2. Обробка ПЕРШОЇ Підкатегорії (четверта крихта, якщо існує)
        // та оновлення subcategoryId у товарі
        if (productDataRU.breadcrumbs.length > 3 && currentCategoryId) {
          const subcategoryBreadcrumbRU = productDataRU.breadcrumbs[3];
          const subcategoryBreadcrumbUK = productDataUK.breadcrumbs[3];

          if (subcategoryBreadcrumbRU) {
            let subcategoryRecord = await Subcategory.findOne({
              where: {
                categoryId: currentCategoryId,
                [Op.and]: sequelize.where(
                  sequelize.fn('LOWER', sequelize.col('nameru')),
                  Op.eq,
                  subcategoryBreadcrumbRU.title.toLowerCase().trim(),
                ),
              },
            });

            if (!subcategoryRecord) {
              subcategoryRecord = await Subcategory.create({
                nameuk: subcategoryBreadcrumbUK.title.trim(),
                nameru: subcategoryBreadcrumbRU.title.trim(),
                categoryId: currentCategoryId,
                img: '',
              });
              console.log(
                `Створено нову підкатегорію **'${subcategoryBreadcrumbRU.title}'** в категорії ID:**${currentCategoryId}**.`,
              );
            } else {
              // Перевіряємо та оновлюємо українську назву підкатегорії, якщо відрізняється
              if (
                subcategoryRecord.nameuk !==
                subcategoryBreadcrumbUK.title.trim()
              ) {
                await subcategoryRecord.update({
                  nameuk: subcategoryBreadcrumbUK.title.trim(),
                });
                console.log(
                  `Оновлено українську назву підкатегорії '${
                    subcategoryRecord.nameru
                  }' на **${subcategoryBreadcrumbUK.title.trim()}**.`,
                );
              }
              // console.log(`Підкатегорія '${subcategoryBreadcrumbRU.title}' вже існує в категорії ID:${currentCategoryId}.`); // Прибрано зайвий console.log
            }

            if (subcategoryRecord) {
              await Goods.update(
                { subcategoryId: subcategoryRecord.id },
                { where: { art: productDataUK.article } },
              );
              console.log(
                `Оновлено subcategoryId для товару **${productDataUK.article}** на ID: **${subcategoryRecord.id}**.`,
              );
            }
          }
        } else if (currentCategoryId) {
          console.log('Немає підкатегорій для обробки (хлібних крихт < 4).');
          // Якщо підкатегорії немає, можливо, потрібно скинути subcategoryId в null для товару
          // await Goods.update(
          //     { subcategoryId: null },
          //     { where: { art: productDataUK.article } }
          // );
          // console.log(`Встановлено subcategoryId в NULL для товару ${productDataUK.article}.`);
        } else {
          // console.log('Категорію не знайдено, підкатегорії не оброблялися.'); // Прибрано зайвий console.log
        }
      } else {
        console.log(
          'Недостатньо хлібних крихт для обробки категорій/підкатегорій (потрібно мінімум 3).',
        );
      }

      console.log('\nОновлення бази даних завершено.');
      return {
        uk: productDataUK,
        ru: productDataRU,
      };
    } catch (err) {
      console.error(
        `Помилка при парсингу продукту та оновленні БД за посиланнями ${urluk} та ${urlru}:`,
        err.message,
      );
      throw err;
    }
  };

  static getAllUrl = () => {
    try {
      const filePath = path.join(__dirname, 'urlForProduct.jsonl');

      // Перевіряємо, чи існує файл
      if (!fs.existsSync(filePath)) {
        console.error(`Файл за посиланням не знайдено: ${filePath}`);
        return [];
      }

      console.log(
        `Починаємо читання файлу: ${filePath} для отримання URL-адрес товарів.`,
      );

      const urls = [];
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const lines = fileContent
        .split('\n')
        .filter((line) => line.trim() !== '');

      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          // Кожен об'єкт містить ключ, наприклад "page1", "page2"
          for (const pageKey in data) {
            if (Array.isArray(data[pageKey])) {
              for (const ruUrl of data[pageKey]) {
                if (
                  typeof ruUrl === 'string' &&
                  ruUrl.includes('constant-delight.com.ua/products/')
                ) {
                  // Генеруємо український URL: вставляємо '/uk/' після домену
                  const ukUrl = ruUrl.replace(
                    'constant-delight.com.ua/products/',
                    'constant-delight.com.ua/uk/products/',
                  );
                  urls.push({ urlru: ruUrl, urluk: ukUrl });
                } else {
                  console.warn(`Пропущено невалідний URL у файлі: ${ruUrl}`);
                }
              }
            }
          }
        } catch (parseError) {
          console.error(
            `Помилка парсингу JSON рядка: ${line}. Помилка: ${parseError.message}`,
          );
        }
      }
      console.log(
        `Завершено читання файлу. Зчитано ${urls.length} пар URL-адрес (UA/RU).`,
      );
      return urls;
    } catch (err) {
      console.error(
        'Критична помилка при читанні файлу urlForProduct.jsonl:',
        err.message,
      );
      // Можна знову викинути помилку, або повернути порожній масив, залежить від потрібної поведінки
      throw err;
    }
  };
  static ParseAllProducts = async () => {
    try {
      const urls = this.getAllUrl();
      for (let i = 0; i < urls.length; i++) {
        console.log(`Парсинг ${i + 1}/${urls.length}`);
        try {
          await this.parseParseCurrentProduct(urls[i].urluk, urls[i].urlru);
        } catch (err) {
          console.log(`Помилка парсингу товару ${urls[i].urluk} ` + err);
        }
      }
    } catch (err) {
      console.log('Помилка парсингу всіх товарів');
    }
  };
  /**
   * Метод для збору URL-адрес товарів зі сторінок пагінації сайту.
   * Зберігає знайдені URL-адреси у файл urlForProduct.jsonl (JSON Lines).
   * @returns {Promise<object>} - Об'єкт з інформацією про статус та шлях до файлу.
   */
  static getUrl = async () => {
    const baseUrl = 'https://constant-delight.com.ua/products';
    const totalPages = 472;

    const filePath = path.join(__dirname, 'urlForProduct.jsonl');

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Видалено існуючий файл: ${filePath}`);
    }

    console.log(
      'Починаємо парсинг URL-адрес товарів з сайту у форматі JSON Lines...',
    );

    let totalUrlsCollected = 0;

    try {
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        let currentPageUrl;
        if (pageNum === 1) {
          currentPageUrl = baseUrl;
        } else {
          currentPageUrl = `${baseUrl}?page=${pageNum - 1}`;
        }

        console.log(
          `Парсинг сторінки: ${currentPageUrl} (Сторінка ${pageNum} з ${totalPages})`,
        );

        try {
          const { data } = await axios.get(currentPageUrl, { timeout: 20000 });
          const $ = cheerio.load(data);
          const pageUrls = new Set();
          // !!! Оновлений селектор, включаючи section id='section-content' !!!
          $('#section-content .item-list ul li span div a').each(
            (index, element) => {
              const productUrl = $(element).attr('href');
              if (productUrl) {
                if (productUrl.startsWith('http')) {
                  pageUrls.add(productUrl);
                } else {
                  pageUrls.add(`https://constant-delight.com.ua${productUrl}`);
                }
              }
            },
          );

          const urlsForThisPage = Array.from(pageUrls);
          const pageData = { [`page${pageNum}`]: urlsForThisPage };

          fs.appendFileSync(filePath, JSON.stringify(pageData) + '\n', 'utf8');
          totalUrlsCollected += urlsForThisPage.length;

          console.log(
            `   Зібрано ${urlsForThisPage.length} URL-адрес для Сторінки ${pageNum}. Записано у файл.`,
          );
        } catch (pageError) {
          console.error(
            `Помилка при завантаженні або парсингу сторінки ${currentPageUrl}:`,
            pageError.message,
          );
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }

      console.log(
        `Парсинг завершено. Усі URL-адреси товарів збережено у файл: ${filePath}`,
      );
      console.log(
        `Загальна кількість URL-адрес (з урахуванням унікальності на кожній сторінці): ${totalUrlsCollected}`,
      );

      return {
        status: 'success',
        filePath: filePath,
        totalUrlsProcessed: totalUrlsCollected,
      };
    } catch (err) {
      console.error('Критична помилка при парсингу сайту:', err);
      throw err;
    }
  };
  static parseAllLine = async () => {
    try {
      const urls = this.getAllUrl();
      for (let i = 0; i < urls.length; i++) {
        console.log(`Парсинг ${i + 1}/${urls.length}`);
        try {
          await this.parseLineFromProduct(urls[i].urluk);
        } catch (err) {
          console.log(`Помилка парсингу товару ${urls[i].urluk} ` + err);
        }
      }
    } catch (err) {
      console.log('Помилка парсингу всіх товарів');
    }
  };
  static async parseLineFromProduct(url) {
    try {
      const response = await axios.get(url, { timeout: 30000 });
      const $ = cheerio.load(response.data);

      // 1. Парсимо артикул
      const article = $('div.commerce-product-sku')
        .text()
        .replace('Артикул:', '')
        .trim();

      if (!article) return;

      // 2. Шукаємо товар по артикулу
      const product = await Goods.findOne({ where: { art: article } });
      if (!product) return;

      // 3. Парсимо лінію
      const lineText = $('div.field-name-field-line .field-items')
        .text()
        .trim();

      if (!lineText) return;

      // 4. Шукаємо/створюємо лінію
      let linia = await Linia.findOne({ where: { name: lineText } });
      if (!linia) {
        linia = await Linia.create({ name: lineText });
      }

      // 5. Оновлюємо товар
      await product.update({ liniaId: linia.id });
    } catch (error) {
      console.error(`❌ Помилка при парсингу ${url}:`, error.message);
    }
  }
}

module.exports = ParseFromSite;
