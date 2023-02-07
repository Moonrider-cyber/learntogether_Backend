const express = require('express');
const { registerUser, loginUser, logout, forgotPassword } = require('../controllers/userControllers');
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/logout").post(logout);
 
module.exports = router;