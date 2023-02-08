const Course = require("../models/courseModels");
const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require('../middleware/catchAsyncError');
const ApiFeatures = require("../utils/apifeatures");

//create course -- Teacher
exports.createCourse = catchAsyncError(async (req,res,next)=>{
    
    req.body.user = req.user.id
    
    const course = await Course.create(req.body);
    res.status(201).json({
        success:true,
        course
    })
});

// get all course
exports.getAllCourse = catchAsyncError(async(req,res) =>{
    
    const resultPerPage = 5;
    const productCount = await Course.countDocuments();

    const apiFeatures = new ApiFeatures(Course.find(),req.query).search().filter().pagination(resultPerPage);

    const courses = await apiFeatures.query;
    res.status(200).json({
        success:true,
        courses,
        productCount,
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