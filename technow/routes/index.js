const express = require('express');
const {
  getAllPostsView,
  getAllProductsView,
  productDetailsView,
  postDetailsView
} = require('../controllers/index');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/allPosts', getAllPostsView)
router.get('/post-details/:id', postDetailsView)

router.get('/allProducts', getAllProductsView)
router.get('/product-details/:id', productDetailsView)

module.exports = router;
