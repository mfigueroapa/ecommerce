const express = require("express");
// const passport = require('passport');
const router = express.Router();
// const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");

const {loginView, loginProcess, signupView, signupProcess, logoutProcess} = require('../controllers/auth')

router.get("/login", loginView)
// router.get("/login", (req, res, next) => {
//   res.render("auth/login", {
//     "message": req.flash("error")
//   })
// })

router.post("/login", loginProcess)
// router.post("/login", passport.authenticate("local", {
//   successRedirect: "/",
//   failureRedirect: "/login",
//   failureFlash: true,
//   passReqToCallback: true
// }));

router.get("/signup", signupView)
// router.get("/signup",  (req, res, next) => {
//   res.render("auth/signup");
// });


router.post('/signup', signupProcess)
// router.post('/signup', async (req, res, next) => {
//   const {
//     email,
//     password
//   } = req.body
//   console.log(email, password)
//   if (!email || !password) {
//     return res.render("auth/signup", {
//       message: "Indicate email and password"
//     })
//   }
//   const user = await User.findOne({
//     email
//   })
//   if (user) {
//     return res.render("auth/signup", {
//       message: "Error ✖"
//     })
//   }
//   const salt = bcrypt.genSaltSync(12)
//   const hashPass = bcrypt.hashSync(password, salt)
//   await User.create({
//     email,
//     password: hashPass
//   })

//   res.redirect('/login')
// })

router.get("/logout", logoutProcess)
// router.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("/");
// });

module.exports = router;