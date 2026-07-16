const ErrorApi = require('../error/ErrorApi');
const axios = require('axios');
const { parse } = require('csv-parse/sync');
const { Volume } = require('../models/models');
const { Sequelize } = require('sequelize');

function sheetUrlToCsv(url) {
  const match = url.match(/spreadsheets\/(?:u\/\d+\/)?d\/([^/]+)/);

  if (!match) {
    throw new Error('Некоректне посилання Google Sheets');
  }

  const sheetId = match[1];

  const gid = url.match(/[?&#]gid=(\d+)/)?.[1];

  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv${gid ? `&gid=${gid}` : ''}`;
}

class SyncController {
  static Sync = async (req, res, next) => {
    try {
      const { url } = req.body;
      //const file = req.file.file;
      let countUpdated = 0;

      if (!url && !file) {
        next(ErrorApi.badRequest());
      }
      if (url) {
        const updatedUrl = sheetUrlToCsv(url);

        const { data } = await axios.get(updatedUrl);

        const rows = parse(data, {
          skip_empty_lines: true,
        });

        const products = [];

        for (const row of rows) {
          const articleCell = row[0]?.trim();

          // пропускаємо порожні рядки
          if (!articleCell) continue;

          // пропускаємо заголовки та розділи
          if (articleCell === 'Артикул' || !/[A-Za-z0-9]/.test(articleCell)) {
            continue;
          }

          const articles = articleCell
            .split(/\r?\n/)
            .map((a) => a.trim())
            .filter(Boolean);

          products.push({
            articles,
            name: row[2]?.trim(),
            wholesalePrice: Number(row[5]?.replace(',', '.')) || 0,
            retailPrice: Number(row[6]?.replace(',', '.')) || 0,
          });
        }
        products.forEach((x) => {
          Volume.update(
            {
              price: x.retailPrice,
              priceWithDiscount: Sequelize.literal(
                `ROUND(${x.retailPrice} * (1 - discount / 100), 0)`
              ),
            },
            {
              where: {
                article,
                brendId,
              },
            }
          );
        });

        return res.json();
        return rows;
      } else {
      }
    } catch (err) {
      console.log(err);
      return next(ErrorApi.badRequest(err));
    }
  };
}

module.exports = SyncController;
