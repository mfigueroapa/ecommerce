const express = require('express');
const {
  getAllPostsView,
  getAllProductsView,
  productDetailsView,
  postDetailsView
} = require('../controllers/index');
const {
  isAuthAllViews
} = require("../middlewares/index");
const Product = require('../models/Product');
const router = express.Router();

/* GET home page */
router.get('/', async (req, res) => {
  const products = await Product.find().populate('owner')
  const carProducts = [products[0], products[1], products[2]]
  try {
    const user = req.user._id
    if (user) {
      console.log(user)
      res.render('index', {
        user,
        products,
        carProducts
      })
    }
    return
  } catch {}
  res.render('index', {
    products,
    carProducts
  });
});

router.get('/allPosts', isAuthAllViews, getAllPostsView)
router.get('/post-details/:id', isAuthAllViews, postDetailsView)

router.get('/allProducts', isAuthAllViews, getAllProductsView)
router.get('/product-details/:id', isAuthAllViews, productDetailsView)

module.exports = router;