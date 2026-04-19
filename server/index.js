require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./db.js');
const fileUpload = require('express-fileupload');
const path = require('path');
const router = require('./routes/index.js');
require('./models/models.js');
const errorMiddlawere = require('./middleWare/ErrorMiddleWare');
const ParseFromFile = require('./Controllers/ParseFormFile.js');
const ParseFromSite = require('./Controllers/ParseFromSite.js');
const SetUrlToVolume = require('./Controllers/SetUrlToVolume.js');
const ConvertPngToWebP = require('./Controllers/ConvertPngToWebP.js');
const FeedController = require('./Controllers/FeedController.js');
const GoodsControllers = require('./Controllers/GoodsControllers.js');
const ImageToFullName = require('./Controllers/ImageToFullName.js');

const app = express(router);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload({}));

app.use('/api/api', router);
app.get('/image/*', (req, res, next) => {
  const relativePath = req.params[0];
  const filePath = path.join(__dirname, 'static', relativePath);

  // Важливо: перевіряємо розширення, якщо ви хочете обслуговувати тільки avif
  if (!filePath.endsWith('.avif')) {
    return next();
  }

  res.setHeader('Content-Type', 'image/avif');
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

  res.sendFile(filePath, (err) => {
    if (err) {
      // Якщо файл не знайдено, передаємо керування далі (наприклад, на 404 або дефолтну картинку)
      if (!res.headersSent) {
        next();
      }
    }
  });
});

app.use('/image', express.static(path.resolve(__dirname, 'static')));

app.use('/api/feed.xml', FeedController.UkrFeed);
app.use('/api/feedRU.xml', FeedController.RUFeed);
app.use(errorMiddlawere);

const PORT = process.env.PORT || 4444;

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log('server started on port:' + PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

//ParseFromFile.importCsvToDatabase()
//ParseFromSite.getUrl();
/*ParseFromSite.parseParseCurrentProduct(
  'https://constant-delight.com.ua/uk/products/kondicioner-illyuminiruyushchiy',
  'https://constant-delight.com.ua/products/kondicioner-illyuminiruyushchiy',
);*/
//ParseFromSite.ParseAllProducts();

//ConvertPngToWebP.convertOneForTest(30988);
//ConvertPngToWebP.UpdateNoWebp();

start();

//ImageToFullName.UpdateImage();
//ImageToFullName.FixAndCleanImages();

//ParseFromSite.getUrl();
//ParseFromSite.parseAllLine();
//SetUrlToVolume.SetAllGoods();
//SetUrlToVolume.SetAllGoods();
ConvertPngToWebP.UpdateNoWebp();
