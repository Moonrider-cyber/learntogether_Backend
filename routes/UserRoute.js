const express = require('express');
const { registerUser, loginUser, logout, forgotPassword, getMyProfile, updateProfile, changePassword, resetPassword, addToCart, removeFromCart, updateProfilePicture, getAllUsers, updateUserRole, deleteUser } = require('../controllers/userControllers');
const { isAuthenticatedUser, autorizeRoles } = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');


//multer file upload and get file details
const singleUpload = multer({storage:multer.memoryStorage()}).single("avatar");


router.route("/register").post(singleUpload,registerUser);
router.route("/login").post(loginUser);

// forgot password send reset token via email
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:token").put( isAuthenticatedUser, resetPassword);
router.route("/logout").post(logout);
router.route("/me").post( isAuthenticatedUser, getMyProfile);


// change password from profile
router.route("/changepassword").put( isAuthenticatedUser, changePassword);
router.route("/updateprofile").put( isAuthenticatedUser, updateProfile);
router.route("/updateprofilepicture").put(singleUpload, isAuthenticatedUser, updateProfilePicture);
router.route("/addtocart").post( isAuthenticatedUser, addToCart);
router.route("/removefromcart").delete( isAuthenticatedUser, removeFromCart);

//get all user data -admin
router.route("/admin/users").post(isAuthenticatedUser,autorizeRoles('admin'),getAllUsers);
router.route("/admin/users/:id")
    .put(isAuthenticatedUser,autorizeRoles('admin'),updateUserRole)
    .delete(isAuthenticatedUser,autorizeRoles('admin'),deleteUser)


module.exports = router; 