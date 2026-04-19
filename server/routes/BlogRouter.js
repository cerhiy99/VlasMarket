const router = require('express')();
const IsAdminMiddleWare = require('../middleWare/IsAdminMiddleWare');
const BlogController = require('../Controllers/BlogControllers');

router.post('/add', IsAdminMiddleWare, BlogController.AddBlog);
router.get('/get', BlogController.Get);
router.get('/getOne/:url', BlogController.GetOne);
router.post('/update/:url', IsAdminMiddleWare, BlogController.Update);
router.get('/getForSiteMap', BlogController.GetPagesBlogFromSiteMap);
router.get('/getBlogForSiteMap', BlogController.GetSelectBlogFromSiteMap);
router.post('/del/:id', IsAdminMiddleWare, BlogController.Del);

module.exports = router;
