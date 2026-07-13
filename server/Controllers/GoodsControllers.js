const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const {
  Goods,
  Img,
  Volume,
  ProductCategoryFilter,
  Brends,
  CountryMade,
  Subcategory,
  Category,
  FilterCategory,
  GoodsViews,
  Linia,
  ProductRecognition,
  Recognition,
  Reviews,
} = require('../models/models');
const ErrorApi = require('../error/ErrorApi');
const { Op, Sequelize, fn, literal, QueryTypes } = require('sequelize');
const { Sequelize: sequelize } = require('sequelize');
const EngToUkr = require('./utils/EngToUkr');

const uploadDir = path.join(__dirname, '..', 'static', 'uploads'); // наприклад
const levenshtein = require('fast-levenshtein');
const ConvertPngToWebP = require('./ConvertPngToWebP');
const SetUrlToVolume = require('./SetUrlToVolume');
const UkrToEng = require('./utils/UkrToEng');
const toSlug = require('./utils/ToSlug');
const ImageToFullName = require('./ImageToFullName');
const sequelizeWithDB = require('../db');

function normalize(name) {
  return name.replace(/-/g, ' ');
}

class GoodsControllers {
  static GetMiniGoods = async (req, resp, next) => {
    try {
      let { goodsIdes } = req.query;

      goodsIdes = JSON.parse(goodsIdes); // очікуємо масив [1,2,3]

      const goods = await Goods.findAll({
        where: {
          id: {
            [Op.in]: goodsIdes,
          },
        },
        include: [
          {
            model: Volume,
            include: [
              {
                model: Img,
              },
            ],
          },
          {
            model: Subcategory,
            attributes: ['id'],
            include: [
              {
                model: Category,
              },
            ],
          },
        ],
      });

      return resp.json({ goods });
    } catch (err) {
      console.log(434, err);
      return next(ErrorApi.badRequest(err));
    }
  };

  static GetForBasketOrLike = async (req, resp, next) => {
    try {
      const { idVolume, idGoods } = req.query;
      const goods = await Goods.findOne({
        where: { id: parseInt(idGoods) },
        include: [
          {
            model: Volume,
            where: { id: parseInt(idVolume) },
            include: [{ model: Img }],
          },
        ],
      });
      return resp.json(goods);
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetGoods = async (req, resp, next) => {
    try {
      let {
        page,
        limit,
        isDiscount,
        isBestseller,
        isNovetly,
        isHit,
        isFreeDelivery,
        category,
        subcategory,
        brend,
        minprice,
        maxprice,
        search,
        country,
        sort,
        brendName,
        article,
        inAdmin,
        isShow,
        linia,
        recognition,
        isForMan,
        delLeng,
        isLeaveCategoryAndSubcategory,
        ...productFilterParams
      } = req.query;
      isLeaveCategoryAndSubcategory = isLeaveCategoryAndSubcategory == 'true';
      let realNameBrend = '';
      let realNameBrendWithLang = '';
      let realDescriptionBrend = '';
      if (brendName) {
        const normalizedSlug = normalize(brendName);

        const brendId = await Brends.findOne({
          where: sequelize.where(
            sequelize.fn('LOWER', sequelize.col('name')),
            normalizedSlug
          ),
        });
        if (brendId) {
          realNameBrend = brendId.name;
          brend = brendId.id + ',';
          let lang = 'uk';
          if (delLeng) {
            lang = delLeng == 'ru' ? 'uk' : 'ru';
          }
          realDescriptionBrend = brendId[`description${lang}`];
          realNameBrendWithLang = brendId[`name${lang}`];
        }
      }
      const goodsWhere = {};
      const volumeWhere = {};
      let categoryToReturn;
      let subcategoryToRetun;

      // --- 1. Обробка булевих фільтрів ---
      if (typeof isDiscount !== 'undefined')
        goodsWhere.isDiscount = isDiscount === 'true';
      if (typeof isBestseller !== 'undefined')
        goodsWhere.isBestseller = isBestseller === 'true';
      if (typeof isNovetly !== 'undefined')
        goodsWhere.isNovetly = isNovetly === 'true';
      if (typeof isHit !== 'undefined') goodsWhere.isHit = isHit === 'true';
      if (typeof isFreeDelivery !== 'undefined')
        goodsWhere.isFreeDelivery = isFreeDelivery === 'true';
      if (typeof article == 'string') volumeWhere.art = article;
      if (typeof isShow == 'string') {
        if (isShow == '1') {
          goodsWhere.isShow = true;
        } else if (isShow == '0') goodsWhere.isShow = false;
      } else {
        goodsWhere.isShow = true;
      }

      // --- 2. Обробка фільтрів за ID (Category, Subcategory, Brend, Country, Linia) ---
      let selectedCategoryId = null;
      if (category) {
        if (isNaN(category)) {
          const nameUkrCategory = EngToUkr(category);
          let categoryFromBD = await Category.findOne({
            where: { nameru: nameUkrCategory },
          });
          if (!categoryFromBD) {
            const allCategories = await Category.findAll();
            let bestMatch = null;
            let minDistance = Infinity;

            allCategories.forEach((cat) => {
              const distance = levenshtein.get(
                cat.nameru.toLowerCase(),
                nameUkrCategory.toLowerCase()
              );
              if (distance < minDistance) {
                minDistance = distance;
                bestMatch = cat;
              }
            });

            categoryFromBD = bestMatch;
          }
          selectedCategoryId = categoryFromBD.id;
          categoryToReturn = categoryFromBD;
        } else {
          selectedCategoryId = parseInt(category);
        }
        if (!isNaN(selectedCategoryId)) {
          goodsWhere.categoryId = selectedCategoryId;
        }
      }

      if (subcategory) {
        let subcategoryIds;
        if (!subcategory.includes(',') && isNaN(subcategory)) {
          const nameUkrSubcategory = EngToUkr(subcategory);
          let subcategoryFromDB = await Subcategory.findOne({
            where: { nameru: nameUkrSubcategory },
          });

          if (!subcategoryFromDB) {
            const allCategories = await Subcategory.findAll();
            let bestMatch = null;
            let minDistance = Infinity;

            allCategories.forEach((cat) => {
              const distance = levenshtein.get(
                cat.nameru.toLowerCase(),
                nameUkrSubcategory.toLowerCase()
              );
              if (distance < minDistance) {
                minDistance = distance;
                bestMatch = cat;
              }
            });

            subcategoryFromDB = bestMatch;
          }

          goodsWhere.subcategoryId = subcategoryFromDB.id;
          subcategoryToRetun = subcategoryFromDB;
        } else {
          subcategoryIds = subcategory
            .split(',')
            .map((id) => parseInt(id.trim()))
            .filter((id) => !isNaN(id));

          if (subcategoryIds.length > 0) {
            goodsWhere.subcategoryId = { [Op.in]: subcategoryIds };
          }
        }
      }

      if (brend) {
        const brendIds = brend
          .split(',')
          .map((id) => parseInt(id.trim()))
          .filter((id) => !isNaN(id));
        if (brendIds.length > 0) {
          goodsWhere.brendId = { [Op.in]: brendIds };
        }
      }

      if (isForMan === 'true') {
        goodsWhere.isForMan = {
          [Op.or]: [true, null],
        };
      } else if (isForMan === 'false') {
        goodsWhere.isForMan = {
          [Op.or]: [false, null],
        };
      }

      if (country) {
        const countryIds = country
          .split(',')
          .map((id) => parseInt(id.trim()))
          .filter((id) => !isNaN(id));
        if (countryIds.length > 0) {
          goodsWhere.countryMadeId = { [Op.in]: countryIds };
        }
      }

      // --- НОВИЙ ФІЛЬТР: Лінія (linia) ---
      if (linia) {
        const liniaIds = linia
          .split(',')
          .map((id) => parseInt(id.trim()))
          .filter((id) => !isNaN(id));
        if (liniaIds.length > 0) {
          goodsWhere.liniaId = { [Op.in]: liniaIds };
        }
      }

      // --- 3. Обробка фільтрів за ціною (minprice, maxprice) ---
      const currentPriceConditions = {};
      if (minprice) {
        const minPriceNum = parseFloat(minprice);
        if (!isNaN(minPriceNum)) {
          currentPriceConditions[Op.gte] = minPriceNum;
        }
      }
      if (maxprice) {
        const maxPriceNum = parseFloat(maxprice);
        if (!isNaN(maxPriceNum)) {
          currentPriceConditions[Op.lte] = maxPriceNum;
        }
      }

      if (
        Object.keys(currentPriceConditions).length > 0 ||
        Object.getOwnPropertySymbols(currentPriceConditions).length > 0
      ) {
        volumeWhere.priceWithDiscount = currentPriceConditions;
      }

      // --- 4. Обробка текстового пошуку (search) ---
      if (search) {
        const lowerCaseSearch = search.toLowerCase().trim();
        goodsWhere[Op.or] = [
          { nameuk: { [Op.like]: `%${lowerCaseSearch}%` } },
          { nameru: { [Op.like]: `%${lowerCaseSearch}%` } },
          { descriptionuk: { [Op.like]: `%${lowerCaseSearch}%` } },
          { descriptionru: { [Op.like]: `%${lowerCaseSearch}%` } },
          { art: { [Op.like]: `%${lowerCaseSearch}%` } },
        ];
      }

      // --- 5. Пагінація ---
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 5;
      const offset = (page - 1) * limit;

      // --- Фільтрація за атрибутами товару через підзапити (для основного запиту) ---
      const goodIdsFromProductFilters = [];

      for (const key in productFilterParams) {
        if (key.startsWith('filter_')) {
          const filterCategoryId = parseInt(key.replace('filter_', ''));
          const selectedValuesString = productFilterParams[key];

          if (
            !isNaN(filterCategoryId) &&
            typeof selectedValuesString === 'string'
          ) {
            const selectedValues = selectedValuesString
              .split(',')
              .map((val) => val.trim())
              .filter((val) => val !== '');

            if (selectedValues.length > 0) {
              const valueConditions = selectedValues.map((val) => ({
                [Op.or]: [
                  sequelize.literal(
                    `FIND_IN_SET('${val}', \`productCategoryFilters\`.\`valueuk\`) > 0`
                  ),
                  sequelize.literal(
                    `FIND_IN_SET('${val}', \`productCategoryFilters\`.\`valueru\`) > 0`
                  ),
                ],
              }));

              const goodIdsPromise = Goods.findAll({
                attributes: ['id'],
                include: [
                  {
                    model: ProductCategoryFilter,
                    as: 'productCategoryFilters',
                    where: {
                      filterCategoryId: filterCategoryId,
                      [Op.or]: valueConditions,
                    },
                    required: true,
                    attributes: [],
                  },
                ],
                raw: true,
                group: ['goods.id'],
              }).then((results) => results.map((item) => item.id));

              goodIdsFromProductFilters.push(goodIdsPromise);
            }
          }
        }
      }

      // --- НОВИЙ ФІЛЬТР: Фільтрація за Recognition (через підзапит) ---
      if (recognition) {
        const recognitionIds = recognition
          .split(',')
          .map((id) => parseInt(id.trim()))
          .filter((id) => !isNaN(id));

        if (recognitionIds.length > 0) {
          const recognitionIdsPromise = Goods.findAll({
            attributes: ['id'],
            include: [
              {
                model: ProductRecognition,
                where: { recognitionId: { [Op.in]: recognitionIds } },
                required: true,
                attributes: [],
              },
            ],
            raw: true,
            group: ['goods.id'],
          }).then((results) => results.map((item) => item.id));

          goodIdsFromProductFilters.push(recognitionIdsPromise);
        }
      }

      const resolvedGoodIdsArrays = await Promise.all(
        goodIdsFromProductFilters
      );

      let finalGoodIds = null;
      if (resolvedGoodIdsArrays.length > 0) {
        finalGoodIds = resolvedGoodIdsArrays.reduce(
          (intersectionSet, currentArray) => {
            if (intersectionSet === null) {
              return new Set(currentArray);
            }
            const newIntersection = new Set();
            currentArray.forEach((id) => {
              if (intersectionSet.has(id)) {
                newIntersection.add(id);
              }
            });
            return newIntersection;
          },
          null
        );

        if (finalGoodIds && finalGoodIds.size > 0) {
          goodsWhere.id = { [Op.in]: Array.from(finalGoodIds) };
        } else if (
          finalGoodIds &&
          finalGoodIds.size === 0 &&
          resolvedGoodIdsArrays.length > 0
        ) {
          goodsWhere.id = { [Op.in]: [] };
        }
      }
      let volumesSort = [
        [Sequelize.literal('ISNULL(`sort`)'), 'ASC'],
        ['sort', 'ASC'],
      ];
      if (sort && sort.startsWith('price')) {
        volumesSort = [
          ['priceWithDiscount', sort == 'price_asc' ? 'asc' : 'desc'],
        ];
      }

      // --- 6. Формуємо includeOptions для основного запиту ---
      const mainIncludeOptions = [
        {
          model: Volume,
          as: 'volumes',
          separate: typeof article != 'string',
          order: volumesSort,
          include: [{ model: Img, as: 'imgs' }],
          where: Object.keys(volumeWhere).length > 0 ? volumeWhere : undefined,
          required: Object.keys(volumeWhere).length > 0,
        },
        { model: Brends, as: 'brend', attributes: ['id', 'name'] },
        {
          model: CountryMade,
          as: 'countryMade',
          attributes: ['nameuk', 'nameru'],
        },
        {
          model: Subcategory,
          as: 'subcategory',
          attributes: ['id', 'nameuk', 'nameru'],
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'nameuk', 'nameru'],
        },
        { model: Linia, as: 'linium' }, // <--- ВИПРАВЛЕНО
        {
          model: ProductRecognition,
          as: 'productRecognitions',
          include: [{ model: Recognition }],
        },
        {
          model: Reviews,
          attributes: ['id'],
          where: { isShow: true },
          separate: true,
        },
      ];

      // --- ЛОГІКА СОРТУВАННЯ ---
      let orderOptions = [];
      switch (sort) {
        case 'popularity':
          orderOptions.push(['views', 'DESC']);
          break;
        case 'price_asc':
          orderOptions.push([
            Sequelize.literal(`(
                SELECT MIN(v.priceWithDiscount)
                FROM volumes AS v
                WHERE v.goodId = goods.id
              )`),
            'ASC',
          ]);
          break;
        case 'price_desc':
          orderOptions.push([
            Sequelize.literal(`(
                SELECT MIN(v.priceWithDiscount)
                FROM volumes AS v
                WHERE v.goodId = goods.id
              )`),
            'DESC',
          ]);
          break;
        case 'name_ua':
          orderOptions.push(['nameuk', 'ASC']);
          break;
        case 'name_ru':
          orderOptions.push(['nameru', 'ASC']);
          break;
        case 'requests_desc':
          orderOptions.push(['views', 'DESC']);
          break;
        case 'rating_desc':
          orderOptions.push([
            Sequelize.literal(`(
                SELECT AVG(r.rating)
                FROM reviews AS r
                WHERE r.goodsId = goods.id AND r.rating IS NOT NULL AND r.isShow = true
              )`),
            'DESC',
          ]);
          break;
        default:
          orderOptions.push(['id', 'DESC']);
          break;
      }

      // --- 7. Виконання основного запиту на товари ---
      const goodsResult = await Goods.findAndCountAll({
        where: goodsWhere,
        include: mainIncludeOptions,
        limit,
        offset,
        order: orderOptions,
        distinct: true,
        attributes: {
          include: [
            [
              Sequelize.literal(`(
          SELECT AVG(r.rating)
          FROM reviews AS r
          WHERE r.goodsId = goods.id
            AND r.rating IS NOT NULL
            AND r.isShow = true
        )`),
              'averageRating',
            ],
          ],
        },
      });

      const totalGoods = goodsResult.count;
      const totalPages = Math.ceil(totalGoods / limit);

      // --- 8. Отримання списків для доступних фільтрів та цінового діапазону ---
      const filters = {};

      // Оновлена функція-хелпер для отримання унікальних ID пов'язаних моделей
      const getDistinctRelatedIds = async (foreignKey) => {
        const tempGoodsWhere = { ...goodsWhere };
        delete tempGoodsWhere[foreignKey]; // Видаляємо поточний фільтр

        // Використовуємо тимчасовий Good IDs, якщо були інші фільтри по атрибутах
        const tempGoodIdsFromProductFilters = [];
        for (const key in productFilterParams) {
          if (key.startsWith('filter_')) {
            const filterCategoryId = parseInt(key.replace('filter_', ''));
            const selectedValuesString = productFilterParams[key];
            if (
              !isNaN(filterCategoryId) &&
              typeof selectedValuesString === 'string'
            ) {
              const selectedValues = selectedValuesString
                .split(',')
                .map((val) => val.trim())
                .filter((val) => val !== '');
              if (selectedValues.length > 0) {
                const valueConditions = selectedValues.map((val) => ({
                  [Op.or]: [
                    sequelize.literal(
                      `FIND_IN_SET('${val}', \`productCategoryFilters\`.\`valueuk\`) > 0`
                    ),
                    sequelize.literal(
                      `FIND_IN_SET('${val}', \`productCategoryFilters\`.\`valueru\`) > 0`
                    ),
                  ],
                }));
                tempGoodIdsFromProductFilters.push(
                  Goods.findAll({
                    attributes: ['id'],
                    include: [
                      {
                        model: ProductCategoryFilter,
                        as: 'productCategoryFilters',
                        where: {
                          filterCategoryId: filterCategoryId,
                          [Op.or]: valueConditions,
                        },
                        required: true,
                        attributes: [],
                      },
                    ],
                    raw: true,
                    group: ['goods.id'],
                    attributes,
                  }).then((results) => results.map((item) => item.id))
                );
              }
            }
          }
        }

        if (recognition) {
          const recognitionIds = recognition
            .split(',')
            .map((id) => parseInt(id.trim()))
            .filter((id) => !isNaN(id));
          if (recognitionIds.length > 0) {
            tempGoodIdsFromProductFilters.push(
              Goods.findAll({
                attributes: ['id'],
                include: [
                  {
                    model: ProductRecognition,
                    where: { recognitionId: { [Op.in]: recognitionIds } },
                    required: true,
                    attributes: [],
                  },
                ],
                raw: true,
                group: ['goods.id'],
              }).then((results) => results.map((item) => item.id))
            );
          }
        }

        const tempResolvedGoodIdsArrays = await Promise.all(
          tempGoodIdsFromProductFilters
        );
        const filteredTempGoodIdsArrays = tempResolvedGoodIdsArrays.filter(
          (arr) => arr !== null
        );

        let goodIdsForAvailableAttributes = null;
        if (filteredTempGoodIdsArrays.length > 0) {
          goodIdsForAvailableAttributes = filteredTempGoodIdsArrays.reduce(
            (intersectionSet, currentArray) => {
              if (intersectionSet === null) return new Set(currentArray);
              const newIntersection = new Set();
              currentArray.forEach((id) => {
                if (intersectionSet.has(id)) {
                  newIntersection.add(id);
                }
              });
              return newIntersection;
            },
            null
          );
        } else if (
          Object.keys(productFilterParams).some((k) =>
            k.startsWith('filter_')
          ) ||
          recognition
        ) {
          goodIdsForAvailableAttributes = new Set();
        }

        if (
          goodIdsForAvailableAttributes !== null &&
          goodIdsForAvailableAttributes.size > 0
        ) {
          tempGoodsWhere.id = {
            [Op.in]: Array.from(goodIdsForAvailableAttributes),
          };
        } else if (
          goodIdsForAvailableAttributes &&
          goodIdsForAvailableAttributes.size === 0
        ) {
          tempGoodsWhere.id = { [Op.in]: [] };
        }

        const tempIncludeOptions = [
          {
            model: Volume,
            as: 'volumes',
            where:
              Object.keys(volumeWhere).length > 0 ||
              Object.getOwnPropertySymbols(volumeWhere).length > 0
                ? volumeWhere
                : undefined,
            required:
              Object.keys(volumeWhere).length > 0 ||
              Object.getOwnPropertySymbols(volumeWhere).length > 0,
            attributes: [],
          },
        ];

        const distinctResults = await Goods.findAll({
          attributes: [foreignKey],
          where: tempGoodsWhere,
          include: tempIncludeOptions,
          group: [foreignKey],
          raw: true,
          distinct: true,
        });

        return distinctResults
          .map((item) => item[foreignKey])
          .filter((id) => id !== null);
      };

      // --- Доступні Категорії АБО Підкатегорії ---
      if (selectedCategoryId) {
        const subcategoryIds = await getDistinctRelatedIds('subcategoryId');
        if (subcategoryIds.length > 0) {
          const subcatWhere = { id: { [Op.in]: subcategoryIds } };
          subcatWhere.categoryId = selectedCategoryId;

          filters.subcategories = await Subcategory.findAll({
            where: subcatWhere,
            attributes: ['id', 'nameuk', 'nameru', 'categoryId', 'img'],
            order: [['nameuk', 'ASC']],
          });
        } else {
          filters.subcategories = [];
        }
      }
      const categoryIds = await getDistinctRelatedIds('categoryId');
      filters.categories = await Category.findAll({
        where: { id: { [Op.in]: categoryIds } },
        attributes: ['id', 'nameuk', 'nameru', 'svg'],
        order: [['nameuk', 'ASC']],
      });

      // --- Доступні Бренди ---
      const brendIds = await getDistinctRelatedIds('brendId');
      if (brendIds.length > 0) {
        filters.brends = await Brends.findAll({
          where: { id: { [Op.in]: brendIds } },
          attributes: ['id', 'name'],
          order: [['name', 'ASC']],
        });
      } else {
        filters.brends = [];
      }

      // --- Доступні Країни-виробники ---
      const countryMadeIds = await getDistinctRelatedIds('countryMadeId');
      if (countryMadeIds.length > 0) {
        filters.countries = await CountryMade.findAll({
          where: { id: { [Op.in]: countryMadeIds } },
          attributes: ['id', 'nameuk', 'nameru'],
          order: [['nameuk', 'ASC']],
        });
      } else {
        filters.countries = [];
      }

      // --- НОВИЙ ФІЛЬТР: Доступні Лінії ---
      const liniaIds = await getDistinctRelatedIds('liniaId');
      if (liniaIds.length > 0) {
        filters.linias = await Linia.findAll({
          where: { id: { [Op.in]: liniaIds } },
          attributes: ['id', 'name'],
          order: [['name', 'ASC']],
        });
      } else {
        filters.linias = [];
      }

      // --- НОВИЙ ФІЛЬТР: Доступні Призначення (Recognition) ---
      const getDistinctRecognitionIds = async () => {
        const tempGoodsWhere = { ...goodsWhere };
        delete tempGoodsWhere.id; // Це важливо, бо ми перерахуємо Id

        const tempGoodIdsFromAllFilters = [];
        for (const key in productFilterParams) {
          if (key.startsWith('filter_')) {
            const filterCategoryId = parseInt(key.replace('filter_', ''));
            const selectedValuesString = productFilterParams[key];
            if (
              !isNaN(filterCategoryId) &&
              typeof selectedValuesString === 'string'
            ) {
              const selectedValues = selectedValuesString
                .split(',')
                .map((val) => val.trim())
                .filter((val) => val !== '');
              if (selectedValues.length > 0) {
                const valueConditions = selectedValues.map((val) => ({
                  [Op.or]: [
                    sequelize.literal(
                      `FIND_IN_SET('${val}', \`productCategoryFilters\`.\`valueuk\`) > 0`
                    ),
                    sequelize.literal(
                      `FIND_IN_SET('${val}', \`productCategoryFilters\`.\`valueru\`) > 0`
                    ),
                  ],
                }));
                tempGoodIdsFromAllFilters.push(
                  Goods.findAll({
                    attributes: ['id'],
                    include: [
                      {
                        model: ProductCategoryFilter,
                        as: 'productCategoryFilters',
                        where: {
                          filterCategoryId: filterCategoryId,
                          [Op.or]: valueConditions,
                        },
                        required: true,
                        attributes: [],
                      },
                    ],
                    raw: true,
                    group: ['goods.id'],
                  }).then((results) => results.map((item) => item.id))
                );
              }
            }
          }
        }

        const tempResolvedGoodIdsArrays = await Promise.all(
          tempGoodIdsFromAllFilters
        );
        const filteredTempGoodIdsArrays = tempResolvedGoodIdsArrays.filter(
          (arr) => arr !== null
        );

        let goodIdsForAvailableAttributes = null;
        if (filteredTempGoodIdsArrays.length > 0) {
          goodIdsForAvailableAttributes = filteredTempGoodIdsArrays.reduce(
            (intersectionSet, currentArray) => {
              if (intersectionSet === null) return new Set(currentArray);
              const newIntersection = new Set();
              currentArray.forEach((id) => {
                if (intersectionSet.has(id)) {
                  newIntersection.add(id);
                }
              });
              return newIntersection;
            },
            null
          );
        } else if (
          Object.keys(productFilterParams).some((k) => k.startsWith('filter_'))
        ) {
          goodIdsForAvailableAttributes = new Set();
        }

        if (
          goodIdsForAvailableAttributes !== null &&
          goodIdsForAvailableAttributes.size > 0
        ) {
          tempGoodsWhere.id = {
            [Op.in]: Array.from(goodIdsForAvailableAttributes),
          };
        } else if (
          goodIdsForAvailableAttributes &&
          goodIdsForAvailableAttributes.size === 0
        ) {
          tempGoodsWhere.id = { [Op.in]: [] };
        }

        const recognitionResults = await ProductRecognition.findAll({
          attributes: ['recognitionId'],
          include: [
            {
              model: Goods,
              where: tempGoodsWhere,
              attributes: [],
              required: true,
              include: [
                {
                  model: Volume,
                  as: 'volumes',
                  where:
                    Object.keys(volumeWhere).length > 0
                      ? volumeWhere
                      : undefined,
                  required: Object.keys(volumeWhere).length > 0,
                  attributes: [],
                },
              ],
            },
          ],
          group: ['recognitionId'],
          raw: true,
        });

        return recognitionResults
          .map((item) => item.recognitionId)
          .filter((id) => id !== null);
      };

      const recognitionIds = await getDistinctRecognitionIds();
      if (recognitionIds.length > 0) {
        filters.recognitions = await Recognition.findAll({
          where: { id: { [Op.in]: recognitionIds } },
          attributes: ['id', 'nameuk', 'nameru'],
          order: [['nameuk', 'ASC']],
        });
      } else {
        filters.recognitions = [];
      }

      // --- Розрахунок доступної мінімальної та максимальної ціни ---
      const tempGoodsWhereForPriceRange = { ...goodsWhere };
      const priceRangeResult = await Volume.findOne({
        attributes: [
          [
            sequelize.fn('MIN', sequelize.col('volume.priceWithDiscount')),
            'minAvailablePrice',
          ],
          [
            sequelize.fn('MAX', sequelize.col('volume.priceWithDiscount')),
            'maxAvailablePrice',
          ],
        ],
        include: [
          {
            model: Goods,
            as: 'good',
            where: tempGoodsWhereForPriceRange,
            required: true,
            attributes: [],
          },
        ],
        raw: true,
      });

      filters.minAvailablePrice =
        priceRangeResult && priceRangeResult.minAvailablePrice !== null
          ? parseFloat(priceRangeResult.minAvailablePrice)
          : null;
      filters.maxAvailablePrice =
        priceRangeResult && priceRangeResult.maxAvailablePrice !== null
          ? parseFloat(priceRangeResult.maxAvailablePrice)
          : null;

      if (
        filters.minAvailablePrice === null ||
        isNaN(filters.minAvailablePrice)
      )
        filters.minAvailablePrice = 0;
      if (
        filters.maxAvailablePrice === null ||
        isNaN(filters.maxAvailablePrice)
      )
        filters.maxAvailablePrice = 0;

      // --- Отримання доступних фільтрів за атрибутами товару ---
      filters.productFilters = [];

      if (selectedCategoryId) {
        const relevantFilterCategories = await FilterCategory.findAll({
          where: { categoryId: selectedCategoryId },
          attributes: ['id', 'nameuk', 'nameru'],
          order: [['id', 'ASC']],
        });

        for (const filterCat of relevantFilterCategories) {
          const tempGoodsWhereForAvailableProductFilters = { ...goodsWhere };
          delete tempGoodsWhereForAvailableProductFilters.id;

          let goodIdsForAvailableAttributes = null;
          const tempGoodIdsPromises = [];

          for (const key in productFilterParams) {
            if (key.startsWith('filter_')) {
              const currentFilterId = parseInt(key.replace('filter_', ''));
              if (currentFilterId !== filterCat.id) {
                const selectedValuesString = productFilterParams[key];
                if (
                  !isNaN(currentFilterId) &&
                  typeof selectedValuesString === 'string'
                ) {
                  const selectedValues = selectedValuesString
                    .split(',')
                    .map((val) => val.trim())
                    .filter((val) => val !== '');
                  if (selectedValues.length > 0) {
                    const valueConditions = selectedValues.map((val) => ({
                      [Op.or]: [
                        sequelize.literal(
                          `FIND_IN_SET('${val}', \`productCategoryFilters\`.\`valueuk\`) > 0`
                        ),
                        sequelize.literal(
                          `FIND_IN_SET('${val}', \`productCategoryFilters\`.\`valueru\`) > 0`
                        ),
                      ],
                    }));
                    tempGoodIdsPromises.push(
                      Goods.findAll({
                        attributes: ['id'],
                        include: [
                          {
                            model: ProductCategoryFilter,
                            as: 'productCategoryFilters',
                            where: {
                              filterCategoryId: currentFilterId,
                              [Op.or]: valueConditions,
                            },
                            required: true,
                            attributes: [],
                          },
                        ],
                        raw: true,
                        group: ['goods.id'],
                      }).then((results) => results.map((item) => item.id))
                    );
                  }
                }
              }
            }
          }
          if (recognition) {
            const recognitionIds = recognition
              .split(',')
              .map((id) => parseInt(id.trim()))
              .filter((id) => !isNaN(id));
            if (recognitionIds.length > 0) {
              tempGoodIdsPromises.push(
                Goods.findAll({
                  attributes: ['id'],
                  include: [
                    {
                      model: ProductRecognition,
                      where: { recognitionId: { [Op.in]: recognitionIds } },
                      required: true,
                      attributes: [],
                    },
                  ],
                  raw: true,
                  group: ['goods.id'],
                }).then((results) => results.map((item) => item.id))
              );
            }
          }

          const tempResolvedGoodIdsArrays =
            await Promise.all(tempGoodIdsPromises);
          const filteredTempGoodIdsArrays = tempResolvedGoodIdsArrays.filter(
            (arr) => arr !== null
          );

          if (filteredTempGoodIdsArrays.length > 0) {
            goodIdsForAvailableAttributes = filteredTempGoodIdsArrays.reduce(
              (intersectionSet, currentArray) => {
                if (intersectionSet === null) return new Set(currentArray);
                const newIntersection = new Set();
                currentArray.forEach((id) => {
                  if (intersectionSet.has(id)) {
                    newIntersection.add(id);
                  }
                });
                return newIntersection;
              },
              null
            );
          } else if (
            Object.keys(productFilterParams).some(
              (k) =>
                k.startsWith('filter_') &&
                parseInt(k.replace('filter_', '')) !== filterCat.id
            ) ||
            recognition
          ) {
            goodIdsForAvailableAttributes = new Set();
          }

          if (goodIdsForAvailableAttributes !== null) {
            if (goodIdsForAvailableAttributes.size > 0) {
              tempGoodsWhereForAvailableProductFilters.id = {
                [Op.in]: Array.from(goodIdsForAvailableAttributes),
              };
            } else {
              tempGoodsWhereForAvailableProductFilters.id = { [Op.in]: [] };
            }
          }

          const productFilterValues = await Goods.findAll({
            attributes: [],
            where: tempGoodsWhereForAvailableProductFilters,
            include: [
              {
                model: Volume,
                as: 'volumes',
                where:
                  Object.keys(volumeWhere).length > 0 ||
                  Object.getOwnPropertySymbols(volumeWhere).length > 0
                    ? volumeWhere
                    : undefined,
                required:
                  Object.keys(volumeWhere).length > 0 ||
                  Object.getOwnPropertySymbols(volumeWhere).length > 0,
                attributes: [],
              },
              {
                model: ProductCategoryFilter,
                as: 'productCategoryFilters',
                where: { filterCategoryId: filterCat.id },
                attributes: ['valueuk', 'valueru'],
                required: true,
              },
            ],
            raw: true,
            distinct: true,
          });

          const uniqueValuesUk = new Set();
          const uniqueValuesRu = new Set();

          const currentFilterParamName = `filter_${filterCat.id}`;
          const selectedValuesStringForThisFilter =
            productFilterParams[currentFilterParamName];
          if (typeof selectedValuesStringForThisFilter === 'string') {
            const selectedValues = selectedValuesStringForThisFilter
              .split(',')
              .map((val) => val.trim())
              .filter((val) => val !== '');
            selectedValues.forEach((val) => {
              uniqueValuesUk.add(val);
              uniqueValuesRu.add(val);
            });
          }

          productFilterValues.forEach((item) => {
            if (item['productCategoryFilters.valueuk']) {
              item['productCategoryFilters.valueuk']
                .split(',')
                .forEach((val) => uniqueValuesUk.add(val.trim()));
            }
            if (item['productCategoryFilters.valueru']) {
              item['productCategoryFilters.valueru']
                .split(',')
                .forEach((val) => uniqueValuesRu.add(val.trim()));
            }
          });

          const sortedValuesUk = Array.from(uniqueValuesUk).sort((a, b) =>
            a.localeCompare(b, 'uk')
          );
          const sortedValuesRu = Array.from(uniqueValuesRu).sort((a, b) =>
            a.localeCompare(b, 'ru')
          );

          if (sortedValuesUk.length > 0) {
            filters.productFilters.push({
              id: filterCat.id,
              nameuk: filterCat.nameuk,
              nameru: filterCat.nameru,
              valuesuk: sortedValuesUk,
              valuesru: sortedValuesRu,
            });
          }
        }
      }
      if (delLeng) {
        let selectCategoriesInFilters;
        let selectSubcategoryInFilters;
        if (delLeng == 'ru' && isLeaveCategoryAndSubcategory) {
          selectCategoriesInFilters = JSON.stringify(filters.categories);
          selectSubcategoryInFilters = JSON.stringify(filters.subcategories);
        }
        const langToRemove = delLeng;
        const visited = new WeakSet(); // Використовуємо WeakSet для ефективного відстеження об'єктів

        const cleanObject = (data) => {
          if (!data || typeof data !== 'object' || visited.has(data)) {
            // Якщо data не є об'єктом, вже відвідано або є null, виходимо
            return;
          }

          visited.add(data); // Додаємо поточний об'єкт до списку відвіданих

          // Якщо це масив, перебираємо його елементи
          if (Array.isArray(data)) {
            data.forEach((item) => cleanObject(item));
          }
          // Якщо це об'єкт, перебираємо його властивості
          else {
            // Очищаємо поля з назвою мови
            if (data[`name${langToRemove}`]) {
              data[`name${langToRemove}`] = '';
            }
            if (data[`description${langToRemove}`]) {
              data[`description${langToRemove}`] = '';
            }

            // Рекурсивно перевіряємо вкладені об'єкти
            Object.values(data).forEach((value) => {
              cleanObject(value);
            });
          }
        };

        // Запускаємо очищення для всіх основних об'єктів у відповіді
        cleanObject({
          goods: goodsResult.rows,
          filters: filters,
          realNameBrend,
        });

        if (delLeng == 'ru' && isLeaveCategoryAndSubcategory) {
          filters.categories = JSON.parse(selectCategoriesInFilters);
        }
        if (
          selectSubcategoryInFilters &&
          delLeng == 'ru' &&
          isLeaveCategoryAndSubcategory
        ) {
          filters.subcategories = JSON.parse(selectSubcategoryInFilters);
        }
      }

      if (brendName && !category && filters.categories.length == 1) {
        const subcategoryIds = await getDistinctRelatedIds('subcategoryId');
        if (subcategoryIds.length > 0) {
          const subcatWhere = { id: { [Op.in]: subcategoryIds } };
          subcatWhere.categoryId = filters.categories[0].id;

          filters.subcategories = await Subcategory.findAll({
            where: subcatWhere,
            attributes: ['id', 'nameuk', 'nameru', 'categoryId', 'img'],
            order: [['nameuk', 'ASC']],
          });
        } else {
          filters.subcategories = [];
        }
      }
      // --- 9. Формування відповіді ---
      return resp.json({
        goods: goodsResult.rows,
        totalGoods,
        totalPages,
        filters: filters,
        realNameBrend,
        selectCategory: categoryToReturn,
        selectSubcategory: subcategoryToRetun,
        realDescriptionBrend,
        realNameBrendWithLang,
      });
    } catch (err) {
      console.error('Помилка в GoodsController.GetGoods:', err);
      return next(
        ErrorApi.badRequest(
          err.message || 'Невідома помилка під час отримання товарів.'
        )
      );
    }
  };

  static AddRecognitions = async (req, resp, next) => {
    try {
      const { nameuk, nameru, categoryId } = req.body;
      const res = await Recognition.create({ nameuk, nameru, categoryId });
      return resp.json(res);
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };

  static GetRecognitions = async (req, resp, next) => {
    try {
      const res = await Recognition.findAll({ order: [['nameru', 'asc']] });
      return resp.json(res);
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetRecognitionsForCategory = async (req, resp, next) => {
    try {
      const { categoryId } = req.query;
      const res = await Recognition.findAll({
        order: [['nameru', 'asc']],
        where: { categoryId: parseInt(categoryId) },
      });
      return resp.json(res);
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static EditRecognitions = async (req, resp, next) => {
    try {
      const { id, nameuk, nameru, categoryId } = req.body;

      const res = await Recognition.update(
        { nameuk, nameru, categoryId: parseInt(categoryId) },
        { where: { id: parseInt(id) } }
      );
      return resp.json(res);
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };

  static AddLine = async (req, resp, next) => {
    try {
      const { name } = req.body;
      const res = await Linia.create({ name });
      return resp.json({ res });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };

  static GetLine = async (req, resp, next) => {
    try {
      const res = await Linia.findAll({ order: [['name', 'ASC']] });
      return resp.json(res);
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };

  static GetOne = async (req, resp, next) => {
    try {
      const { id } = req.query;
      const good = await Goods.findOne({
        where: { id },
        include: [
          {
            model: Volume,
            include: [
              {
                model: Img,
              },
            ],
          },
          {
            model: Brends,
          },
          {
            model: CountryMade,
          },
          {
            model: Subcategory,
          },
          {
            model: ProductCategoryFilter,
          },
          {
            model: Linia,
          },
          {
            model: ProductRecognition,
          },
        ],
      });
      return resp.json({ good });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetForIdVolume = async (req, resp, next) => {
    try {
      const { idVolume } = req.params;
      let { lang } = req.query;
      lang = lang == 'ru' ? 'ru' : 'uk';
      // 1. Отримуємо поточний том за idVolume
      const volume = await Volume.findOne({
        where: { url: idVolume },
      });

      if (!volume) {
        return next(ErrorApi.notFound('Volume not found'));
      }

      const currentGoodId = volume.goodId;

      // 2. Отримуємо повну інформацію про поточний товар
      const good = await Goods.findOne({
        where: { id: currentGoodId, isShow: true },
        attributes: [
          'id',
          `name${lang}`,
          `description${lang}`,
          'art',
          `characteristic${lang}`,
          'video',
          'isDiscount',
          'isBestseller',
          'isNovetly',
          'isHit',
          'isFreeDelivery',
          'createdAt',
          'updatedAt',
          'brendId',
          'categoryId',
          'countryMadeId',
          'subcategoryId',
          'views',
          'isShow',
          'liniaId',
          'isForMan',
          `nameTypeuk`,
          `nameTyperu`,
        ],
        include: [
          {
            model: Volume,
            include: [
              {
                model: Img,
                attributes: [
                  'id',
                  'img',
                  `volume${lang}`,
                  'createdAt',
                  'updatedAt',
                  'volumeId',
                ],
              },
            ],
          },
          {
            model: Brends,
          },
          {
            model: CountryMade,
            attributes: ['id', `name${lang}`, 'createdAt', 'updatedAt'],
          },
          {
            model: Subcategory,
          },
          {
            model: ProductCategoryFilter,
          },
          {
            model: Category,
          },
          {
            model: Linia,
          },
          {
            model: Reviews,
            where: { isShow: true },
            separate: true,
          },
        ],
        order: [
          [Sequelize.literal('`volumes`.`sort` IS NULL'), 'ASC'],
          [Sequelize.literal('`volumes`.`sort`'), 'ASC'],
        ],
      });

      if (!good) {
        return next(ErrorApi.notFound('Good not found for the given volume'));
      }

      const indexVolume = good.volumes.findIndex((x) => x.url == idVolume);

      // 3. Визначаємо, звідки вибирати схожі товари
      let whereSimilar = { isShow: true, id: { [Op.ne]: currentGoodId } };

      if (good.subcategoryId) {
        // Рахуємо кількість товарів у підкатегорії (крім поточного)
        const countInSubcat = await Goods.count({
          where: {
            subcategoryId: good.subcategoryId,
            isShow: true,
            id: { [Op.ne]: currentGoodId },
          },
        });

        if (countInSubcat >= 5) {
          // Якщо є достатньо товарів у підкатегорії — беремо з неї
          whereSimilar.subcategoryId = good.subcategoryId;
        } else {
          // Інакше беремо з категорії
          whereSimilar.categoryId = good.categoryId;
        }
      } else {
        // Якщо товар взагалі без підкатегорії — з категорії
        whereSimilar.categoryId = good.categoryId;
      }

      const randomGoods = await Goods.findAll({
        where: whereSimilar,
        order: Sequelize.literal('RAND()'),
        limit: 15,
        include: [
          {
            model: Volume,
            include: [Img],
          },
          {
            model: Reviews,
            attributes: ['id'],
            where: { isShow: true },
            separate: true,
          },
        ],
        attributes: {
          include: [
            [
              Sequelize.literal(`(
          SELECT AVG(r.rating)
          FROM reviews AS r
          WHERE r.goodsId = goods.id
            AND r.rating IS NOT NULL
            AND r.isShow = true
        )`),
              'averageRating',
            ],
          ],
        },
      });

      // Ви можете також відфільтрувати randomGoods, якщо вони повернули більше одного об'єму для кожного, і вам потрібен тільки один.
      // Наприклад, взяти перший доступний об'єм для відображення:
      const simplifiedRandomGoods = randomGoods.map((rg) => ({
        ...rg.toJSON(), // Перетворюємо в звичайний JS об'єкт
        // Якщо потрібно тільки один об'єм для randomGoods:
        volume:
          rg.volumes && rg.volumes.length > 0 ? rg.volumes[0].toJSON() : null,
      }));
      const reviewsFromDB = await Reviews.findAll({
        where: {
          goodsId: good.id,
          isShow: true,
          reviewId: null, // тільки "батьківські" відгуки
        },
        order: [['createdAt', 'DESC']],
        include: [
          {
            model: Reviews,
            as: 'Replies',
            where: { isShow: true },
            required: false, // щоб батьківські без відповідей теж поверталися
            order: [['createdAt', 'ASC']],
          },
        ],
      });

      const reviews = {
        countImgs: 0, // якщо в майбутньому будуть зображення
        avarge: null,
        listReviews: [],
      };

      if (reviewsFromDB.length > 0) {
        // Розрахунок середнього рейтингу
        const sum = reviewsFromDB.reduce((acc, r) => acc + (r.rating || 0), 0);
        const countWithRating = reviewsFromDB.filter(
          (r) => r.rating !== null
        ).length;
        reviews.avarge = countWithRating
          ? (sum / countWithRating).toFixed(2)
          : null;

        // Якщо буде логіка для зображень — тут можна рахувати
        reviews.countImgs = 0;

        // Відформатований список відгуків
        reviews.listReviews = reviewsFromDB.map((r) => ({
          id: r.id,
          name: r.nameUser,
          description: r.description,
          countStar: r.rating,
          date: r.createdAt, // або форматуй, якщо треба
          child: r.Replies.map((j) => ({
            id: j.id,
            name: j.nameUser,
            description: j.description,
            date: j.createdAt, // або форматуй, якщо треба
          })),
        }));
      }
      return resp.json({
        good,
        indexVolume,
        watchMore: simplifiedRandomGoods,
        reviews,
      });
    } catch (err) {
      return next(ErrorApi.badRequest(err.message)); // Змінив на err.message для більш точного повідомлення
    }
  };

  /*static Add = async (req, resp, next) => {
    try {
      let {
        nameuk,
        nameru,
        descriptionuk,
        descriptionru,
        art,
        characteristicuk,
        characteristicru,
        brendId,
        categoryId,
        countryMadeId,
        subcategoryId,
        volume,
        filters,
        isDiscount,
        isBestseller,
        isNovetly,
        isHit,
        isFreeDelivery,
        video,
        isForMan,
      } = req.body;

      if (!nameuk || !nameru || !brendId || !categoryId || !countryMadeId) {
        return resp
          .status(400)
          .json({ message: "Не всі обов'язкові дані передані" });
      }

      brendId = parseInt(brendId);
      categoryId = parseInt(categoryId);
      countryMadeId = parseInt(countryMadeId);
      subcategoryId = parseInt(subcategoryId);
      volume = JSON.parse(volume);
      filters = JSON.parse(filters);
      filters = filters == 'true';
      isDiscount = isDiscount == 'true';
      isBestseller = isBestseller == 'true';
      isNovetly = isNovetly == 'true';
      isHit = isHit == 'true';
      isFreeDelivery = isFreeDelivery == 'true';
      if (isForMan == 'true') isForMan = true;
      else if (isForMan == 'false') isForMan = true;
      else isForMan = null;

      // Створюємо товар у БД
      const product = await Goods.create({
        nameuk,
        nameru,
        descriptionuk,
        descriptionru,
        art,
        characteristicuk,
        characteristicru,
        brendId,
        categoryId,
        countryMadeId,
        subcategoryId: subcategoryId == 0 ? null : subcategoryId,
        isDiscount,
        isBestseller,
        isNovetly,
        isHit,
        isFreeDelivery,
        video: video ? video : null,
        isForMan,
      });

      const { files } = req;
      const uploadDir = path.resolve(__dirname, '..', 'static');

      // Створюємо папку для збереження файлів, якщо її немає
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Обробка варіацій товару (volume)
      if (volume && Array.isArray(volume)) {
        for (const [index, item] of volume.entries()) {
          const {
            volume,
            price,
            discount,
            priceWithDiscount,
            images,
            nameVolume,
            volumeInfo,
            metaTitleru,
            metaTitleuk,
            metaDescriptionuk,
            metaDescriptionru,
            canonicaluk,
            canonicalru,
            isAvailability,
          } = item;
          const productId = product.id;

          // Додаємо варіацію товару до таблиці Volume
          const volumeEntry = await Volume.create({
            volume,
            price: parseFloat(price),
            discount: parseFloat(discount),
            priceWithDiscount: parseFloat(priceWithDiscount),
            goodId: productId,
            nameVolume,
            metaTitleru,
            metaTitleuk,
            metaDescriptionuk,
            metaDescriptionru,
            canonicaluk,
            canonicalru,
            isAvailability,
          });

          // Якщо є зображення для варіації
          if (images && Array.isArray(images)) {
            for (const imgIndex of images) {
              // imgIndex — це індекс зображення, переданого з фронтенду
              const imgFile = req.files[`imgs[${index}][${imgIndex}]`]; // Отримуємо відповідне зображення по індексах
              let volInfo = volumeInfo.find((x) => x.index == imgIndex);
              if (imgFile) {
                const fileName = uuidv4() + path.extname(imgFile.name); // Генеруємо унікальну назву файлу
                const filePath = path.join(uploadDir, fileName);
                await imgFile.mv(filePath); // Переміщаємо файл у директорію

                // Зберігаємо зображення в таблицю Img, прив'язуючи до варіації (volumeId)
                await Img.create({
                  img: fileName,
                  volumeId: volumeEntry.id,
                  volumeuk: volInfo.altuk,
                  volumeru: volInfo.altru,
                });
              } else {
                console.log(
                  `File not found for volume index ${index}, image index ${imgIndex}`,
                );
              }
            }
          }
        }
      }

      if (filters && Array.isArray(filters)) {
        for (const filter of filters) {
          const { filterCategoryId, valueuk, valueru } = filter;

          if (valueuk || valueru) {
            await ProductCategoryFilter.create({
              filterCategoryId,
              valueuk,
              valueru,
              goodId: product.id,
            });
          }
        }
      }
      ConvertPngToWebP.UpdateNoWebp();
      resp
        .status(200)
        .json({ message: 'Товар і варіації успішно додані', product });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };*/

  static ClearDataBase = async () => {
    try {
      // 1️⃣ Знайти всі об’єми без фото
      const volumesNoPhoto = await Volume.findAll({
        include: [
          {
            model: Img, // або VolumePhoto — залежно від твоєї моделі
            required: false,
          },
        ],
        where: Sequelize.literal('`imgs`.`id` IS NULL'),
      });

      if (volumesNoPhoto.length > 0) {
        const idsToDelete = volumesNoPhoto.map((v) => v.id);
        console.log('Видаляю об’єми без фото:', idsToDelete);

        await Volume.destroy({
          where: { id: idsToDelete },
        });
      }

      // 2️⃣ Знайти всі товари без жодного об’єму
      const goodsNoVolume = await Goods.findAll({
        include: [
          {
            model: Volume,
            required: false,
          },
        ],
        where: Sequelize.literal('`volumes`.`id` IS NULL'),
      });

      if (goodsNoVolume.length > 0) {
        const idsToDeleteGoods = goodsNoVolume.map((g) => g.id);
        console.log('Видаляю товари без об’ємів:', idsToDeleteGoods);

        await Goods.destroy({
          where: { id: idsToDeleteGoods },
        });
      }

      console.log('✅ Очищення завершено успішно');
    } catch (err) {
      console.error('❌ Помилка при очищенні бази:', err);
    }
  };

  static Add = async (req, resp, next) => {
    try {
      let {
        nameuk,
        nameru,
        descriptionuk,
        descriptionru,
        art,
        characteristicuk,
        characteristicru,
        brendId,
        categoryId,
        countryMadeId,
        subcategoryId,
        volume,
        filters,
        isDiscount,
        isBestseller,
        isNovetly,
        isHit,
        isFreeDelivery,
        isShow,
        liniaId,
        productRecognitions,
        isForMan,
        isFeed,
        nameTypeuk,
        nameTyperu,
      } = req.body;

      if (!nameuk || !nameru || !brendId || !categoryId || !countryMadeId) {
        return resp
          .status(400)
          .json({ message: "Не всі обов'язкові дані передані" });
      }

      brendId = parseInt(brendId);
      categoryId = parseInt(categoryId);
      countryMadeId = parseInt(countryMadeId);
      subcategoryId = parseInt(subcategoryId);
      volume = JSON.parse(volume);
      filters = JSON.parse(filters);
      filters = filters == 'true' ? true : filters; // Якщо це 'true' або 'false' як строки
      isDiscount = isDiscount == 'true';
      isBestseller = isBestseller == 'true';
      isNovetly = isNovetly == 'true';
      isHit = isHit == 'true';
      isFreeDelivery = isFreeDelivery == 'true';
      isShow = isShow == 'true';
      liniaId = parseInt(liniaId);
      productRecognitions = JSON.parse(productRecognitions);
      isFeed = isFeed == 'true';
      if (isForMan == 'true') isForMan = true;
      else if (isForMan == 'false') isForMan = false;
      else isForMan = null;
      if (isNaN(liniaId)) {
        liniaId = null;
      }

      if (volume && Array.isArray(volume)) {
        for (const item of volume) {
          const {
            volume,
            price,
            discount,
            priceWithDiscount,
            images,
            nameVolume,
            volumeInfo,
            metaTitleru,
            metaTitleuk,
            metaDescriptionuk,
            metaDescriptionru,
            canonicaluk,
            canonicalru,
            isAvailability,
            sort,
            isFreeDelivery,
            art,
          } = item;

          const isArt = await Volume.findOne({ where: { art } });
          if (isArt) {
            return resp.status(283).json();
          }
        }
      }

      // Оновлюємо основні поля
      const product = await Goods.create({
        nameuk,
        nameru,
        descriptionuk,
        descriptionru,
        art,
        characteristicuk,
        characteristicru,
        brendId,
        categoryId,
        countryMadeId,
        subcategoryId: subcategoryId == 0 ? null : subcategoryId,
        isDiscount,
        isBestseller,
        isNovetly,
        isHit,
        isFreeDelivery,
        isShow,
        liniaId,
        isForMan,
        isFeed,
        nameTypeuk,
        nameTyperu,
      });

      const { files } = req;
      const uploadDir = path.resolve(__dirname, '..', 'static');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Обробка файлів
      if (files) {
        const imageFiles = Object.keys(files)
          .filter((key) => key.startsWith('imgs['))
          .map((key) => files[key]);
        const videoFile = files.video;

        // Зберігаємо нове відео, якщо є
        if (videoFile) {
          const videoName = uuidv4() + path.extname(videoFile.name);
          const videoPath = path.join(uploadDir, videoName);
          await videoFile.mv(videoPath);
          await product.update({ video: videoName });
        }
      }

      if (volume && Array.isArray(volume)) {
        let index = 0;
        for (const item of volume) {
          const {
            volume,
            price,
            discount,
            priceWithDiscount,
            images,
            nameVolume,
            volumeInfo,
            metaTitleru,
            metaTitleuk,
            metaDescriptionuk,
            metaDescriptionru,
            canonicaluk,
            canonicalru,
            isAvailability,
            sort,
            isFreeDelivery,
            art,
          } = item;

          const url = SetUrlToVolume.getUrl(product.nameuk);

          // Нова варіація — створюємо
          const newVolume = await Volume.create({
            volume,
            price: parseFloat(price),
            discount: parseFloat(discount),
            priceWithDiscount: parseFloat(priceWithDiscount),
            goodId: product.id,
            nameVolume,
            metaTitleru,
            metaTitleuk,
            metaDescriptionuk,
            metaDescriptionru,
            canonicaluk,
            canonicalru,
            isAvailability,
            sort,
            isFreeDelivery,
            art,
            url,
          });
          // Додаємо фото для нової варіації
          if (images && Array.isArray(images)) {
            for (const imgIndex of images) {
              const imgFile = req.files?.[`imgs[${index}][${imgIndex}]`];
              const volInfo = volumeInfo.find((x) => x.index == imgIndex);

              if (imgFile) {
                const fileName = uuidv4() + path.extname(imgFile.name);
                const filePath = path.join(uploadDir, fileName);
                await imgFile.mv(filePath);

                await Img.create({
                  img: fileName,
                  volumeId: newVolume.id,
                  volumeuk: volInfo?.altuk,
                  volumeru: volInfo?.altru,
                });
              }
            }
          }

          index++;
        }
      }

      if (filters && Array.isArray(filters)) {
        for (const filter of filters) {
          const { filterCategoryId, valueuk, valueru } = filter;
          if (valueuk || valueru) {
            await ProductCategoryFilter.create({
              filterCategoryId,
              valueuk,
              valueru,
              goodId: product.id,
            });
          }
        }
      }

      const goodsUpdate = await Goods.findOne({
        where: { id: product.id },
        attributes: ['id'],
        include: [
          {
            model: Volume,
            attributes: ['id', 'url'],
          },
        ],
      });
      await ConvertPngToWebP.UpdateNoWebp();
      const idVolume = goodsUpdate.volumes[0].url;
      for (let i = 0; i < productRecognitions.length; i++) {
        await ProductRecognition.create({
          goodId: product.id,
          recognitionId: productRecognitions[i].recognitionId,
        });
      }
      ImageToFullName.UpdateImage();
      resp.status(200).json({
        message: 'Товар успішно оновлено',
        product: goodsUpdate,
        idVolume,
      });
      this.ClearDataBase();
    } catch (err) {
      this.ClearDataBase();
      return next(ErrorApi.badRequest(err));
    }
  };

  static Update = async (req, resp, next) => {
    try {
      let {
        id, // ID товару
        nameuk,
        nameru,
        product_type_uk,
        product_type_ru,
        descriptionuk,
        descriptionru,
        art,
        characteristicuk,
        characteristicru,
        brendId,
        categoryId,
        countryMadeId,
        subcategoryId,
        volume,
        filters,
        isDiscount,
        isBestseller,
        isNovetly,
        isHit,
        isFreeDelivery,
        isShow,
        liniaId,
        productRecognitions,
        isForMan,
        isFeed,
        url,
        nameTypeuk,
        nameTyperu,
      } = req.body;

      if (
        !id ||
        !nameuk ||
        !nameru ||
        !brendId ||
        !categoryId ||
        !countryMadeId
      ) {
        return resp
          .status(400)
          .json({ message: "Не всі обов'язкові дані передані" });
      }

      id = parseInt(id);
      brendId = parseInt(brendId);
      categoryId = parseInt(categoryId);
      countryMadeId = parseInt(countryMadeId);
      subcategoryId = parseInt(subcategoryId);
      volume = JSON.parse(volume);
      filters = JSON.parse(filters);
      filters = filters == 'true' ? true : filters; // Якщо це 'true' або 'false' як строки
      isDiscount = isDiscount == 'true';
      isBestseller = isBestseller == 'true';
      isNovetly = isNovetly == 'true';
      isHit = isHit == 'true';
      isFreeDelivery = isFreeDelivery == 'true';
      isShow = isShow == 'true';
      liniaId = parseInt(liniaId);
      productRecognitions = JSON.parse(productRecognitions);
      isFeed = isFeed == 'true';
      if (isForMan == 'true') isForMan = true;
      else if (isForMan == 'false') isForMan = false;
      else isForMan = null;
      if (isNaN(liniaId)) {
        liniaId = null;
      }

      // Знаходимо товар
      const product = await Goods.findByPk(id);
      if (!product) {
        return resp.status(404).json({ message: 'Товар не знайдений' });
      }
      await ProductRecognition.destroy({ where: { goodId: id } });
      for (let i = 0; i < productRecognitions.length; i++) {
        await ProductRecognition.create({
          goodId: id,
          recognitionId: productRecognitions[i].recognitionId,
        });
      }

      // Оновлюємо основні поля
      await product.update({
        nameuk,
        nameru,
        descriptionuk,
        descriptionru,
        art,
        characteristicuk,
        characteristicru,
        brendId,
        categoryId,
        countryMadeId,
        subcategoryId: subcategoryId == 0 ? null : subcategoryId,
        isDiscount,
        isBestseller,
        isNovetly,
        isHit,
        isFreeDelivery,
        isShow,
        liniaId,
        isForMan,
        isFeed,
        nameTypeuk,
        nameTyperu,
        product_type_uk: product_type_uk || null,
        product_type_ru: product_type_ru || null,
      });

      const { files } = req;
      const uploadDir = path.resolve(__dirname, '..', 'static');

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Обробка файлів
      if (files) {
        const imageFiles = Object.keys(files)
          .filter((key) => key.startsWith('imgs['))
          .map((key) => files[key]);
        const videoFile = files.video;

        // Зберігаємо нове відео, якщо є
        if (videoFile) {
          const videoName = uuidv4() + path.extname(videoFile.name);
          const videoPath = path.join(uploadDir, videoName);
          await videoFile.mv(videoPath);
          await product.update({ video: videoName });
        }
      }

      if (volume && Array.isArray(volume)) {
        let index = 0;
        for (const item of volume) {
          const {
            volume,
            price,
            discount,
            priceWithDiscount,
            images,
            nameVolume,
            volumeInfo,
            metaTitleru,
            metaTitleuk,
            metaDescriptionuk,
            metaDescriptionru,
            canonicaluk,
            canonicalru,
            id,
            isDelete,
            isAvailability,
            sort,
            isFreeDelivery,
            art,
            gtin,
          } = item;

          if (isDelete) {
            // Якщо варіація позначена на видалення
            if (id) {
              // Видаляємо записи з БД
              const volumeToDelete = await Volume.findByPk(id);
              if (volumeToDelete) {
                const imgsToDelete = await Img.findAll({
                  where: { volumeId: id },
                });
                for (const imgRecord of imgsToDelete) {
                  await this.deleteFileIfExists(imgRecord.img); // видаляємо файл
                  await imgRecord.destroy(); // видаляємо запис фото
                }
                await volumeToDelete.destroy(); // видаляємо варіацію
              }
            }
            index++;
            continue; // переходимо до наступної варіації
          }

          if (!id) {
            const url = SetUrlToVolume.getUrl(product.nameuk);
            // Нова варіація — створюємо
            const newVolume = await Volume.create({
              volume,
              price: parseFloat(price),
              discount: parseFloat(discount),
              priceWithDiscount: parseFloat(priceWithDiscount),
              goodId: product.id,
              nameVolume,
              metaTitleru,
              metaTitleuk,
              metaDescriptionuk,
              metaDescriptionru,
              canonicaluk,
              canonicalru,
              isAvailability,
              sort,
              isFreeDelivery,
              art,
              url,
              gtin,
            });

            // Додаємо фото для нової варіації
            if (images && Array.isArray(images)) {
              for (const imgIndex of images) {
                const imgFile = req.files?.[`imgs[${index}][${imgIndex}]`];
                const volInfo = volumeInfo.find((x) => x.index == imgIndex);

                if (imgFile) {
                  const fileName = uuidv4() + path.extname(imgFile.name);
                  const filePath = path.join(uploadDir, fileName);
                  await imgFile.mv(filePath);

                  await Img.create({
                    img: fileName,
                    volumeId: newVolume.id,
                    volumeuk: volInfo?.altuk,
                    volumeru: volInfo?.altru,
                  });
                }
              }
            }
          } else {
            // Існуюча варіація — оновлюємо
            const existingVolume = await Volume.findByPk(id);
            if (!existingVolume) continue;
            await existingVolume.update({
              volume,
              price: parseFloat(price),
              discount: parseFloat(discount),
              priceWithDiscount: parseFloat(priceWithDiscount),
              nameVolume,
              metaTitleru,
              metaTitleuk,
              metaDescriptionuk,
              metaDescriptionru,
              canonicaluk,
              canonicalru,
              isAvailability,
              sort,
              isFreeDelivery,
              art,
              gtin,
            });

            // Видаляємо старі фото (файли + записи)
            const oldImgs = await Img.findAll({ where: { volumeId: id } });
            for (const imgRecord of oldImgs) {
              await this.deleteFileIfExists(imgRecord.img);
              await imgRecord.destroy();
            }

            // Додаємо нові фото
            if (images && Array.isArray(images)) {
              for (const imgIndex of images) {
                const imgFile = req.files?.[`imgs[${index}][${imgIndex}]`];
                const volInfo = volumeInfo.find((x) => x.index == imgIndex);

                if (imgFile) {
                  const fileName = uuidv4() + path.extname(imgFile.name);
                  const filePath = path.join(uploadDir, fileName);
                  await imgFile.mv(filePath);

                  await Img.create({
                    img: fileName,
                    volumeId: id,
                    volumeuk: volInfo?.altuk,
                    volumeru: volInfo?.altru,
                  });
                }
              }
            }
          }
          index++;
        }
      }

      await ProductCategoryFilter.destroy({ where: { goodId: product.id } });

      if (filters && Array.isArray(filters)) {
        for (const filter of filters) {
          const { filterCategoryId, valueuk, valueru } = filter;
          if (valueuk || valueru) {
            await ProductCategoryFilter.create({
              filterCategoryId,
              valueuk,
              valueru,
              goodId: product.id,
            });
          }
        }
      }
      const goodsUpdate = await Goods.findOne({
        where: { id },
        attributes: ['id'],
        include: [
          {
            model: Volume,
            attributes: ['id', 'url'],
          },
        ],
      });
      await Volume.update({ url: url }, { where: { goodId: id } });
      const idVolume = goodsUpdate.volumes[0].url;
      resp
        .status(200)
        .json({ message: 'Товар успішно оновлено', product, idVolume });
      this.ClearDataBase();
      await ConvertPngToWebP.UpdateNoWebp();
      ImageToFullName.UpdateImage();
    } catch (err) {
      this.ClearDataBase();
      return next(ErrorApi.badRequest(err));
    }
  };

  // Функція для видалення файлу з диска
  static async deleteFileIfExists(fileName) {
    const filePath = path.join(uploadDir, fileName);
    try {
      await fs.promises.access(filePath); // перевіряємо, чи існує файл
      await fs.promises.unlink(filePath); // видаляємо файл
    } catch (err) {
      // файл не існує або інша помилка — ігноруємо
    }
  }

  static SetView = async (req, resp, next) => {
    try {
      const { id } = req.query;

      if (!id) {
        return next(ErrorApi.badRequest('ID is required'));
      }

      const good = await Goods.findByPk(parseInt(id));
      if (!good) {
        return next(ErrorApi.notFound('Goods not found'));
      }

      // 1. Збільшити загальну кількість переглядів
      await Goods.update(
        { views: good.views + 1 },
        {
          where: { id: good.id },
          silent: true,
        }
      );

      // 2. Додати запис у таблицю статистики
      await GoodsViews.create({
        goodId: good.id, // або goodsId, залежно як назвеш
      });

      return resp.json({ message: 'Views incremented and logged' });
    } catch (err) {
      return next(ErrorApi.badRequest(err.message));
    }
  };

  static GetView = async (req, resp, next) => {
    try {
      let {
        startDate,
        finishDate,
        today,
        week,
        month,
        year,
        allTime,
        page = 1,
        limit = 20,
        search,
        isDesc,
      } = req.query;

      isDesc = isDesc == 'true';
      page = parseInt(page);
      limit = parseInt(limit);
      const offset = (page - 1) * limit;

      let where = '';
      let viewWhere = 'WHERE 1=1';

      if (search) {
        where += ` AND g.nameru LIKE '%${search}%'`;
      }

      if (startDate) {
        viewWhere += ` AND createdAt >= '${startDate}'`;
      }

      if (finishDate) {
        viewWhere += ` AND createdAt <= '${finishDate} 23:59:59'`;
      }

      if (startDate || finishDate) {
        where =
          `WHERE g.id IN (
          SELECT DISTINCT goodId
          FROM goodsViews
          ${viewWhere}
        )` + where;
      } else {
        where =
          `WHERE g.id IN (
          SELECT goodId
          FROM goodsViews
        )` + where;
      }

      let orderField = 'allTime';

      if (today) orderField = 'today';
      else if (week) orderField = 'week';
      else if (month) orderField = 'month';
      else if (year) orderField = 'year';

      const goods = await sequelizeWithDB.query(
        `
      SELECT
        g.id,
        g.nameru as name,
        COALESCE(v.today, 0) as today,
        COALESCE(v.week, 0) as week,
        COALESCE(v.month, 0) as month,
        COALESCE(v.year, 0) as year,
        COALESCE(v.allTime, 0) as allTime
      FROM goods g
      LEFT JOIN (
        SELECT
          goodId,
          COUNT(*) as allTime,

          SUM(CASE WHEN createdAt >= CURDATE() THEN 1 ELSE 0 END) as today,

          SUM(
            CASE
              WHEN createdAt >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
              THEN 1 ELSE 0
            END
          ) as week,

          SUM(
            CASE
              WHEN createdAt >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
              THEN 1 ELSE 0
            END
          ) as month,

          SUM(
            CASE
              WHEN createdAt >= DATE_FORMAT(CURDATE(), '%Y-01-01')
              THEN 1 ELSE 0
            END
          ) as year

        FROM goodsViews
        ${viewWhere}
        GROUP BY goodId
      ) v ON v.goodId = g.id

      ${where}

      ORDER BY ${orderField} ${isDesc ? 'DESC' : 'ASC'}
      LIMIT ${limit}
      OFFSET ${offset}
      `,
        { type: QueryTypes.SELECT }
      );

      const total = await sequelizeWithDB.query(
        `
      SELECT COUNT(*) as count
      FROM goods g
      ${where}
      `,
        { type: QueryTypes.SELECT }
      );

      const totalCount = total[0].count;
      const totalPages = Math.ceil(totalCount / limit);

      return resp.json({
        data: goods,
        totalPages,
        totalCount,
        currentPage: page,
      });
    } catch (err) {
      console.log(err);
      return next(ErrorApi.badRequest(err.message));
    }
  };
  static Del = async (req, resp, next) => {
    try {
      const { id } = req.params;
      const goodId = parseInt(id);

      // 1. Отримати всі volume товару
      const volumes = await Volume.findAll({ where: { goodId: goodId } });
      const volumeIds = volumes.map((v) => v.id);

      // 2. Видалити зображення, привʼязані до volume
      await Img.destroy({ where: { volumeId: volumeIds } });
      // 3. Видалити обʼєми (volume)
      await Volume.destroy({ where: { goodId: goodId } });
      // 4. Видалити фільтри товару
      await ProductCategoryFilter.destroy({ where: { goodId: goodId } });
      // 5. Нарешті, видалити сам товар
      await Goods.destroy({ where: { id: goodId } });
      return resp.json({ message: 'Товар та всі повʼязані записи видалено' });
    } catch (err) {
      return next(
        ErrorApi.badRequest(err.message || 'Помилка видалення товару')
      );
    }
  };
  static MassDelete = async (req, resp, next) => {
    const { ides } = req.body; // масив айді товарів
    if (!Array.isArray(ides) || ides.length === 0) {
      return next(
        ErrorApi.badRequest('Список товарів порожній або некоректний')
      );
    }

    try {
      for (const id of ides) {
        const goodId = parseInt(id);

        // 1. Отримати всі volume товару
        const volumes = await Volume.findAll({
          where: { goodId },
        });
        const volumeIds = volumes.map((v) => v.id);

        // 2. Видалити зображення, привʼязані до volume
        if (volumeIds.length > 0) {
          await Img.destroy({ where: { volumeId: volumeIds } });
        }

        // 3. Видалити обʼєми (volume)
        await Volume.destroy({ where: { goodId } });

        // 4. Видалити фільтри товару
        await ProductCategoryFilter.destroy({ where: { goodId } });

        // 5. Видалити сам товар
        await Goods.destroy({ where: { id: goodId } });
      }

      return resp.json({ message: 'Успішно видалено товари' });
    } catch (err) {
      await transaction.rollback();
      return next(
        ErrorApi.badRequest(err.message || 'Помилка масового видалення')
      );
    }
  };

  static MassHide = async (req, resp, next) => {
    const { ides } = req.body;
    if (!Array.isArray(ides) || ides.length === 0) {
      return next(
        ErrorApi.badRequest('Список товарів порожній або некоректний')
      );
    }

    try {
      await Goods.update({ isShow: false }, { where: { id: ides } });
      return resp.json({ message: 'Товари приховано' });
    } catch (err) {
      return next(
        ErrorApi.badRequest(err.message || 'Помилка приховування товарів')
      );
    }
  };

  static MassShow = async (req, resp, next) => {
    const { ides } = req.body;

    if (!Array.isArray(ides) || ides.length === 0) {
      return next(
        ErrorApi.badRequest('Список товарів порожній або некоректний')
      );
    }

    try {
      await Goods.update({ isShow: true }, { where: { id: ides } });

      return resp.json({ message: 'Товари показано' });
    } catch (err) {
      return next(ErrorApi.badRequest(err.message || 'Помилка показу товарів'));
    }
  };
  static GetForSiteMapCatalog = async (req, resp, next) => {
    try {
      const goods = await Goods.findAndCountAll({ where: { isShow: true } });
      const countPages = Math.ceil(goods.count / 20);
      return resp.json({ countPages });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetCategoryForSiteMap = async (req, resp, next) => {
    try {
      const categories = await Category.findAll({
        attributes: ['nameru'],
        // Використовуємо 'include' для об'єднання з таблицею товарів
        include: [
          {
            model: Goods,
            // Використовуємо 'where' для фільтрації товарів за 'isShow'
            where: {
              isShow: true,
            },
            attributes: ['id'],
            // 'required: true' робить INNER JOIN, відкидаючи категорії без відповідних товарів
            required: true,
          },
        ],
        // 'distinct: true' гарантує, що кожна категорія буде унікальною
        distinct: true,
      });
      let categoryAndCountPages = categories.map((x) => ({
        url: UkrToEng(x.nameru),
        countPages: Math.ceil(x.goods.length / 20),
      }));
      return resp.json(categoryAndCountPages);
    } catch (err) {
      return next(
        ErrorApi.badRequest(
          err.message || 'Error fetching categories for sitemap.'
        )
      );
    }
  };
  static GetSubcategoryForSiteMap = async (req, resp, next) => {
    try {
      const subcategory = await Subcategory.findAll({
        attributes: ['nameru'],
        // Використовуємо 'include' для об'єднання з таблицею товарів
        include: [
          { model: Category, attributes: ['nameru'] },
          {
            model: Goods,
            // Використовуємо 'where' для фільтрації товарів за 'isShow'
            where: {
              isShow: true,
            },
            attributes: ['id'],
            // 'required: true' робить INNER JOIN, відкидаючи категорії без відповідних товарів
            required: true,
          },
        ],
        // 'distinct: true' гарантує, що кожна категорія буде унікальною
        distinct: true,
      });

      let categoryAndCountPages = subcategory.map((x) => ({
        url: `${UkrToEng(x.category.nameru)}/${UkrToEng(x.nameru)}`,
        countPages: Math.ceil(x.goods.length / 20),
      }));
      return resp.json(categoryAndCountPages);
    } catch (err) {
      return next(
        ErrorApi.badRequest(
          err.message || 'Error fetching categories for sitemap.'
        )
      );
    }
  };
  static GetBrendsForSitemap = async (req, resp, next) => {
    try {
      const brends = await Brends.findAll({
        attributes: ['name'],
        // Використовуємо 'include' для об'єднання з таблицею товарів
        include: [
          {
            model: Goods,
            // Використовуємо 'where' для фільтрації товарів за 'isShow'
            where: {
              isShow: true,
            },
            attributes: ['id'],
            // 'required: true' робить INNER JOIN, відкидаючи категорії без відповідних товарів
            required: true,
          },
        ],
        // 'distinct: true' гарантує, що кожна категорія буде унікальною
        distinct: true,
      });
      let brendSiteMap = brends.map((x) => ({
        url: `${toSlug(x.name)}`,
        countPages: Math.ceil(x.goods.length / 20),
      }));
      return resp.json(brendSiteMap);
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetDiscountFromSitemap = async (req, resp, next) => {
    try {
      const goods = await Goods.findAndCountAll({
        where: { isDiscount: true, isShow: true },
        attributes: ['id'],
        raw: true,
      });

      return resp.json(Math.ceil(goods.count / 20));
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetSelectGoodsForSitemap = async (req, resp, next) => {
    try {
      const goods = await Goods.findAll({
        attributes: ['id'],
        where: { isShow: true },
        include: [
          {
            attributes: ['id', 'url'],
            model: Volume,
            order: [
              [Sequelize.literal('`volumes`.`sort` IS NULL'), 'ASC'],
              [Sequelize.literal('`volumes`.`sort`'), 'ASC'],
            ],
          },
        ],
      });
      const res = goods.map((x) => x.volumes[0].url);
      return resp.json(res);
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetSelectGoodsForSitemapWithImg = async (req, resp, next) => {
    try {
      const goods = await Goods.findAll({
        attributes: ['id', 'nameuk', 'nameru'],
        where: { isShow: true },
        include: [
          {
            attributes: ['id', 'url'],
            model: Volume,
            order: [
              [Sequelize.literal('`volumes`.`sort` IS NULL'), 'ASC'],
              [Sequelize.literal('`volumes`.`sort`'), 'ASC'],
            ],
            include: [
              {
                model: Img,
              },
            ],
          },
        ],
      });
      const res = goods.map((x) => ({
        url: x.volumes[0].url,
        // flatMap пройде по volumes і "склеїть" усі масиви imgs в один рівень
        img: x.volumes.flatMap((j) => j.imgs),
        nameuk: x.nameuk,
        nameru: x.nameru,
      }));
      return resp.json(res);
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static EditLine = async (req, resp, next) => {
    try {
      const { idLine } = req.params;
      const { newName } = req.body;

      const line = await Linia.findOne({
        where: { id: parseInt(idLine) },
      });

      if (!line) {
        return resp.status(404).json({ message: 'Лінію не знайдено' });
      }

      line.name = newName;
      await line.save();

      return resp.json({ message: 'Оновлено', line });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static DelLine = async (req, resp, next) => {
    try {
      const { idLine } = req.params;

      const line = await Linia.findOne({
        where: { id: parseInt(idLine) },
      });

      if (!line) {
        return resp.status(404).json({ message: 'Лінію не знайдено' });
      }

      await line.destroy();

      return resp.json({ message: 'Видалено' });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetForVolumeMini = async (req, resp, next) => {
    try {
      const { art } = req.params;
      const goods = await Goods.findOne({
        attributes: ['id', 'nameuk', 'nameru'],
        include: [
          {
            model: Volume,
            where: { art },
            required: true,
            include: [{ model: Img }],
          },
        ],
      });
      return resp.json({ goods });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };

  static SetDiscountToBrend = async (req, res, next) => {
    try {
      let { brendId, discount } = req.body;

      if (brendId == null || discount == null) {
        return res.status(400).json({
          message: 'brendId і discount обовʼязкові',
        });
      }

      brendId = Number(brendId);
      discount = Number(discount);

      if (Number.isNaN(brendId) || Number.isNaN(discount)) {
        return res.status(400).json({
          message: 'Невірний формат даних',
        });
      }

      const brend = await Brends.findByPk(brendId);

      if (!brend) {
        return res.status(404).json({
          message: 'Бренд не знайдено',
        });
      }

      // ⚡ ОДИН SQL UPDATE через subquery
      await Volume.update(
        {
          discount,

          priceWithDiscount: Sequelize.literal(
            `price - (price * ${discount} / 100)`
          ),
        },
        {
          where: Sequelize.literal(`
          goodId IN (
            SELECT id FROM goods WHERE brendId = ${brendId}
          )
        `),
        }
      );

      return res.json({
        message: 'Знижку застосовано до бренду',
        brendId,
        discount,
      });
    } catch (err) {
      return ErrorApi.badRequest(err);
    }
  };

  static SetDiscount = async (req, res, next) => {
    try {
      let { discount, selectGoods } = req.body;
      // перевірка
      if (discount == null || !Array.isArray(selectGoods)) {
        return res.status(400).json({
          message: 'discount і selectGoods обовʼязкові',
        });
      }

      discount = Number(discount);

      if (Number.isNaN(discount)) {
        return res.status(400).json({
          message: 'Невірний discount',
        });
      }

      // очищаємо і переводимо в числа
      const goodsIds = selectGoods
        .map((id) => Number(id))
        .filter((id) => !Number.isNaN(id));

      if (!goodsIds.length) {
        return res.status(400).json({
          message: 'Немає валідних товарів',
        });
      }

      // ⚡ один update
      await Volume.update(
        {
          discount,

          priceWithDiscount: Sequelize.literal(
            `ROUND(price - (price * ${discount} / 100), 0)`
          ),
        },
        {
          where: {
            goodId: {
              [Op.in]: goodsIds,
            },
          },
        }
      );

      return res.json({
        message: 'Знижку застосовано',
        countGoods: goodsIds.length,
        discount,
      });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static UpdatePrice = async (req, res, next) => {
    try {
      let { percent, selectGoods } = req.body;

      // percent може бути:
      // 10  => +10%
      // -10 => -10%

      if (percent == null || !Array.isArray(selectGoods)) {
        return res.status(400).json({
          message: 'percent і selectGoods обовʼязкові',
        });
      }

      percent = Number(percent);

      if (Number.isNaN(percent)) {
        return res.status(400).json({
          message: 'Невірний percent',
        });
      }

      const goodsIds = selectGoods
        .map((id) => Number(id))
        .filter((id) => !Number.isNaN(id));

      if (!goodsIds.length) {
        return res.status(400).json({
          message: 'Немає валідних товарів',
        });
      }

      // коефіцієнт зміни ціни
      // +10% => 1.1
      // -10% => 0.9
      const multiplier = 1 + percent / 100;

      await Volume.update(
        {
          // нова price
          price: Sequelize.literal(`
          ROUND(price * ${multiplier}, 0)
        `),

          // новий priceWithDiscount
          priceWithDiscount: Sequelize.literal(`
          ROUND(
            price
            -
            (
              price * discount / 100
            ),
            0
          )
        `),
        },
        {
          where: {
            goodId: {
              [Op.in]: goodsIds,
            },
          },
        }
      );

      return res.json({
        message: 'Ціни успішно оновлено',
        percent,
      });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static UpdatePriceGRN = async (req, res, next) => {
    try {
      let { value, selectGoods } = req.body;

      // value:
      // 100  => +100 грн
      // -100 => -100 грн

      if (value == null || !Array.isArray(selectGoods)) {
        return res.status(400).json({
          message: 'value і selectGoods обовʼязкові',
        });
      }

      value = Number(value);

      if (Number.isNaN(value)) {
        return res.status(400).json({
          message: 'Невірний value',
        });
      }

      const goodsIds = selectGoods
        .map((id) => Number(id))
        .filter((id) => !Number.isNaN(id));

      if (!goodsIds.length) {
        return res.status(400).json({
          message: 'Немає валідних товарів',
        });
      }

      await Volume.update(
        {
          // нова ціна
          price: Sequelize.literal(`
          ROUND(price + (${value}), 0)
        `),

          // нова ціна зі знижкою
          priceWithDiscount: Sequelize.literal(`
          ROUND(
            price -
            (
              price * discount / 100
            ),
            0
          )
        `),
        },
        {
          where: {
            goodId: {
              [Op.in]: goodsIds,
            },
          },
        }
      );

      return res.json({
        message: 'Ціни успішно оновлено',
        value,
      });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
}

module.exports = GoodsControllers;
