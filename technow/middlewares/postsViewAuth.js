exports.isAuthPostsView = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.redirect("/posts/posts")
  }
}
