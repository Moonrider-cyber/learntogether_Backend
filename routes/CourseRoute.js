const express = require('express');
const { getAllCourse,createCourse, updateCourse, deleteCourse, getSingleCourse } = require('../controllers/coursecontrollers');

const router = express.Router();

router.route("/course").get(getAllCourse);

router.route("/course/new").post(createCourse);

router.route("/course/:id").put(updateCourse).delete(deleteCourse).get(getSingleCourse);


module.exports = router