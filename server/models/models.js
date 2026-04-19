const { DataTypes, Sequelize } = require('sequelize'); // Імпортуємо DataTypes
const sequelize = require('../db'); // Імпортуємо ваш екземпляр sequelize

const Brends = sequelize.define('brend', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  descriptionuk: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    unique: false,
    defaultValue: null,
  }, //в mysql
  descriptionru: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    unique: false,
    defaultValue: null,
  }, //в mysql]
});

const CountryMade = sequelize.define('countryMade', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nameuk: { type: DataTypes.STRING, allowNull: false, unique: true },
  nameru: { type: DataTypes.STRING, allowNull: false, unique: true },
});

const Category = sequelize.define('category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nameuk: { type: DataTypes.STRING, allowNull: false, unique: true },
  nameru: { type: DataTypes.STRING, allowNull: false, unique: true },
  descriptionuk: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    unique: false,
    defaultValue: null,
  }, //в mysql
  descriptionru: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    unique: false,
    defaultValue: null,
  }, //в mysql
  svg: { type: DataTypes.TEXT, allowNull: false },
  sort: { type: DataTypes.INTEGER, allowNull: true }, //добавити в mysql
});

const FilterCategory = sequelize.define('filterCategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nameuk: { type: DataTypes.STRING, allowNull: false },
  nameru: { type: DataTypes.STRING, allowNull: false },
});

Category.hasMany(FilterCategory);
FilterCategory.belongsTo(Category);

const Subcategory = sequelize.define('subcategory', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nameuk: { type: DataTypes.STRING, allowNull: false },
  nameru: { type: DataTypes.STRING, allowNull: false },
  descriptionuk: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    unique: false,
    defaultValue: null,
  }, //в mysql
  descriptionru: {
    type: DataTypes.TEXT('long'),
    allowNull: true,
    unique: false,
    defaultValue: null,
  }, //в mysql
  img: { type: DataTypes.STRING, allowNull: true },
});

Category.hasMany(Subcategory);
Subcategory.belongsTo(Category);

const Goods = sequelize.define(
  'goods',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nameuk: { type: DataTypes.STRING, allowNull: false },
    nameru: { type: DataTypes.STRING, allowNull: false },
    descriptionuk: { type: DataTypes.TEXT('long'), allowNull: false },
    descriptionru: { type: DataTypes.TEXT('long'), allowNull: false },
    art: { type: DataTypes.STRING, allowNull: false },
    characteristicuk: { type: DataTypes.TEXT, allowNull: false },
    characteristicru: { type: DataTypes.TEXT, allowNull: false },
    video: { type: DataTypes.TEXT, allowNull: true }, //змінив з string на TEXT оновити треба mysql
    isDiscount: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isBestseller: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isNovetly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    isHit: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    isFreeDelivery: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    views: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isShow: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    isForMan: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: null }, //якщо null то унісекс
    isFeed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }, //щойно добавив, тре команду щоб добавити у mysql
    nameTypeuk: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Об'єм",
    },
    nameTyperu: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Объем',
    },
    product_type_uk: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    product_type_ru: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'goods',
  }
);

Brends.hasMany(Goods);
Goods.belongsTo(Brends);

Category.hasMany(Goods);
Goods.belongsTo(Category);

CountryMade.hasMany(Goods);
Goods.belongsTo(CountryMade);

Subcategory.hasMany(Goods);
Goods.belongsTo(Subcategory);

const Volume = sequelize.define('volume', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nameVolume: { type: DataTypes.STRING, allowNull: false, defaultValue: 'мл' },
  volume: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  discount: { type: DataTypes.FLOAT, allowNull: false },
  priceWithDiscount: { type: DataTypes.FLOAT, allowNull: false },
  metaTitleuk: {
    type: DataTypes.STRING,
  },
  metaDescriptionuk: {
    type: DataTypes.TEXT,
  },
  canonicaluk: {
    type: DataTypes.STRING, // або NULLABLE
  },
  metaTitleru: {
    type: DataTypes.STRING,
  },
  metaDescriptionru: {
    type: DataTypes.TEXT,
  },
  canonicalru: {
    type: DataTypes.STRING, // або NULLABLE
  },
  isAvailability: {
    type: DataTypes.ENUM('inStock', 'notAvailable ', 'customMade'),
    defaultValue: 'inStock',
  },
  sort: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: false,
  },
  isFreeDelivery: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  art: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  gtin: { type: DataTypes.STRING, allowNull: true },
});

Goods.hasMany(Volume);
Volume.belongsTo(Goods);

const Img = sequelize.define('img', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  img: { type: DataTypes.STRING, allowNull: false },
  volumeuk: { type: DataTypes.STRING, allowNull: false },
  volumeru: { type: DataTypes.STRING, allowNull: false },
});

Volume.hasMany(Img);
Img.belongsTo(Volume);

const ProductCategoryFilter = sequelize.define('productCategoryFilter', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  valueuk: { type: DataTypes.STRING, allowNull: false },
  valueru: { type: DataTypes.STRING, allowNull: false },
});

FilterCategory.hasMany(ProductCategoryFilter);
ProductCategoryFilter.belongsTo(FilterCategory);

Goods.hasMany(ProductCategoryFilter);
ProductCategoryFilter.belongsTo(Goods);

const Users = sequelize.define('users', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  surname: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  middleName: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  phone: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  latestActivity: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('NOW'),
  },
  adminAccess: {
    type: DataTypes.ENUM('user', 'admin', 'owner'),
    allowNull: false,
    defaultValue: 'user',
  },
  passwordUpdatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.fn('NOW'),
  },
});

const PersonalDate = sequelize.define('personal', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  lastName: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  deliveryType: { type: DataTypes.STRING, allowNull: false },
  novaPoshtaApartment: { type: DataTypes.STRING, allowNull: false },
  novaPoshtaBuilding: { type: DataTypes.STRING, allowNull: true },
  novaPoshtaCityName: { type: DataTypes.STRING, allowNull: true },
  novaPoshtaCityRef: { type: DataTypes.STRING, allowNull: true },
  novaPoshtaStreet: { type: DataTypes.STRING, allowNull: true },
  novaPoshtaWarehouseName: { type: DataTypes.STRING, allowNull: true },
  novaPoshtaWarehouseRef: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: false },
  ukrPoshtaCity: { type: DataTypes.STRING, allowNull: true },
  ukrPoshtaDepartment: { type: DataTypes.STRING, allowNull: true },
  ukrPoshtaRegion: { type: DataTypes.STRING, allowNull: true },
});

Users.hasMany(PersonalDate);
PersonalDate.belongsTo(Users);

const Order = sequelize.define('order', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nameUser: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  contactInfo: { type: DataTypes.TEXT, allowNull: false },
  sum: { type: DataTypes.FLOAT, allowNull: false },
  basket: { type: DataTypes.TEXT, allowNull: false },
  status: {
    type: DataTypes.ENUM('wait', 'check', 'pay', 'nalozhen', 'finish', 'cansel'),
    allowNull: false,
    defaultValue: 'wait',
  },
  isToMeneger: { type: DataTypes.BOOLEAN, defaultValue: false },
  procent: { type: DataTypes.INTEGER, allowNull: 0 },
  phone: { type: DataTypes.STRING, allowNull: false },
  deliveryType: { type: DataTypes.STRING, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
  commentMeneger: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
  oblast: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
  typePay: { type: DataTypes.STRING, allowNull: false },
});

Users.hasMany(Order);
Order.belongsTo(Users);

const GoodsViews = sequelize.define('goodsViews', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

Goods.hasMany(GoodsViews);
GoodsViews.belongsTo(Goods);

const Linia = sequelize.define(
  'linia',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, unique: true, allowNull: false },
  },
  {
    tableName: 'linia',
  }
);

Linia.hasMany(Goods, { foreignKey: 'liniaId' });
Goods.belongsTo(Linia, { foreignKey: 'liniaId' });

const Recognition = sequelize.define('recognition', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nameuk: { type: DataTypes.STRING, allowNull: false },
  nameru: { type: DataTypes.STRING, allowNull: false },
  categoryId: { type: DataTypes.INTEGER, allowNull: true },
});

Category.hasMany(Recognition);
Recognition.belongsTo(Category, { foreignKey: 'categoryId' });

const ProductRecognition = sequelize.define('productRecognition', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

Recognition.hasMany(ProductRecognition);
ProductRecognition.belongsTo(Recognition);
Goods.hasMany(ProductRecognition);
ProductRecognition.belongsTo(Goods);

const Reviews = sequelize.define('reviews', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nameUser: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  reviewId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'reviews', key: 'id' },
    onDelete: 'CASCADE',
  },
  goodsId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'goods', key: 'id' },
    onDelete: 'CASCADE',
  },
  isShow: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  }, //щойно добавив
});

Users.hasMany(Reviews, { foreignKey: 'userId' });
Reviews.belongsTo(Users, { foreignKey: 'userId' });

Reviews.hasMany(Reviews, { as: 'Replies', foreignKey: 'reviewId' });
Reviews.belongsTo(Reviews, { as: 'Parent', foreignKey: 'reviewId' });
Goods.hasMany(Reviews, { foreignKey: 'goodsId' });
Reviews.belongsTo(Goods, { foreignKey: 'goodsId' });

const ReviewImg = sequelize.define('reviewImg', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  img: { type: DataTypes.STRING, allowNull: false },
  reviewId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'reviews', key: 'id' },
    onDelete: 'CASCADE',
  },
});

Reviews.hasMany(ReviewImg, { foreignKey: 'reviewId' });
ReviewImg.belongsTo(Reviews, { foreignKey: 'reviewId' });

const Blog = sequelize.define('Blog', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  img: { type: DataTypes.STRING, allowNull: false },
  url: { type: DataTypes.STRING, allowNull: false, unique: true },
  nameuk: { type: DataTypes.STRING, allowNull: false },
  nameru: { type: DataTypes.STRING, allowNull: false },
  descriptionuk: { type: DataTypes.TEXT('long'), allowNull: false },
  descriptionru: { type: DataTypes.TEXT('long'), allowNull: false },
  views: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});

const Baners = sequelize.define('Baners', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  mobileImg_uk: { type: DataTypes.STRING, allowNull: false },
  pcImg_uk: { type: DataTypes.STRING, allowNull: false },
  mobileImg_ru: { type: DataTypes.STRING, allowNull: false },
  pcImg_ru: { type: DataTypes.STRING, allowNull: false },
  href: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  sort: { type: DataTypes.INTEGER, allowNull: false },
});

module.exports = {
  Brends,
  CountryMade,
  Category,
  FilterCategory,
  Subcategory,
  Goods,
  Volume,
  Img,
  ProductCategoryFilter,
  Users,
  PersonalDate,
  Order,
  GoodsViews,
  Linia,
  Recognition,
  ProductRecognition,
  Reviews,
  ReviewImg,
  Blog,
  Baners,
};
