const express = require("express");
const router = express.Router();

const fileUploader = require('../config/cloudinary')
const Post = require('../models/Post')
const Product = require('../models/Product')
const mongoose = require('mongoose')


const {
  isAuth
} = require("../middlewares");

const {profileView, createPostView, createPostProcess, editPostView, editPostProcess, createProductView, createProductProcess, getProductsView, getPostsView} = require('../controllers/user')

router.get('/profile', profileView)
// router.get('/profile', (req, res) => {
//   res.render('user/profile')
// })

router.get('/create-post', isAuth, createPostView)
// router.get('/create-post', isAuth, (req, res) => {
//   res.render('user/create-post')
// })


// router.post('/create-post', fileUploader.single('image'), routeGuard, async (req, res) => {
router.post('/create-postt', fileUploader.single('image'), createPostProcess)
// router.post('/create-postt', fileUploader.single('image'), async (req, res) => {
//   const {
//     name,
//     content
//   } = req.body

//   let imagePath = req.file.path;
//   await Post.create({
//     name,
//     content,
//     creator: req.session.passport.user,
//     imagePath,
//   })
//   res.redirect('/posts');
// });

router.get('/posts', isAuth, getPostsView)
// router.get('/posts', isAuth, async (req, res) => {

//   const user = req.session.passport.user
//   // console.log(user)
//   const posts = await Post.find({
//     creator: mongoose.Types.ObjectId(user)
//   })
//   // console.log(posts)
//   res.render('user/posts', {
//     posts
//   })
// })

router.get('/edit-post/:id', isAuth, editPostView)

// router.get('/edit-post/:id', isAuth, async (req, res) => {
//   const {
//     id
//   } = req.params
//   const post = await Post.findById(id)
//   res.render('user/edit-post', post)
// })


router.post('/edit-post/:id', isAuth, fileUploader.single('image'), editPostProcess)
// router.post('/edit-post/:id', isAuth, fileUploader.single('image'), async (req, res) => {
//   const {
//     id
//   } = req.params
//   const {
//     name,
//     content
//   } = req.body
//   let imagePath
//   if (req.file) {
//     imagePath = req.file.path
//   } else {
//     imagePath = req.body.existingImage
//   }
//   await Post.findByIdAndUpdate(id, {
//     name,
//     content,
//     imagePath
//   })
//   res.redirect('/posts')
// })

router.get('/create-product', isAuth, createProductView)
// router.get('/create-product', isAuth, (req, res) => {
//   console.log('get de createproduct')
//   res.render('user/create-product')
// })
router.post('/create-productt', fileUploader.single('image'), createProductProcess)
// router.post('/create-productt', fileUploader.single('image'), async (req, res) => {
//   const {
//     name,
//     description,
//     price
//   } = req.body
//   let imagePath = req.file.path
//   console.log(name, description, price, imagePath)
//   await Product.create({
//     name,
//     description,
//     owner: req.session.passport.user,
//     price,
//     imagePath
//   })
//   res.redirect('/products')
// })


router.get('/products', getProductsView)
// router.get('/products', async (req, res) => {
//   const products = await Product.find()//falta
//   res.render('user/products', {products})
// })

module.exports = router