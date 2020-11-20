const express = require('express');
const router = express.Router();
const {
  getAllPostsView,
  getAllProductsView,
  productDetailsView,
  postDetailsView,
  homeView
} = require('../controllers');
const {
  isAuthAllViews
} = require("../middlewares");

router.get('/', homeView)
router.get('/allPosts', isAuthAllViews, getAllPostsView)
router.get('/post-details/:id', isAuthAllViews, postDetailsView)
router.get('/allProducts', isAuthAllViews, getAllProductsView)
router.get('/product-details/:id', isAuthAllViews, productDetailsView)

module.exports = router;