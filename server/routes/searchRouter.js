const SearchController = require('../Controllers/SearchController');

const router = require('express')();

router.get('/search', SearchController.getSuggestions);

module.exports = router;
