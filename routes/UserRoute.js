const express = require('express');
const { registerUser, loginUser, logout, forgotPassword, getMyProfile, updateProfile, changePassword, resetPassword, addToCart, removeFromCart, updateProfilePicture, getAllUsers, updateUserRole, deleteUser, Adminlogout, Adminlogin, addWithRole, activeDeactiveUser, getCartCourse, checkEnroll, getEnrollCourse } = require('../controllers/userControllers');
const { isAuthenticatedUser, isAuthenticatedAdmin, isAuthenticatedInstructor } = require('../middleware/Auth');
const router = express.Router();
const multer = require('multer');
const { Instructorlogin, registerInstructor, Instructorlogout } = require('../controllers/instructorControllers');
const { completePayment, getAllPayments } = require('../controllers/paymentControllers');


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
router.route("/me").post( isAuthenticatedUser, getMyProfile);
router.route("/checkenroll").post( isAuthenticatedUser, checkEnroll);
router.route("/enrollcourse").post( isAuthenticatedUser, getEnrollCourse);


// Payment
router.route("/payment").post( isAuthenticatedUser, completePayment);


// change password from profile
router.route("/changepassword").put( isAuthenticatedUser, changePassword);
router.route("/updateprofile").put( isAuthenticatedUser, updateProfile);
router.route("/updateprofilepicture").put(singleUpload, isAuthenticatedUser, updateProfilePicture);
router.route("/addtocart").post( isAuthenticatedUser, addToCart);
router.route("/getcartcourses").post( isAuthenticatedUser, getCartCourse);
router.route("/removefromcart").delete( isAuthenticatedUser, removeFromCart);

//get all user data -admin``
router.route("/admin/users").post(isAuthenticatedAdmin,getAllUsers);
router.route("/admin/me").post( isAuthenticatedAdmin, getMyProfile);
router.route("/admin/payments").post(isAuthenticatedAdmin,getAllPayments);
router.route("/admin/logout").post(Adminlogout);
router.route("/admin/me").post( isAuthenticatedAdmin, getMyProfile);
router.route("/admin/controluser/:id").post( isAuthenticatedAdmin, activeDeactiveUser);
router.route("/admin/users/:id")
    .put(isAuthenticatedAdmin,updateUserRole)
    .delete(deleteUser)

// instructor
router.route("/instructor/login").post(Instructorlogin);
router.route("/instructor/register").post(singleUpload,registerInstructor);
router.route("/instructor/me").post( isAuthenticatedInstructor, getMyProfile);
router.route("/instructor/logout").post(Instructorlogout);

module.exports = router; 