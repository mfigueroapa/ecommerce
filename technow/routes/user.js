const express = require("express");
const router = express.Router();

const fileUploader = require('../config/cloudinary')
const Product = require('../models/Product')
const ItemCart = require('../models/ItemCart')
const mongoose = require('mongoose')
const Comment = require('../models/Comment')
const mercadopago = require('../config/mercadopago')

const {
  isAuth
} = require("../middlewares/index");
const {
  isAuthProductsView
} = require('../middlewares/productsViewAuth')
const {
  isAuthPostsView
} = require('../middlewares/postsViewAuth')

const {
  profileView,
  createPostView,
  createPostProcess,
  editPostView,
  editPostProcess,
  createProductView,
  createProductProcess,
  getProductsView,
  getPostsView,
  deletePost,
  editProductView,
  editProductProecess,
  deleteProduct,
  createCommentProcess,
  createItemCartPreferenceProcess,
  itemCartView
} = require('../controllers/user')

router.get('/profile', isAuth, profileView)

router.get('/create-post', isAuth, createPostView)
router.post('/create-postt', isAuth, fileUploader.single('image'), createPostProcess)
router.get('/edit-post/:id', isAuth, editPostView)
router.post('/edit-post/:id', isAuth, fileUploader.single('image'), editPostProcess)
router.get('/delete-post/:id', isAuth, deletePost) 
router.get('/posts', isAuth, getPostsView)

router.get('/create-product', isAuth, createProductView)
router.post('/create-productt', isAuth, fileUploader.single('image'), createProductProcess)
router.get('/edit-product/:id', isAuth, editProductView)
router.post('/edit-product/:id', isAuth, fileUploader.single('image'), editProductProecess)
router.get('/delete-product/:id', isAuth, deleteProduct) 
router.get('/products', isAuth, getProductsView)

router.post('/create-comment', isAuth, async (req, res) => {
  const {
    content,
    postId
  } = req.body
  console.log("content!: " + content)
  await Comment.create({
    content,
    owner: req.session.passport.user,
    post: postId
  })
})

router.get('/cart/:itemCartId', isAuth, async (req, res) => {
  const itemCart = await ItemCart.findById(req.params.itemCartId).populate('items')
  const itemsArr = itemCart.items
  let itemsArrPreference = []
  itemsArr.forEach(item => {
    itemsArrPreference.push({
      title: item.name,
      unit_price: item.price,
      currency_id: 'USD',
      quantity: 1
    })
  })
  const preference = {
    items: itemsArrPreference,
    notification_url: 'https://webhook.site/88151d93-fd67-40d5-87f1-46b71cf8cae8'
  }
  const response = await mercadopago.preferences.create(preference)
  itemCart.preferenceId = response.body.id
  console.log(itemCart.preferenceId)
  res.render('user/buycart', {itemCart,itemsArrPreference})
})

router.get('/cart', isAuth, async (req, res) => {
  const itemCart = await ItemCart.findOne({buyer: req.user._id}).populate('items')
  const items = itemCart.items
  res.render('user/cart', {itemCart, items})
})

router.get('/purchase', (req, res) => {
  res.render('user/after-purchase')
})

router.post('/purchase', (req, res) => {
  res.redirect('/purchase')
})

router.get('/cart/delete/:id', isAuth, async (req, res) => {
  const {id} = req.params
  console.log("product ID:"+id)
  let itemCart = await ItemCart.findOne({
    buyer: req.user._id
  })
  let product = await Product.findById(id)
  console.log("product: "+product)
  await ItemCart.findOneAndUpdate({
    buyer: req.user._id
  }, {
    $pull: {
      items: id
    },
    totalPrice: itemCart.totalPrice -= product.price,
  }, {
    new: true
  })
  res.redirect('/cart')
})

router.post('/add-to-cart/:id', isAuth, async (req, res) => {
  const {
    id
  } = req.params
  const userId = req.user._id
  let itemCart = await ItemCart.findOne({
    buyer: userId
  })
  let product = await Product.findById(id)
  console.log(`product: ${product}`)
  if (itemCart) {
    await ItemCart.findOneAndUpdate({
      buyer: userId
    }, {
      $push: {
        items: id
      },
      totalPrice: itemCart.totalPrice += product.price,
    }, {
      new: true
    })
    return res.redirect('/cart')
  } else {
    const cart = await ItemCart.create({
      items: id,
      totalPrice: product.price,
      buyer: userId
    })
    res.redirect('/cart')
  }
})

router.get('/checkout', isAuth, async (req, res) => {
  const itemCart = await ItemCart.findById(req.user._id)
  // Generamos la preferencia que describe el elemento que mercadopago va a procesar
  const preference = {
    items: [{
      title: itemCart.items.name,
      // unit_price: Number(item.price / 100),
      unit_price: Number(itemCart.items.price),
      currency_id: 'USD',
      quantity: 1
    }],
    notification_url: 'https://webhook.site/88151d93-fd67-40d5-87f1-46b71cf8cae8'
  }
  // MP nos ayuda a generar el token que identifica a la transaccion de este producto para enviarlo al checkout pro
  const response = await mercadopago.preferences.create(preference)
  itemCart.formatedPrice = `$${(itemCart.price/100).toFixed(2)} USD`
  itemCart.prefenceId = response.body.id
  res.render('user/cart', itemCart)
})

module.exports = router

