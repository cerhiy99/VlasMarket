const router = require('express')();
const CategoryController = require('../Controllers/CategoryController');
const IsAdminMiddleWare = require('../middleWare/IsAdminMiddleWare');

router.post('/add', IsAdminMiddleWare, CategoryController.Add);
router.get('/get', CategoryController.Get);
router.get('/getFull', CategoryController.GetFull);
router.post('/update/:id', IsAdminMiddleWare, CategoryController.Update);
router.get(
  '/getCategoryAndSubcategoryWithProduct',
  CategoryController.GetCategoryAndSubcategoryWithProduct,
);

module.exports = router;
