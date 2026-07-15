const SyncController = require('../Controllers/SyncController');
const IsAdminMiddleWare = require('../middleWare/IsAdminMiddleWare');

const router = require('express')();

router.post('/', IsAdminMiddleWare, SyncController.Sync);

module.exports = router;
