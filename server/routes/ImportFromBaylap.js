const ImportFromBaylap = require('../Controllers/ImportFromBaylap');
const IsFromBaylap = require('../middleWare/IsFromBaylap');

const router = require('express')();

router.post('/', IsFromBaylap, ImportFromBaylap.AddGoods);

module.exports = router;
