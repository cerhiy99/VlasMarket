const router = require('express')();
const BrednController = require('../Controllers/BrendsController');
const IsAdminMiddleWare = require('../middleWare/IsAdminMiddleWare');

router.post('/add', IsAdminMiddleWare, BrednController.Add);
router.get('/getForLetter', BrednController.GetForLetter);
router.get('/getFirst', BrednController.GetFirstLetters);
router.get('/get', BrednController.Get);
router.get('/getForListBrends', BrednController.GetForListBrends);
router.post('/update/:id', IsAdminMiddleWare, BrednController.Update);

module.exports = router;
