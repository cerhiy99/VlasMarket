// searchController.js

const sequelize = require('../db');
const { Op, literal } = require('sequelize');
const {
  Goods,
  CountryMade,
  Category,
  Subcategory,
  Volume,
} = require('../models/models');
const UkrToEng = require('./utils/UkrToEng');

class SearchController {
  /**
   * Забезпечує пошукові підказки (категорії, підкатегорії, країни, товари)
   * на основі введеного користувачем запиту, повертаючи їх окремими масивами.
   *
   * @param {object} req - Об'єкт запиту Express. Очікується `req.query.query` як пошуковий текст.
   * @param {object} res - Об'єкт відповіді Express.
   * @param {function} next - Функція наступного проміжного програмного забезпечення.
   * @returns {Promise<void>} - Надсилає JSON відповідь з підказками або помилкою.
   */
  async getSuggestions(req, res, next) {
    try {
      const { query } = req.query;

      if (!query || typeof query !== 'string' || query.trim() === '') {
        // Якщо запит порожній або невалідний, повертаємо порожні масиви
        return res.json({
          products: [],
          categories: [],
          subcategories: [],
          countries: [],
        });
      }

      const lowerCaseQuery = query.toLowerCase().trim();
      const limit = 5; // Кількість підказок для кожного типу

      const results = {
        products: [],
        categories: [],
        subcategories: [],
        countries: [],
      };

      // 1. Пошук в Категоріях
      const categories = await Category.findAll({
        where: {
          [Op.or]: [
            sequelize.where(
              sequelize.fn('LOWER', sequelize.col('nameuk')),
              Op.like,
              `%${lowerCaseQuery}%`,
            ),
            sequelize.where(
              sequelize.fn('LOWER', sequelize.col('nameru')),
              Op.like,
              `%${lowerCaseQuery}%`,
            ),
          ],
        },
        limit: limit,
      });
      categories.forEach((cat) => {
        results.categories.push({
          id: cat.id,
          nameuk: cat.nameuk,
          nameru: cat.nameru,
          link: `/goods/${UkrToEng(cat.nameru)}/1`, // Замініть на slug, якщо використовуєте
        });
      });

      // 2. Пошук в Підкатегоріях
      const subcategories = await Subcategory.findAll({
        where: {
          [Op.or]: [
            sequelize.where(
              sequelize.fn('LOWER', sequelize.col('subcategory.nameuk')), // 👈 додав префікс
              {
                [Op.like]: `%${lowerCaseQuery}%`,
              },
            ),
            sequelize.where(
              sequelize.fn('LOWER', sequelize.col('subcategory.nameru')), // 👈 теж тут
              {
                [Op.like]: `%${lowerCaseQuery}%`,
              },
            ),
          ],
        },
        include: {
          model: Category,
        },
        limit: limit,
      });

      subcategories.forEach((subcat) => {
        results.subcategories.push({
          id: subcat.id,
          nameuk: subcat.nameuk,
          nameru: subcat.nameru,
          link: `/goods/${UkrToEng(subcat.category.nameru)}/${UkrToEng(subcat.nameru)}/1`,
        });
      });

      // 3. Пошук в Країнах-виробниках
      const countries = await CountryMade.findAll({
        where: {
          [Op.or]: [
            sequelize.where(
              sequelize.fn('LOWER', sequelize.col('nameuk')),
              Op.like,
              `%${lowerCaseQuery}%`,
            ),
            sequelize.where(
              sequelize.fn('LOWER', sequelize.col('nameru')),
              Op.like,
              `%${lowerCaseQuery}%`,
            ),
          ],
        },
        limit: limit,
      });
      countries.forEach((country) => {
        results.countries.push({
          id: country.id,
          nameuk: country.nameuk,
          nameru: country.nameru,
          link: `/goods/1?country=${country.id}`,
        });
      });

      // 4. Пошук в Товарах
      const goods = await Goods.findAll({
        where: {
          isShow: true,
          [Op.or]: [
            literal(`LOWER(goods.nameuk) LIKE '%${lowerCaseQuery}%'`),
            literal(`LOWER(goods.nameru) LIKE '%${lowerCaseQuery}%'`),
            literal(`LOWER(volumes.art) LIKE '%${lowerCaseQuery}%'`),
          ],
        },
        limit: limit,
        subQuery: false, // ЦЕ КЛЮЧОВА ЗМІНА
        include: [
          {
            model: Volume,
            attributes: ['id', 'art', 'url'],
            required: false,
          },
        ],
      });
      console.log(343, goods);
      goods.forEach((item) => {
        results.products.push({
          id: item.id,
          nameuk: item.nameuk,
          nameru: item.nameru,
          art: item.art, // Додаємо артикул, може бути корисним для відображення
          link: `/goods/${item.volumes[0].url}`,
        });
      });

      return res.json(results);
    } catch (e) {
      console.error('Помилка в SearchController.getSuggestions:', e);
      return res.status(500).json({
        message:
          e.message || 'Невідома помилка сервера під час пошуку підказок.',
      });
    }
  }
}

module.exports = new SearchController();
