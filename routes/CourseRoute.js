const express = require('express');
const { getAllCourse,createCourse, updateCourse, deleteCourse, getCourseLectures, addCourseLectures, deleteLecture } = require('../controllers/coursecontrollers');
const { isAuthenticatedUser, autorizeRoles } = require('../middleware/Auth');
const router = express.Router();
// const  { singleupload }  = require('../middleware/multer.js');

//multer file upload and get file details
const multer = require('multer');
const singleUpload = multer({storage:multer.memoryStorage()}).single("file");


router.route("/course")
    .get(getAllCourse);

router.route("/course/new")
    .post(singleUpload,isAuthenticatedUser,autorizeRoles("admin"),createCourse);

router.route("/course/:id")
    .put(singleUpload,isAuthenticatedUser,autorizeRoles("admin"),updateCourse)
    .delete(isAuthenticatedUser,autorizeRoles("admin"),deleteCourse)
    .get(isAuthenticatedUser,getCourseLectures)
    .post(singleUpload,isAuthenticatedUser,autorizeRoles("admin"),addCourseLectures);

router.route("/lecture")
    .delete(deleteLecture);


module.exports = router 