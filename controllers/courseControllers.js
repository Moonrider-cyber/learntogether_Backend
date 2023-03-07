const Course = require("../models/courseModels");
const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require('../middleware/catchAsyncError');
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require('cloudinary');
const getDataUri = require("../utils/datauri");

//create course -- Teacher
exports.createCourse = catchAsyncError(async (req,res,next)=>{
    
    const {title,description,price,poster,catagory} = req.body;

    // req.body.user = req.user.id
    
    const file = req.file;
    const fileUri = getDataUri(file);

    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    const course = await Course.create({
        title,
        description,
        price,
        catagory,
        poster:{
            public_id:mycloud.public_id,
            url:mycloud.secure_url,
        },
    });

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
exports.getCourseLectures = catchAsyncError(async(req,res,next)=>{
    let course = await Course.findById(req.params.id);

    if(!course){
        return next(new ErrorHander("course not found",404));
    }

    course.views += 1;
    
    res.status(200).json({
        success:true,
        lectures: course.lectures
    })
});

// add lectures Max video size 100MB
exports.addCourseLectures = catchAsyncError(async(req,res,next)=>{

    const {id} = req.params;
    const {title,desc} = req.body;

    let course = await Course.findById(id);
    if(!course){
        return next(new ErrorHander("course not found",404));
    }

    const file = req.file;
    const fileUri = getDataUri(file);

    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content,{
        resource_type:"video",
    });
    
    course.lectures.push({
        title,
        desc,
        video:{
            public_id: mycloud.public_id,
            url: mycloud.secure_url,
        }
    });

    course.noOfVideos = course.lectures.length;
    await course.save();
    res.status(200).json({
        success:true,
        message:"lectures added in course"
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

// delete course - teacher,admin
exports.deleteCourse = catchAsyncError(async(req,res,next)=>{

    let course = await Course.findById(req.params.id);

    if(!course){
        return next(new ErrorHander("course not found",404));
    }
    await cloudinary.v2.uploader.destroy(course.poster[0].public_id); 

    for (let i = 0; i < course.lectures.length; i++) {
        const singleLecture = course.lectures[i];
        await cloudinary.v2.uploader.destroy(singleLecture.video[0].public_id,{
            resource_type:"video",
        }); 
    }

    await course.remove();

    res.status(200).json({
        success:true,
        message:"course deleted successfuly"
    })
});

// delete lectures - teacher,admin
exports.deleteLecture= catchAsyncError(async(req,res,next)=>{

    const {courseId,lectureId} = req.query;

    let course = await Course.findById(courseId);

    if(!course){
        return next(new ErrorHander("course not found",404));
    }
    
    const lecture = course.lectures.find((item)=>{
        if(item._id.toString() === lectureId.toString()) return item;
    })
    await cloudinary.v2.uploader.destroy(lecture.video[0].public_id,{
        resource_type:"video",
    });
    
    course.lectures.filter(item=>{
        if(item._id.toString() !== lectureId.toString()) return item;
    })
    course.noOfVideos = course.lectures.length;
    await course.save();
    console.log(course.lectures[0].video)

    res.status(200).json({
        success:true,
        message:"lectures deleted successfuly"
    })
});