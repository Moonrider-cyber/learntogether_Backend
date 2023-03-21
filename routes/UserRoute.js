const express = require('express');
const { registerUser, loginUser, logout, forgotPassword, getMyProfile, updateProfile, changePassword, resetPassword, addToCart, removeFromCart, updateProfilePicture, getAllUsers, updateUserRole, deleteUser, Adminlogout, Adminlogin, addWithRole, activeDeactiveUser } = require('../controllers/userControllers');
const { isAuthenticatedUser, autorizeRoles, isAuthenticatedAdmin } = require('../middleware/auth');
const router = express.Router();
const multer = require('multer');
const { Instructorlogin } = require('../controllers/instructorControllers');


//multer file upload and get file details
const singleUpload = multer({storage:multer.memoryStorage()}).single("avatar");


router.route("/register").post(singleUpload,registerUser);
router.route("/admin/addwithrole").post(singleUpload,addWithRole);
router.route("/login").post(loginUser);
router.route("/admin/login").post(Adminlogin);

// forgot password send reset token via email
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:token").put( resetPassword);
router.route("/logout").post(logout);
router.route("/admin/logout").post(Adminlogout);
router.route("/me").post( isAuthenticatedUser, getMyProfile);
router.route("/admin/me").post( isAuthenticatedAdmin, getMyProfile);
router.route("/admin/controluser/:id").post( isAuthenticatedAdmin, activeDeactiveUser);


// change password from profile
router.route("/changepassword").put( isAuthenticatedUser, changePassword);
router.route("/updateprofile").put( isAuthenticatedUser, updateProfile);
router.route("/updateprofilepicture").put(singleUpload, isAuthenticatedUser, updateProfilePicture);
router.route("/addtocart").post( isAuthenticatedUser, addToCart);
router.route("/removefromcart").delete( isAuthenticatedUser, removeFromCart);

//get all user data -admin``
router.route("/admin/users").post(isAuthenticatedAdmin,getAllUsers);
router.route("/admin/users/:id")
    .put(isAuthenticatedAdmin,updateUserRole)
    .delete(deleteUser)

// instructor
router.route("/instructor/login").post(Instructorlogin);

    
module.exports = router; 