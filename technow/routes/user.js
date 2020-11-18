const express = require("express");
const router = express.Router();

const fileUploader = require('../config/cloudinary')
const Comment = require('../models/Comment')
const Product = require('../models/Product')
const ItemCart = require('../models/ItemCart')
const mongoose = require('mongoose')
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
  deleteProduct
} = require('../controllers/user')

router.get('/profile', isAuth, profileView)

router.get('/create-post', isAuth, createPostView)
router.post('/create-postt', isAuth, fileUploader.single('image'), createPostProcess)
router.get('/edit-post/:id', isAuth, editPostView)
router.post('/edit-post/:id', isAuth, fileUploader.single('image'), editPostProcess)
router.get('/delete-post/:id', deletePost) //delette confirmation popup pending
router.get('/posts', isAuth, getPostsView)


router.get('/create-product', isAuth, createProductView)
router.post('/create-productt', isAuth, fileUploader.single('image'), createProductProcess)
router.get('/edit-product/:id', isAuth, editProductView)
router.post('/edit-product/:id', isAuth, fileUploader.single('image'), editProductProecess)
router.get('/delete-product/:id', isAuth, deleteProduct) //delete confirmation popup pending
router.get('/products', isAuth, getProductsView)

router.post('/create-comment', async (req, res) => {
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


router.get('/cart', async (req, res) => {
  const itemCart = await ItemCart.findOne({buyer: req.user._id}).populate('items')
  const items = itemCart.items
  console.log("items" + items)
  res.render('user/cart', {items})
  // try {
  //   let preference = {
  //     items: [{
  //       title: 'Mi producto',
  //       unit_price: 100,
  //       quantity: 1
  //     }],
  //     notification_url: "https://webhook.site/88151d93-fd67-40d5-87f1-46b71cf8cae8"
  //   }

  //   const {
  //     body
  //   } = await mercadopago.preferences.create(preference)
  //   // const id = body.id;
  //   // console.log("id: " + id)
  //   res.render('user/cart', {
  //     items
  //   })
  // }catch(err) {
  //   console.log("catch Err: "+ err)
  // }

  
})

router.post('/add-to-cart/:id', async (req, res) => {
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



// exports.itemDetails = async (req, res) => {
router.get('/checkout', async (req, res) => {
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


// const userId = req.user._id
// const itemCart = await ItemCart.findOne({buyer: userId}).populate('items')
// const items = itemCart.items
// console.log("itemCart "+itemCart)

// //  const itemCart1 = await ItemCart.findById(req.user._id)
//  const itemCart1 = await ItemCart.findById(itemCart._id)
//  console.log("itemCart1 "+itemCart1)
//  // Generamos la preferencia que describe el elemento que mercadopago va a procesar
//  const preference = {
//    items: [{
//      title: itemCart1.items.name,
//      // unit_price: Number(item.price / 100),
//      unit_price: Number(10),
//      currency_id: 'USD',
//      quantity: 1
//    }],
//    notification_url: 'https://webhook.site/88151d93-fd67-40d5-87f1-46b71cf8cae8'
//  }
//  // MP nos ayuda a generar el token que identifica a la transaccion de este producto para enviarlo al checkout pro
//  const response = await mercadopago.preferences.create(preference)
//  itemCart1.formatedPrice = `$${(itemCart.price/100).toFixed(2)} USD`
//  itemCart1.prefenceId = response.body.id
//  res.render('user/cart', itemCart1)