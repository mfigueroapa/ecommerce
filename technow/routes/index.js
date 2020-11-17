const express = require('express');
const { getAllPostsView, getAllProductsView } = require('../controllers/index');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/allPosts', getAllPostsView)

router.get('/allProducts', getAllProductsView)


module.exports = router;
