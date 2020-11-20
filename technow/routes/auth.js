const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {
  loginView,
  loginProcess,
  signupView,
  signupProcess,
  logoutProcess,
  googleInit,
  googleCallback,
  facebookInit,
  facebookCallback
} = require('../controllers/auth')

router.get("/login", loginView)
router.post("/login", loginProcess)
router.get("/signup", signupView)
router.post('/signup', signupProcess)
router.get('/auth/google', googleInit)
router.get("/auth/google/callback", googleCallback)
router.get('/auth/facebook', facebookInit)
router.get("/auth/facebook/callback", facebookCallback)
router.get("/logout", logoutProcess)

module.exports = router;