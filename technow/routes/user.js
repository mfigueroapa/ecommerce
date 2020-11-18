const express = require("express");
const router = express.Router();

const fileUploader = require('../config/cloudinary')
const Comment = require('../models/Comment')
const Product = require('../models/Product')
const User = require('../models/User')
const mongoose = require('mongoose')


const {
  isAuth
} = require("../middlewares/index");
const { isAuthProductsView } = require ('../middlewares/productsViewAuth')
const {isAuthPostsView} = require ('../middlewares/postsViewAuth')

const {profileView, createPostView, createPostProcess, editPostView, editPostProcess, createProductView, createProductProcess, getProductsView, getPostsView, deletePost, editProductView, editProductProecess, deleteProduct} = require('../controllers/user')

router.get('/profile', isAuth,profileView)

router.get('/create-post', isAuth, createPostView)
router.post('/create-postt', isAuth, fileUploader.single('image'), createPostProcess)
router.get('/edit-post/:id', isAuth, editPostView)
router.post('/edit-post/:id', isAuth, fileUploader.single('image'), editPostProcess)
router.get('/delete-post/:id', deletePost)//delette confirmation popup pending
router.get('/posts', isAuth, getPostsView)


router.get('/create-product', isAuth, createProductView)
router.post('/create-productt', isAuth, fileUploader.single('image'), createProductProcess)
router.get('/edit-product/:id', isAuth,editProductView)
router.post('/edit-product/:id', isAuth, fileUploader.single('image'), editProductProecess)
router.get('/delete-product/:id', isAuth, deleteProduct) //delete confirmation popup pending
router.get('/products', isAuth, getProductsView)

router.post('/create-comment',async (req, res) => {
  const {content, postId} = req.body
  console.log("content!: "+content)
  await Comment.create({
    content,
    owner: req.session.passport.user,
    post: postId
  })
})

router.get('/cart', (req, res)=> {
  res.render('user/cart')
})

router.post('/add-to-cart/:id',  async(req, res) => {
  const {id} = req.params
  const userId = req.session.passport.user
  let user = await User.findById(req.session.passport.user)
  await User.updateOne(
    {_id: user},
    {$addToSet: {itemCart: [id]}}
  )
  const itemCart = await User.find({_id: user}, 'itemCart').populate()
  console.log("==============")
  // console.log(itemCart)
  res.render('user/cart',{itemCart})
})


module.exports = router