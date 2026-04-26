const router = require('express')();
const PromokodsController = require('../Controllers/PromokodsController');
const IsAdminMiddleWare = require('../middleWare/IsAdminMiddleWare');
const IsAuthMiddleWare = require('../middleWare/IsAuthMiddleWare');

router.post('/add', IsAdminMiddleWare, PromokodsController.Add);
router.get('/get', IsAdminMiddleWare, PromokodsController.Get);
router.get('/checkPromokod', IsAuthMiddleWare, PromokodsController.Check);
router.get('/getMy', IsAuthMiddleWare, PromokodsController.GetMyPromokods);
router.get('/checkPromokodNoAuth', PromokodsController.CheckNoAuth);

module.exports = router;
