exports.isAuthProductsView = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect("/products/products")
  }
}
