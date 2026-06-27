const SubcategoryController = require('../Controllers/SubcategoryController');
const IsAdminMiddleWare = require('../middleWare/IsAdminMiddleWare');

const router = require('express')();

router.post('/add', IsAdminMiddleWare, SubcategoryController.Add);
router.get('/get', SubcategoryController.Get);
router.put('/update/:id', IsAdminMiddleWare, SubcategoryController.Update);
router.patch('/reorder', IsAdminMiddleWare, SubcategoryController.ReOrder);
router.patch('/:id', IsAdminMiddleWare, SubcategoryController.Patch);

module.exports = router;
