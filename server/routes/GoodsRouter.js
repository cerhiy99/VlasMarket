const router = require('express')();
const GoodsControllers = require('../Controllers/GoodsControllers');
const IsAdminMiddleWare = require('../middleWare/IsAdminMiddleWare');

router.post('/add', IsAdminMiddleWare, GoodsControllers.Add);
router.get('/get', GoodsControllers.GetGoods);
router.get('/getFodId', GoodsControllers.GetOne);
router.put('/update/:id', IsAdminMiddleWare, GoodsControllers.Update);
router.get('/getForVolumeId/:idVolume', GoodsControllers.GetForIdVolume);
router.post('/setView', GoodsControllers.SetView);
router.post('/del/:id', IsAdminMiddleWare, GoodsControllers.Del);
router.post('/mass-delete', IsAdminMiddleWare, GoodsControllers.MassDelete);
router.post('/mass-hide', IsAdminMiddleWare, GoodsControllers.MassHide);
router.post('/mass-show', IsAdminMiddleWare, GoodsControllers.MassShow);
router.get('/get-views', IsAdminMiddleWare, GoodsControllers.GetView);
router.post(
  '/addRecognition',
  IsAdminMiddleWare,
  GoodsControllers.AddRecognitions
);
router.get(
  '/getRecognition',
  IsAdminMiddleWare,
  GoodsControllers.GetRecognitions
);
router.get(
  '/getRecognitionForCategory',
  GoodsControllers.GetRecognitionsForCategory
);
router.post(
  '/editRecognition',
  IsAdminMiddleWare,
  GoodsControllers.EditRecognitions
);
router.post('/addLinia', IsAdminMiddleWare, GoodsControllers.AddLine);
router.get('/getLinia', IsAdminMiddleWare, GoodsControllers.GetLine);
router.get('/GetForBasketOrLike', GoodsControllers.GetForBasketOrLike);
router.get('/getForSiteMapCatalog', GoodsControllers.GetForSiteMapCatalog);
router.get('/getForSiteMapCategory', GoodsControllers.GetCategoryForSiteMap);
router.get(
  '/getSubcategoryForSiteMap',
  GoodsControllers.GetSubcategoryForSiteMap
);
router.get('/getBrendsForSitemap', GoodsControllers.GetBrendsForSitemap);
router.get('/getDiscountFromSitemap', GoodsControllers.GetDiscountFromSitemap);
router.get(
  '/getSelectGoodsForSitemap',
  GoodsControllers.GetSelectGoodsForSitemap
);
router.get(
  '/getSelectGoodsForSitemapWithImg',
  GoodsControllers.GetSelectGoodsForSitemapWithImg
);
router.get('/getMiniGoods', GoodsControllers.GetMiniGoods);
router.post('/editLine/:idLine', IsAdminMiddleWare, GoodsControllers.EditLine);
router.post('/delLine/:idLine', IsAdminMiddleWare, GoodsControllers.DelLine);
router.get('/getForVolumeMini/:art', GoodsControllers.GetForVolumeMini);
router.post(
  '/setDiscountToBrend',
  IsAdminMiddleWare,
  GoodsControllers.SetDiscountToBrend
);
router.patch('/setDiscount', IsAdminMiddleWare, GoodsControllers.SetDiscount);
router.patch('/updatePrice', IsAdminMiddleWare, GoodsControllers.UpdatePrice);
router.patch(
  '/updatePriceGrn',
  IsAdminMiddleWare,
  GoodsControllers.UpdatePriceGRN
);

module.exports = router;
