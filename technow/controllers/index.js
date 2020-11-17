
const fileUploader = require('../config/cloudinary')
const Post = require('../models/Post')
const Product = require('../models/Product')
const mongoose = require('mongoose')

exports.getAllPostsView = async (req, res) => {
  const posts = await Post.find().populate('creator')
  res.render('posts/allPosts', {posts})
}

exports.getAllProductsView = async (req, res) => {
  const products = await Product.find().populate('owner')
  res.render('products/allProducts', {products})
}