exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    req.app.locals.logged = true
    next()
  } else {
    req.app.locals.logged = false
    res.redirect("/")
  }
}
exports.isAuthAllViews = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    next()
  }
}

exports.isNotAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next()
  } else {
    res.redirect("/profile")
  }
}