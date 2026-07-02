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

          const fileName = 'images' + img.id + '.webp';

          const imgFile = files?.[fileName];

          const filePath = path.join(uploadDir, fileName);

          await imgFile.mv(filePath);

          await Img.create({
            img: fileName,
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
}

module.exports = ImportFromBaylap;
