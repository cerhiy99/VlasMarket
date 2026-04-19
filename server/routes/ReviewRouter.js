const ReviewController = require('../Controllers/ReviewController');
const IsAdminMiddleWare = require('../middleWare/IsAdminMiddleWare');
const IsAuthMiddleWare = require('../middleWare/IsAuthMiddleWare');

const router = require('express')();

router.post('/startWriteComment', IsAuthMiddleWare, ReviewController.StartWriteCaptcha);
router.post('/sendReview', IsAuthMiddleWare, ReviewController.CheckCaptchaAndSaveReview);
router.get('/getAllReviews', IsAdminMiddleWare, ReviewController.GetAllReviews);
router.post('/updateStatus', IsAdminMiddleWare, ReviewController.UpdateStatus);
router.get('/getMyReview', IsAuthMiddleWare, ReviewController.GetMyReview);
router.get('/getMyComment', IsAuthMiddleWare, ReviewController.GetMyComment);
router.post('/deleteMyOrder', IsAuthMiddleWare, ReviewController.DeleteMyOrder);
router.post('/update/:orderId', IsAuthMiddleWare, ReviewController.UpdateMyOrder);

module.exports = router;
