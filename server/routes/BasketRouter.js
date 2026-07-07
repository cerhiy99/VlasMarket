const router = require('express')();
const BasketController = require('../Controllers/BasketController');
const IsAdminMiddleWare = require('../middleWare/IsAdminMiddleWare');

router.post('/', BasketController.AddOrCreateBasket);
router.get('/', IsAdminMiddleWare, BasketController.Get);

module.exports = router;
