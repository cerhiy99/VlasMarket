const { Goods, Volume, Img, Brends, Category, Subcategory } = require('../models/models');
const builder = require('xmlbuilder');
const path = require('path');
const { Sequelize } = require('sequelize');

class FeedController {
  static UkrFeed = async (req, res) => {
    try {
      const goods = await Goods.findAll({
        where: { isShow: true, isFeed: true },
        attributes: ['nameuk', 'descriptionuk', 'id', 'product_type_uk'], // Додаємо art з Goods
        include: [
          {
            model: Volume,
            attributes: [
              'url',
              'price',
              'discount',
              'priceWithDiscount',
              'isAvailability',
              'art',
              'gtin',
            ],
            // Обмежуємо вибірку лише однією варіацією
            limit: 1,
            order: [
              [Sequelize.literal('ISNULL(`sort`)'), 'ASC'],
              ['sort', 'ASC'],
            ], // Важливо, щоб брати саме першу варіацію
            include: [{ model: Img, attributes: ['img'] }],
          },
          {
            model: Brends,
          },
          {
            model: Category,
          },
          {
            model: Subcategory,
          },
        ],
      });

      const feed = builder
        .create('rss', { encoding: 'utf-8' })
        .att('xmlns:g', 'http://base.google.com/ns/1.0')
        .att('version', '2.0');

      const channel = feed.ele('channel');
      channel.ele('title', {}, 'Фід товарів');
      channel.ele('link', {}, 'https://baylap.com/');
      channel.ele('description', {}, 'Товари для Google Merchant Center');

      goods.forEach((good) => {
        // Беремо лише першу варіацію, якщо вона існує
        const volume = good.volumes && good.volumes.length > 0 ? good.volumes[0] : null;

        if (volume) {
          const item = channel.ele('item');

          // ID: Використовуємо артикул з головної таблиці Goods
          // Оскільки ви вказали, що Art є в Goods, краще використовувати його як id
          item.ele('g:id', {}, volume.art);

          // Title: Назва товару з Goods
          item.ele('g:title', {}, good.nameuk);
          item.ele('g:brand', {}, good.brend.name);
          if (good.category && good.category.nameuk) {
            if (good.subcategory && good.subcategory.nameuk) {
              item.ele(
                'g:product_type',
                {},
                good.category.nameuk + ' › ' + good.subcategory.nameuk
              );
            } else {
              item.ele('g:product_type', {}, good.category.nameuk);
            }
          }
          if (volume.gtin) {
            item.ele('g:gtin', {}, volume.gtin);
          }
          // Description: Опис товару з Goods
          item.ele(
            'g:description',
            {},
            good.descriptionuk
              .replace(/<br\s*\/?>/gi, '\n') // Заміна <br> на новий рядок
              .replace(/<p>|<\/p>/gi, '\n\n') // Заміна <p> на два нових рядки
              .replace(/<[^>]*>/g, '') // Видалення решти тегів
              .replace(/&[a-z]+;/gi, '') // Видалення всіх HTML-сутностей (напр., &nbsp;)
              .replace(/\n\s*\n/g, '\n\n') // Видалення зайвих порожніх рядків
              .trim() // Видалення пробілів на початку і в кінці
              .slice(0, 500) // Обрізка
          );

          // Link: Посилання на товар.
          item.ele('g:link', {}, `https://baylap.com/goods/${volume.url}`);

          // Image Link: Посилання на головне зображення першої варіації
          if (volume.imgs && volume.imgs.length > 0) {
            item.ele('g:image_link', {}, `https://baylap.com/image/${volume.imgs[0].img}`);
          }

          // Price: Ціна
          if (volume.discount > 0) {
            item.ele('g:price', {}, `${volume.price} UAH`);
            item.ele('g:sale_price', {}, `${volume.priceWithDiscount} UAH`);
          } else {
            item.ele('g:price', {}, `${volume.price} UAH`);
          }

          const availabilityMap = {
            inStock: 'in stock',
            notAvailable: 'out of stock',
            customMade: 'preorder',
          };
          const availability = availabilityMap[volume.isAvailability] || 'out of stock';

          item.ele('g:availability', {}, availability);
        }
      });

      const xml = feed.end({ pretty: true });
      res.set('Content-Type', 'application/xml');
      res.send(xml);
    } catch (err) {
      console.error('Помилка генерації фідів:', err);
      res.status(500).send('Помилка генерації фідів');
    }
  };
  static RUFeed = async (req, res) => {
    try {
      const goods = await Goods.findAll({
        where: { isShow: true, isFeed: true },
        attributes: ['nameru', 'descriptionru', 'id', 'product_type_ru'], // Додаємо art з Goods
        include: [
          {
            model: Volume,
            attributes: [
              'url',
              'price',
              'discount',
              'priceWithDiscount',
              'isAvailability',
              'art',
              'gtin',
            ],
            // Обмежуємо вибірку лише однією варіацією
            limit: 1,
            order: [
              [Sequelize.literal('ISNULL(`sort`)'), 'ASC'],
              ['sort', 'ASC'],
            ], // Важливо, щоб брати саме першу варіацію
            include: [{ model: Img, attributes: ['img'] }],
          },
          {
            model: Brends,
          },
          {
            model: Category,
          },
          {
            model: Subcategory,
          },
        ],
      });

      const feed = builder
        .create('rss', { encoding: 'utf-8' })
        .att('xmlns:g', 'http://base.google.com/ns/1.0')
        .att('version', '2.0');

      const channel = feed.ele('channel');
      channel.ele('title', {}, 'Фід товарів');
      channel.ele('link', {}, 'https://baylap.com/ru');
      channel.ele('description', {}, 'Товари для Google Merchant Center');

      goods.forEach((good) => {
        // Беремо лише першу варіацію, якщо вона існує
        const volume = good.volumes && good.volumes.length > 0 ? good.volumes[0] : null;

        if (volume) {
          const item = channel.ele('item');

          // ID: Використовуємо артикул з головної таблиці Goods
          // Оскільки ви вказали, що Art є в Goods, краще використовувати його як id
          item.ele('g:id', {}, volume.art);

          // Title: Назва товару з Goods
          item.ele('g:title', {}, good.nameru);

          item.ele('g:brand', {}, good.brend.name);
          if (good.category && good.category.nameuk) {
            if (good.subcategory && good.subcategory.nameuk) {
              item.ele(
                'g:product_type',
                {},
                good.category.nameru + ' › ' + good.subcategory.nameru
              );
            } else {
              item.ele('g:product_type', {}, good.category.nameru);
            }
          }
          if (volume.gtin) {
            item.ele('g:gtin', {}, volume.gtin);
          }
          // Description: Опис товару з Goods
          item.ele(
            'g:description',
            {},
            good.descriptionru
              .replace(/<br\s*\/?>/gi, '\n') // Заміна <br> на новий рядок
              .replace(/<p>|<\/p>/gi, '\n\n') // Заміна <p> на два нових рядки
              .replace(/<[^>]*>/g, '') // Видалення решти тегів
              .replace(/&[a-z]+;/gi, '') // Видалення всіх HTML-сутностей (напр., &nbsp;)
              .replace(/\n\s*\n/g, '\n\n') // Видалення зайвих порожніх рядків
              .trim() // Видалення пробілів на початку і в кінці
              .slice(0, 500) // Обрізка
          );

          // Link: Посилання на товар.
          item.ele('g:link', {}, `https://baylap.com/ru/goods/${volume.url}`);

          // Image Link: Посилання на головне зображення першої варіації
          if (volume.imgs && volume.imgs.length > 0) {
            item.ele('g:image_link', {}, `https://baylap.com/image/${volume.imgs[0].img}`);
          }

          // Price: Ціна
          if (volume.discount > 0) {
            item.ele('g:price', {}, `${volume.price} UAH`);
            item.ele('g:sale_price', {}, `${volume.priceWithDiscount} UAH`);
          } else {
            item.ele('g:price', {}, `${volume.price} UAH`);
          }

          const availabilityMap = {
            inStock: 'in stock',
            notAvailable: 'out of stock',
            customMade: 'preorder',
          };
          const availability = availabilityMap[volume.isAvailability] || 'out of stock';

          item.ele('g:availability', {}, availability);
        }
      });

      const xml = feed.end({ pretty: true });
      res.set('Content-Type', 'application/xml');
      res.send(xml);
    } catch (err) {
      console.error('Помилка генерації фідів:', err);
      res.status(500).send('Помилка генерації фідів');
    }
  };
}

module.exports = FeedController;
