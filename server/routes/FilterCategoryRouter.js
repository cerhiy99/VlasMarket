const router=require('express')();
const FilterCategoryColtrollers = require('../Controllers/FilterCategoryControllers');
const IsAdminMiddleWare=require('../middleWare/IsAdminMiddleWare')

router.post(
    '/addCategoryFilter',
    IsAdminMiddleWare,
    FilterCategoryColtrollers.AddCategoryFilter
  );
router.get('/getCategoryFilter', FilterCategoryColtrollers.GetFilter);

module.exports=router;