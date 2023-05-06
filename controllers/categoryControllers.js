const Category = require("../models/categoryModel");
const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require('../middleware/catchAsyncError');

//create Category -- Teacher
exports.createCategory = catchAsyncError(async (req,res,next)=>{
    
    const {name,description,createBy} = req.body;

    let categorydata = await Category.findOne({ name });
    if(categorydata) return next(new ErrorHander("Someone already took this course title",409));


    await Category.create({
        name,
        description,
        createBy,
    });

    res.status(201).json({
        success:true,
        message:"Category created successfully",
    })
});

// get all Category
exports.getAllCategory = catchAsyncError(async(req,res,next) =>{
    
    const categoryCount = await Category.countDocuments();

    let category = await Category.find().sort({createAt: -1});
    
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
    
    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success:true,
        message:"Category deleted successfuly"
    })
});


// active deactive user
exports.activeDeactiveCategory = catchAsyncError(async(req,res,next)=>{
    let category = await Category.findById(req.params.id)
    if(!category){
        return next(new ErrorHander("Category not found",404));
    }
    if(category.active == true) category.active=false
    else category.active=true

    await category.save();

    res.status(200).json({
        success:true,
        message:"Category behavior change successfully"
    })
});
