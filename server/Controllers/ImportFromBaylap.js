const path = require('path');
const ErrorApi = require('../error/ErrorApi');
const {
  Brends,
  Category,
  CountryMade,
  Subcategory,
  Linia,
  Goods,
  Volume,
  Img,
  Recognition,
  ProductRecognition,
} = require('../models/models');
const ConvertPngToWebP = require('./ConvertPngToWebP');
const ImageToFullName = require('./ImageToFullName');
const fs = require('fs');
const GoodsControllers = require('./GoodsControllers');

const uploadDir = path.resolve(__dirname, '..', 'static');

class ImportFromBaylap {
  static AddGoods = async (req, res, next) => {
    try {
      const files = req.files;
      const { goods_data } = req.body;
      const goods = JSON.parse(goods_data);

      for (let i = 0; i < goods.volumes.length; i++) {
        const volume = goods.volumes[i];

        const isVolume = await Volume.findOne({ where: { art: volume.art } });
        if (isVolume) {
          console.error(
            'Помилка прийняти файл з baylap бо артикул зайнятий. Артикул:',
            volume.art
          );

          return res.status(400).json({
            message: 'Артикул зайнятий. Скоріш за все цей товар вже є.',
          });
        }
      }

      const brend = await Brends.findOne({ where: { name: goods.brend.name } });
      const brendId = brend?.id || null;

      // 1. КАТЕГОРІЯ
      let categoryId = null;
      if (goods?.category?.nameuk) {
        const category = await Category.findOne({
          where: { nameuk: goods.category.nameuk },
        });
        categoryId = category?.id || null;
      }

      // 2. КРАЇНА ВИРОБНИК
      let countryMadeId = null;
      if (goods?.countryMade?.nameuk) {
        const countryMade = await CountryMade.findOne({
          where: { nameuk: goods.countryMade.nameuk },
        });
        countryMadeId = countryMade?.id || null;
      }

      // 3. ПІДКАТЕГОРІЯ
      let subcategoryId = null;
      if (goods?.subcategory?.nameuk) {
        const subcategory = await Subcategory.findOne({
          where: { nameuk: goods.subcategory.nameuk },
        });
        subcategoryId = subcategory?.id || null;
      }

      // 4. ЛІНІЯ (Виправлено: перевіряємо goods.linium?.name)
      let liniaId = null;
      if (goods?.linium?.name) {
        const linia = await Linia.findOne({
          where: { name: goods.linium.name },
        });
        liniaId = linia?.id || null;
      }

      const goodsCreate = await Goods.create({
        nameuk: goods.nameuk,
        nameru: goods.nameru,
        descriptionuk: goods.descriptionuk,
        descriptionru: goods.descriptionru,
        art: goods.art,
        characteristicuk: goods.characteristicuk,
        characteristicru: goods.characteristicru,
        video: goods.video,
        isDiscount: goods.isDiscount,
        isBestseller: goods.isBestseller,
        isNovetly: goods.isNovetly,
        isHit: goods.isHit,
        isFreeDelivery: goods.isFreeDelivery,
        brendId: goods.brendId,
        categoryId,
        countryMadeId,
        subcategoryId,
        views: goods.views,
        isShow: false,
        liniaId,
        isForMan: goods.isForMan,
        isFeed: goods.isFeed,
        nameTypeuk: goods.nameTypeuk,
        nameTyperu: goods.nameTyperu,
        product_type_uk: goods.product_type_uk,
        product_type_ru: goods.product_type_ru,
      });

      for (let i = 0; i < goods.volumes.length; i++) {
        const volume = goods.volumes[i];
        const newVolume = await Volume.create({
          nameVolume: volume.nameVolume,
          volume: volume.volume,
          price: volume.price,
          discount: volume.discount,
          priceWithDiscount: volume.priceWithDiscount,
          metaTitleuk: volume.metaTitleuk,
          metaDescriptionuk: volume.metaDescriptionuk,
          canonicaluk: volume.canonicaluk,
          metaTitleru: volume.metaTitleru,
          metaDescriptionru: volume.metaDescriptionru,
          canonicalru: volume.canonicalru,
          isAvailability: volume.isAvailability,
          sort: volume.sort,
          url: volume.url,
          isFreeDelivery: volume.isFreeDelivery,
          art: volume.art,
          gtin: volume.gtin,
          goodId: goodsCreate.id,
        });
        for (let j = 0; j < volume.imgs.length; j++) {
          const img = volume.imgs[j];

          const fileName = 'images' + img.id;

          const imgFile = files?.[fileName];

          const filePath = path.join(uploadDir, fileName + '.webp');

          await imgFile.mv(filePath);

          await Img.create({
            img: fileName + '.webp',
            volumeuk: img.volumeuk,
            volumeru: img.volumeru,
            volumeId: newVolume.id,
          });
        }
      }

      for (let i = 0; i < goods.productRecognitions.length; i++) {
        const recognition = goods.productRecognitions[i].recognition;
        const recognitionFromBD = await Recognition.findOne({
          where: { nameuk: recognition.nameuk, categoryId: categoryId },
        });
        if (recognitionFromBD) {
          ProductRecognition.create({
            goodId: goodsCreate.id,
            recognitionId: recognitionFromBD.id,
          });
        }
      }

      await ConvertPngToWebP.UpdateNoWebp();
      ImageToFullName.UpdateImage();
      GoodsControllers.ClearDataBase();

      console.log('Успішно додано товар з байлап ' + goods.id);
      //productRecognitions
      //Перевірка чи товару ще нема (art в volume)
      return res.json({});
    } catch (err) {
      console.error('Помилка прийняти файл з baylap в AddGoods ', err);
      return next(ErrorApi.badRequest(err));
    }
  };

  static UpdateGoods = async (req, res, next) => {
    try {
      const files = req.files;
      const { goods_data } = req.body;
      const goods = JSON.parse(goods_data);

      let existingGoodId = null;

      // 1. ПЕРЕВІРКА НА ОНОВЛЕННЯ: шукаємо, чи є хоч один артикул у базі
      for (let i = 0; i < goods.volumes.length; i++) {
        const volume = goods.volumes[i];
        const isVolume = await Volume.findOne({ where: { art: volume.art } });
        if (isVolume) {
          existingGoodId = isVolume.goodId; // Знайшли ID товару на нашому сайті!
          break; // Виходимо з циклу пошуку
        }
      }

      // Знаходимо всі довідники
      const brend = await Brends.findOne({ where: { name: goods.brend.name } });
      const brendId = brend?.id || null;

      let categoryId = null;
      if (goods?.category?.nameuk) {
        const category = await Category.findOne({
          where: { nameuk: goods.category.nameuk },
        });
        categoryId = category?.id || null;
      }

      let countryMadeId = null;
      if (goods?.countryMade?.nameuk) {
        const countryMade = await CountryMade.findOne({
          where: { nameuk: goods.countryMade.nameuk },
        });
        countryMadeId = countryMade?.id || null;
      }

      let subcategoryId = null;
      if (goods?.subcategory?.nameuk) {
        const subcategory = await Subcategory.findOne({
          where: { nameuk: goods.subcategory.nameuk },
        });
        subcategoryId = subcategory?.id || null;
      }

      let liniaId = null;
      if (goods?.linium?.name) {
        const linia = await Linia.findOne({
          where: { name: goods.linium.name },
        });
        liniaId = linia?.id || null;
      }

      // Об'єкт з чистими полями для створення/оновлення товару
      const goodsFields = {
        nameuk: goods.nameuk,
        nameru: goods.nameru,
        descriptionuk: goods.descriptionuk,
        descriptionru: goods.descriptionru,
        art: goods.art,
        characteristicuk: goods.characteristicuk,
        characteristicru: goods.characteristicru,
        video: goods.video,
        isDiscount: goods.isDiscount,
        isBestseller: goods.isBestseller,
        isNovetly: goods.isNovetly,
        isHit: goods.isHit,
        isFreeDelivery: goods.isFreeDelivery,
        brendId: brendId, // Використовуємо знайдений brendId
        categoryId,
        countryMadeId,
        subcategoryId,
        views: goods.views,
        isShow: false, // Залишаємо false (метод сортування сам усе розкладе)
        liniaId,
        isForMan: goods.isForMan,
        isFeed: goods.isFeed,
        nameTypeuk: goods.nameTypeuk,
        nameTyperu: goods.nameTyperu,
        product_type_uk: goods.product_type_uk,
        product_type_ru: goods.product_type_ru,
      };

      let currentGoodId;

      if (existingGoodId) {
        // --- СЦЕНАРІЙ ОНОВЛЕННЯ ---
        console.log(
          `Товар знайдено (ID: ${existingGoodId}). Оновлюємо основні дані...`
        );
        await Goods.update(goodsFields, { where: { id: existingGoodId } });
        currentGoodId = existingGoodId;

        // Видаляємо старі зв'язки розпізнавання, щоб записати нові актуальні
        await ProductRecognition.destroy({ where: { goodId: currentGoodId } });
      } else {
        // --- СЦЕНАРІЙ СТВОРЕННЯ ---
        console.log('Товар новий. Створюємо запис...');
        const goodsCreate = await Goods.create(goodsFields);
        currentGoodId = goodsCreate.id;
      }

      // 2. ОБРОБКА ОБ'ЄМІВ ТА ФОТОГРАФІЙ
      for (let i = 0; i < goods.volumes.length; i++) {
        const volume = goods.volumes[i];

        const volumeFields = {
          nameVolume: volume.nameVolume,
          volume: volume.volume,
          price: volume.price,
          discount: volume.discount,
          priceWithDiscount: volume.priceWithDiscount,
          metaTitleuk: volume.metaTitleuk,
          metaDescriptionuk: volume.metaDescriptionuk,
          canonicaluk: volume.canonicaluk,
          metaTitleru: volume.metaTitleru,
          metaDescriptionru: volume.metaDescriptionru,
          canonicalru: volume.canonicalru,
          isAvailability: volume.isAvailability,
          sort: volume.sort,
          url: volume.url,
          isFreeDelivery: volume.isFreeDelivery,
          art: volume.art,
          gtin: volume.gtin,
          goodId: currentGoodId,
        };

        // Перевіряємо, чи є вже конкретно цей об'єм у базі
        const existingVolume = await Volume.findOne({
          where: { art: volume.art },
        });
        let targetVolumeId;

        if (existingVolume) {
          // Оновлюємо існуючий об'єм
          await existingVolume.update(volumeFields);
          targetVolumeId = existingVolume.id;

          // Якщо при оновленні прийшли НОВІ фото, старі краще видалити з бази (диск почистить метод ClearDataBase)
          if (volume.imgs && volume.imgs.length > 0 && files) {
            // Видаляємо старі картинки з БД тільки якщо в запиті реально лежать нові файли для цього об'єму
            const hasNewFiles = volume.imgs.some(
              (img) => files['images' + img.id]
            );
            if (hasNewFiles) {
              await Img.destroy({ where: { volumeId: targetVolumeId } });
            }
          }
        } else {
          // Створюємо новий об'єм
          const newVolume = await Volume.create(volumeFields);
          targetVolumeId = newVolume.id;
        }

        // Завантаження картинок (якщо вони прийшли в запиті)
        if (volume.imgs) {
          for (let j = 0; j < volume.imgs.length; j++) {
            const img = volume.imgs[j];
            const fileKey = 'images' + img.id;
            const imgFile = files?.[fileKey];

            if (imgFile) {
              const fileNameWithExt = fileKey + '.webp';
              const filePath = path.join(uploadDir, fileNameWithExt);

              await imgFile.mv(filePath);

              // Створюємо новий запис про фото в БД
              await Img.create({
                img: fileNameWithExt,
                volumeuk: img.volumeuk,
                volumeru: img.volumeru,
                volumeId: targetVolumeId,
              });
            }
          }
        }
      }

      // 3. ОБРОБКА РОЗПІЗНАВАННЯ (ProductRecognition)
      if (goods.productRecognitions) {
        for (let i = 0; i < goods.productRecognitions.length; i++) {
          const recognition = goods.productRecognitions[i].recognition;
          if (!recognition) continue;

          const recognitionFromBD = await Recognition.findOne({
            where: { nameuk: recognition.nameuk, categoryId: categoryId },
          });

          if (recognitionFromBD) {
            await ProductRecognition.create({
              goodId: currentGoodId,
              recognitionId: recognitionFromBD.id,
            });
          }
        }
      }

      // Фонове очищення, стандартизація та сортування
      await ConvertPngToWebP.UpdateNoWebp();
      await ImageToFullName.UpdateImage(); // Додав await для стабільності потоку
      await GoodsControllers.ClearDataBase();

      console.log(
        `Операція успішно завершена для товару з Baylap ID: ${goods.id}`
      );
      return res.json({
        success: true,
        message: existingGoodId ? 'Товар оновлено' : 'Товар створено',
      });
    } catch (err) {
      console.error('Помилка прийняти файл з baylap в AddGoods ', err);
      return next(ErrorApi.badRequest(err.message));
    }
  };
}

module.exports = ImportFromBaylap;
