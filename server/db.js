require('dotenv').config();
/*const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
  'VlasMarket',
  'VlasMarketUsername',
  'VlasMarketPassword',
  {
    dialect: 'mysql',
    host: process.env.HOST,
    dialectOptions: {
      multipleStatements: true, // якщо потрібно більше 1 запиту
    },
    timezone: '+03:00',
    hooks: {
      beforeConnect: (config) => {
        // (нічого не потрібно тут у Sequelize, але просто як приклад)
      },
    },
    logging: false,
  }
);
*/
const { Sequelize } = require('sequelize');

module.exports = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    dialect: 'mysql',
    host: process.env.HOST,
    dialectOptions: {
      multipleStatements: true, // якщо потрібно більше 1 запиту
    },
    timezone: '+03:00',
    hooks: {
      beforeConnect: (config) => {
        // (нічого не потрібно тут у Sequelize, але просто як приклад)
      },
    },
    logging: false,
  }
);
