const OrderController = require('../Controllers/OrderController');
const IsAdminMiddleWare = require('../middleWare/IsAdminMiddleWare');
const IsAuthMiddleWare = require('../middleWare/IsAuthMiddleWare');
const IsMenegerMiddleWare = require('../middleWare/IsMenegerMiddleWare');

const router = require('express')();

router.post('/updateOrder/:id', IsMenegerMiddleWare, OrderController.UpdateOrder);

router.post('/fastOrder', OrderController.FastOrder);
router.post('/setOrder', OrderController.SetOrder);
router.post('/sendMessage', OrderController.SendMessage);
router.get('/getOrders', IsMenegerMiddleWare, OrderController.GetOrders);
router.get('/getMyOrders', IsAuthMiddleWare, OrderController.GetMyOrders);
router.get(
  '/getMyOrdersWithPagination',
  IsAuthMiddleWare,
  OrderController.GetMyOrdersWithPagination
);
router.get('/getOrdersMeneger', IsMenegerMiddleWare, OrderController.GetOrdersMeneger);
router.post('/setToMeneger', IsMenegerMiddleWare, OrderController.SetToMeneger);
router.post('/setStatus', IsMenegerMiddleWare, OrderController.SetStatus);
router.get('/getOrder/:id', IsMenegerMiddleWare, OrderController.Getorder);
router.get('/getProductToOrder', IsMenegerMiddleWare, OrderController.GetProductToOrder);
router.post('/adminCreate', IsMenegerMiddleWare, OrderController.AdminCreate);
router.post('/setProcent', IsMenegerMiddleWare, OrderController.SetProcent);
router.get('/getBonus', IsMenegerMiddleWare, OrderController.GetBonus);
router.delete('/del/:id', IsAdminMiddleWare, OrderController.Delete);

module.exports = router;
