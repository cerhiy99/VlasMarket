const router = require('express')();
const BasketController = require('../Controllers/BasketController');
const IsAdminMiddleWare = require('../middleWare/IsAdminMiddleWare');

router.post('/', BasketController.AddOrCreateBasket);
router.get('/', IsAdminMiddleWare, BasketController.Get);
router.delete('/:id', IsAdminMiddleWare, BasketController.Delete);

module.exports = router;
