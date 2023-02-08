const express = require('express');
const { getAllCourse,createCourse, updateCourse, deleteCourse, getSingleCourse } = require('../controllers/coursecontrollers');
const { isAuthenticatedUser, autorizeRoles } = require('../middleware/Auth');

const router = express.Router();

router.route("/course").get(getAllCourse);

router.route("/course/new").post(isAuthenticatedUser,createCourse);

router.route("/course/:id").put(isAuthenticatedUser,updateCourse).delete(isAuthenticatedUser,deleteCourse).get(getSingleCourse);


module.exports = router