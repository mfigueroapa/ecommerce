const passport = require('passport');
const User = require("../models/User");

const bcrypt = require("bcrypt");


exports.loginView = (req, res) => {
  res.render("auth/login", {
    "message": req.flash("error")
  })
}

exports.loginProcess = passport.authenticate('local',{
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
})

exports.signupView = (req, res) => {
  res.render("auth/signup")
}

exports.signupProcess = async (req, res) => {
  const {
    username,
    email,
    password
  } = req.body
  console.log(email, password)
  if (!email || !password || !username) {
    return res.render("auth/signup", {
      message: "Fields are missing"
    })
  }
  const user = await User.findOne({
    email
  })
  if (user) {
    return res.render("auth/signup", {
      message: "Error ✖"
    })
  }
  const salt = bcrypt.genSaltSync(12)
  const hashPass = bcrypt.hashSync(password, salt)
  await User.create({
    username,
    email,
    password: hashPass
  })

  res.redirect('/login')
}

exports.logoutProcess = async (req, res)=>{
  req.logout();
  // res.redirect('back');
  res.redirect('/');
}

exports.googleInit = passport.authenticate("google", {
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
  ]
})

exports.googleCallback = passport.authenticate("google", {
  successRedirect: '/profile',
  failureRedirect: '/login'
})

exports.facebookInit = passport.authenticate("facebook")

exports.facebookCallback = passport.authenticate("facebook", {
  successRedirect: '/profile',
  failureRedirect: '/login'
})