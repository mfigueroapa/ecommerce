const express = require("express");
// const passport = require('passport');
const router = express.Router();
// const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");

const {loginView, loginProcess, signupView, signupProcess, logoutProcess, googleInit, googleCallback} = require('../controllers/auth')

router.get("/login", loginView)
router.post("/login", loginProcess)
router.get("/signup", signupView)
router.post('/signup', signupProcess)

router.get('/auth/google', googleInit)
router.get("/auth/google/callback", googleCallback)



router.get("/logout", logoutProcess)



module.exports = router;