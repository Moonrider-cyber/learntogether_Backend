const express = require('express');
const { getAllCourse,createCourse, updateCourse, deleteCourse, getCourseLectures, addCourseLectures, deleteLecture, activeDeactiveCourse, getAllCourseadmin, getAllCourseins } = require('../controllers/courseControllers');
const { autorizeRoles, isAuthenticatedAdmin, isAuthenticatedInstructor } = require('../middleware/Auth');
const router = express.Router();
// const  { singleupload }  = require('../middleware/multer.js');

//multer file upload and get file details
const multer = require('multer');
const singleUpload = multer({storage:multer.memoryStorage()}).single("file");


router.route("/course")
    .get(getAllCourse);

router.route("/admin/course")
    .get(getAllCourseadmin);

router.route("/instructor/course")
    .get(isAuthenticatedInstructor , getAllCourseins);

router.route("/course/new")
    // .post(singleUpload,isAuthenticatedAdmin,autorizeRoles("admin"),createCourse);
    .post(singleUpload,createCourse);

router.route("/course/:id")
    .put(singleUpload,isAuthenticatedAdmin,updateCourse)
    .delete(deleteCourse)
    .get(getCourseLectures)
    .post(singleUpload,addCourseLectures);

router.route("/lecture")
    .delete(deleteLecture);
    
router.route("/admin/controlcourse/:id")
    .post(activeDeactiveCourse);

module.exports = router 