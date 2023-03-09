const Category = require("../models/CategoryModels");
const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require('../middleware/catchAsyncError');
const ApiFeatures = require("../utils/apifeatures");
const cloudinary = require('cloudinary');
const getDataUri = require("../utils/datauri");

//create Category -- Teacher
exports.createCategory = catchAsyncError(async (req,res,next)=>{
    
    const {title,description,createBy} = req.body;


    const category = await Category.create({
        title,
        description,
        createBy,
    });

    res.status(201).json({
        success:true,
        message:"Category created successfully",
    })
});

// get all Category
exports.getAllCategory = catchAsyncError(async(req,res) =>{
    
    const categoryCount = await Category.countDocuments();

    let category = await Category.find();
    
    if(!category){
        return next(new ErrorHander("somting went wrong",404));
    }

    res.status(200).json({
        success:true,
        category,
        categoryCount,
    })
});

// update Category --teacher/admin
exports.updateCategory= catchAsyncError(async(req,res,next)=>{

    let category = await Category.findById(req.params.id);

    if(!category){
        return next(new ErrorHander("Category not found",404));
    }

    category = await Category.findByIdAndUpdate(req.params.id,req.body,{
        new:true, runValidators:true
    });

    res.status(200).json({
        success:true,
        category
    })
});

// delete Category - teacher,admin
exports.deleteCategory = catchAsyncError(async(req,res,next)=>{

    let category = await Category.findById(req.params.id);

    if(!category){
        return next(new ErrorHander("Category not found",404));
    }
    
    await Category.remove();

    res.status(200).json({
        success:true,
        message:"Category deleted successfuly"
    })
});


// active deactive user
exports.activeDeactiveCategory = catchAsyncError(async(req,res,next)=>{
    let Category = await Category.findById(req.params.id)
    if(!Category){
        return next(new ErrorHander("Category not found",404));
    }
    if(Category.active == true) Category.active=false
    else Category.active=true

    await Category.save();

    res.status(200).json({
        success:true,
        message:"Category behavior change successfully"
    })
});
