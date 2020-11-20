const Post = require('../models/Post')
const Product = require('../models/Product')

exports.homeView = async (req, res) => {
  const products = await Product.find().populate('owner')
  const carProducts = [products[0], products[1], products[2]]
  try {
    const user = req.user._id
    if (user) {
      console.log(user)
      res.render('index', {
        user,
        products,
        carProducts
      })
    }
    return
  } catch {}
  res.render('index', {
    products,
    carProducts
  })
}

exports.getAllPostsView = async (req, res) => {
  const posts = await Post.find().populate('creator')
  res.render('posts/allPosts', {
    posts
  })
}

exports.postDetailsView = async (req, res) => {
  const {
    id
  } = req.params
  const post = await Post.findById(id).populate('creator')
  res.render("posts/post-details", post)

}

exports.getAllProductsView = async (req, res) => {
  const products = await Product.find().populate('owner')
  res.render('products/allProducts', {
    products
  })
}

exports.productDetailsView = async (req, res) => {
  const {
    id
  } = req.params
  const product = await Product.findById(id)
  res.render("products/product-details", product)

}