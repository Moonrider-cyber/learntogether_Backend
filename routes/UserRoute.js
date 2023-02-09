const express = require('express');
const { registerUser, loginUser, logout, forgotPassword, getMyProfile, updateProfile, changePassword, resetPassword, addToCart, removeFromCart } = require('../controllers/userControllers');
const { isAuthenticatedUser } = require('../middleware/auth');
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
// forgot password send reset token via email
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:token").put( isAuthenticatedUser, resetPassword);
router.route("/logout").post(logout);
router.route("/me").post( isAuthenticatedUser, getMyProfile);
// change password from profile
router.route("/changepassword").put( isAuthenticatedUser, changePassword);
router.route("/updateprofile").put( isAuthenticatedUser, updateProfile);
router.route("/addtocart").post( isAuthenticatedUser, addToCart);
router.route("/removefromcart").delete( isAuthenticatedUser, removeFromCart);

 
module.exports = router;