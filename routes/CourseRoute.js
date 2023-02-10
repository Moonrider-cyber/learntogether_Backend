const express = require('express');
const { getAllCourse,createCourse, updateCourse, deleteCourse, getCourseLectures, addCourseLectures } = require('../controllers/coursecontrollers');
const { isAuthenticatedUser, autorizeRoles } = require('../middleware/Auth');
// const  { singleupload }  = require('../middleware/multer.js');

//multer file upload and get file details
const multer = require('multer');
const singleUpload = multer({storage:multer.memoryStorage()}).single("file");

const router = express.Router();

router.route("/course").get(getAllCourse);

router.route("/course/new").post(singleUpload,isAuthenticatedUser,autorizeRoles("admin"),createCourse);

router.route("/course/:id").put(isAuthenticatedUser,updateCourse).delete(isAuthenticatedUser,deleteCourse).get(getCourseLectures).post(addCourseLectures);

module.exports = router