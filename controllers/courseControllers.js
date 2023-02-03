const Course = require("../models/CourseModels");
const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require('../middleware/catchAsyncError');

//create course -- Teacher
exports.createCourse = catchAsyncError(async (req,res,next)=>{
    
    const course = await Course.create(req.body);

    res.status(201).json({
        success:true,
        course
    })
});

// get all course
exports.getAllCourse = catchAsyncError(async(req,res) =>{
    
    const courses = await Course.find();
    res.status(200).json({
        success:true,
        courses
    })
});

// get single course 
exports.getSingleCourse = catchAsyncError(async(req,res,next)=>{
    let course = await Course.findById(req.params.id);

    if(!course){
        return next(new ErrorHander("course not found",404));
    }

    res.status(200).json({
        success:true,
        course
    })
});
 

// update course --teacher/admin
exports.updateCourse= catchAsyncError(async(req,res,next)=>{

    let course = await Course.findById(req.params.id);

    if(!course){
        return next(new ErrorHander("course not found",404));
    }

    course = await Course.findByIdAndUpdate(req.params.id,req.body,{
        new:true, runValidators:true
    });

    res.status(200).json({
        success:true,
        course
    })
});

// delete product - teacher,admin

exports.deleteCourse = catchAsyncError(async(req,res,next)=>{

    let course = await Course.findById(req.params.id);

    if(!course){
        return next(new ErrorHander("course not found",404));
    }

    course = await Course.findByIdAndUpdate(req.params.id,req.body,{
        new:true, runValidators:true
    });

    res.status(200).json({
        success:true,
        course
    })
});