const express = require("express");
const router = express.Router();
const fileUploader = require('../config/cloudinary')

const {
  isAuth
} = require("../middlewares/index");

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
  itemCartView,
  purchaseView,
  mercadopagoPurchaseForm,
  deleteItemCartProcess,
  addItemToCartProcess
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

router.post('/create-comment', isAuth, createCommentProcess)

router.get('/cart/:itemCartId', isAuth, createItemCartPreferenceProcess)
router.get('/cart', isAuth, itemCartView)
router.get('/purchase', purchaseView)
router.post('/purchase', mercadopagoPurchaseForm)
router.get('/cart/delete/:id', isAuth, deleteItemCartProcess)
router.post('/add-to-cart/:id', isAuth, addItemToCartProcess)

module.exports = router

