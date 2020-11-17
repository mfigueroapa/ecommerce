const express = require("express");
const router = express.Router();

const fileUploader = require('../config/cloudinary')
const Post = require('../models/Post')
const Product = require('../models/Product')
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
router.get('/products', isAuth, getPostsView)


router.get('/create-product', isAuth, createProductView)
router.post('/create-productt', isAuth, fileUploader.single('image'), createProductProcess)
router.get('/edit-product/:id', isAuth,editProductView)
router.post('/edit-product/:id', isAuth, fileUploader.single('image'), editProductProecess)
router.get('/delete-product/:id', isAuth, deleteProduct) //delete confirmation popup pending
router.get('/posts', isAuth, getProductsView)


module.exports = router