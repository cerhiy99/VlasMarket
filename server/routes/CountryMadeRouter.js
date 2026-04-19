const router=require('express')();
const CountryMadeController = require('../Controllers/CountryMadeController');
const IsAdminMiddleWare=require('../middleWare/IsAdminMiddleWare')

router.post(
    '/addCountryMade',
    IsAdminMiddleWare,
    CountryMadeController.AddCountryMade
  );
router.get('/getCountryMade', CountryMadeController.GetCountryMade);

module.exports=router;