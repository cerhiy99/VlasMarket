const router = require('express')();
const BanersController = require('../Controllers/BanersController');
const IsAdminMiddleWare = require('../middleWare/IsAdminMiddleWare');

router.post('/add', IsAdminMiddleWare, BanersController.Add);
router.get('/get', BanersController.Get);
router.put('/update', IsAdminMiddleWare, BanersController.Update);
router.delete('/delete', IsAdminMiddleWare, BanersController.Delete);

module.exports = router;
