const { Op } = require("sequelize");
const ErrorApi = require("../error/ErrorApi");
const { FilterCategory } = require("../models/models");

class FilterCategoryColtrollers{
  static AddCategoryFilter = async (req, resp, next) => {
    try {
      let { nameuk, nameru, categoryId } = req.body;
      categoryId = parseInt(categoryId);
      const res = await FilterCategory.create({
        nameuk,
        nameru,
        categoryId: categoryId,
      });
      return resp.json({ res });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
  static GetFilter = async (req, resp, next) => {
    try {
      const { categoryId } = req.query;
      const res = await FilterCategory.findAll({
        where: { categoryId: parseInt(categoryId) },
      });
      return resp.json({ res });
    } catch (err) {
      return next(ErrorApi.badRequest(err));
    }
  };
}

module.exports=FilterCategoryColtrollers;