const express = require("express");
const router = express.Router();

const fileUploader = require('../config/cloudinary')
const Comment = require('../models/Comment')
const Product = require('../models/Product')
const User = require('../models/User')
const ItemCart = require('../models/ItemCart')
const mongoose = require('mongoose')


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

router.get('/cart', (req, res) => {
  res.render('user/cart')
})

router.post('/add-to-cart/:id', async (req, res) => {
  console.log(req.user._id)
  const {
    id
  } = req.params
  console.log(id)
  const userId = req.user._id
  console.log(`userid: ${userId}`)
  // let user = await User.findById(req.session.passport.user)
  // await User.updateOne(
  //   {_id: user},
  //   {$addToSet: {itemCart: [id]}}
  // )
  // const itemCart = await User.find({_id: user}, 'itemCart').populate()
  // console.log("==============")


  //intentamos asignar a itemCart un itemcart que tenga en buyer id del usuario en sesion
  let itemCart = await ItemCart.findOne({
    buyer: userId
  })
  console.log(typeof itemCart)
  console.log(`itemCart: ${itemCart}`)
  //asignamos a product el producto buscandolo con el id que recibimos en params
  let product = await Product.findById(id)
  console.log(`product: ${product}`)
  //buscamos si ya existe un ironCart con el id del user que esta en sesion, si ya, updateamos 
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
    //si no entre el return previo, entonces no existia y lo creamos
    const cart = await ItemCart.create({
      items: id,
      totalPrice: product.price,
      buyer: userId
    })
    res.redirect('/cart')
  }

})


module.exports = router