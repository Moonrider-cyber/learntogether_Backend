const express = require('express');
const { getAllCourse,createCourse, updateCourse, deleteCourse, getCourseLectures, addCourseLectures } = require('../controllers/coursecontrollers');
const { isAuthenticatedUser, autorizeRoles } = require('../middleware/Auth');
const { singleUpload } = require('../middleware/multer');

const router = express.Router();

router.route("/course").get(getAllCourse);

router.route("/course/new").post(singleUpload,isAuthenticatedUser,createCourse);

router.route("/course/:id").put(isAuthenticatedUser,updateCourse).delete(isAuthenticatedUser,deleteCourse).get(getCourseLectures).post(singleUpload,addCourseLectures);

module.exports = router