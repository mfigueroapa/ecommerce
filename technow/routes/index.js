const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/posts/posts', (req, res) => {
  res.render('posts/posts')
})
router.get('/products/products', (req, res) => {
  res.render('products/products')
})

module.exports = router;
