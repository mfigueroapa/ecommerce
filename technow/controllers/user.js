const fileUploader = require('../config/cloudinary')
const Post = require('../models/Post')
const Product = require('../models/Product')
const mongoose = require('mongoose')
const User = require('../models/User')


exports.profileView = async (req, res) => {
  const user = await User.findById(req.user._id)
  console.log(user)
  res.render('user/profile', {user})
}

exports.createPostView = (req, res) => {
  
  res.render('user/create-post')
}

exports.createPostProcess = async (req, res) => {
  const {
    name,
    content
  } = req.body

  let imagePath = req.file.path;
  await Post.create({
    name,
    content,
    creator: req.session.passport.user,
    imagePath,
  })
  res.redirect('/posts');
}

exports.getPostsView = async (req, res) => {
  console.log("posts")
  const user = req.session.passport.user
  const posts = await Post.find({
    creator: mongoose.Types.ObjectId(user)
  })
  res.render('user/posts', {
    posts
  })
}

exports.editPostView = async (req, res) => {
  const {
    id
  } = req.params
  const post = await Post.findById(id)
  res.render('user/edit-post', post)
}

exports.editPostProcess = async (req, res) => {
  const {
    id
  } = req.params
  const {
    name,
    content
  } = req.body
  let imagePath
  if (req.file) {
    imagePath = req.file.path
  } else {
    imagePath = req.body.existingImage
  }
  await Post.findByIdAndUpdate(id, {
    name,
    content,
    imagePath
  })
  res.redirect('/posts')
}

exports.deletePost = async (req, res) => {
  const {
    id
  } = req.params
  await Post.findByIdAndDelete(id)
  res.redirect('/posts')
}

exports.createProductView = (req, res) => {
  res.render('user/create-product')
}

exports.createProductProcess = async (req, res) => {
  const {
    name,
    description,
    price
  } = req.body
  let imagePath = req.file.path
  console.log(name, description, price, imagePath)
  await Product.create({
    name,
    description,
    owner: req.session.passport.user,
    price,
    imagePath
  })
  res.redirect('/products')
}

exports.editProductView = async (req, res) => {
  const {
    id
  } = req.params
  const product = await Product.findById(id)
  res.render('user/edit-product', product)
}

exports.editProductProecess = async (req, res) => {
  const {
    id
  } = req.params
  const {
    name,
    description,
    price
  } = req.body
  let imagePath
  if (req.file) {
    imagePath = req.file.path
  } else {
    imagePath = req.body.existingImage
  }
  await Product.findByIdAndUpdate(id, {
    name,
    description,
    price,
    imagePath
  })
  res.redirect('/products')
}
exports.deleteProduct = async (req, res)=> {
    const {
      id
    } = req.params
    await Product.findByIdAndDelete(id)
    res.redirect('/products')
}
exports.getProductsView = async (req, res) => {
  const products = await Product.find()
  res.render('user/products', {
    products
  })
}