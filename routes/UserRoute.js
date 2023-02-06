const express = require('express');
const { registerUser, loginUser, logout } = require('../controllers/userControllers');
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);
 
module.exports = router;