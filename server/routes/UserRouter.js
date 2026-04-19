const UserController = require('../Controllers/UserController');
const IsAdminMiddleWare = require('../middleWare/IsAdminMiddleWare');
const IsAuthMiddleWare = require('../middleWare/IsAuthMiddleWare');
const router = require('express')();

router.post('/register', UserController.Register);
router.post('/login', UserController.Login);
router.post('/active', IsAuthMiddleWare, UserController.Active);
router.get('/getUsers', IsAdminMiddleWare, UserController.GetUsers);
router.post('/setPeronal', IsAuthMiddleWare, UserController.setPersonalDate);
router.get('/getPersonal', IsAuthMiddleWare, UserController.getPersonal);
router.get('/getDiscountAndOrders', IsAuthMiddleWare, UserController.getPersonalDiscountAndOrders);
router.get('/getPersonalDiscount', IsAuthMiddleWare, UserController.getPersonalDiscount);
router.post('/forgotPassword', UserController.ForgotPassword);
router.post('/reset-password', UserController.ResetPassword);
router.get('/repearOrder/:orderId', UserController.RepeatOrder);

module.exports = router;

