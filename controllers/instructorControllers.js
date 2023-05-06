const ErrorHander = require('../utils/errorHander');
const catchAsyncError = require('../middleware/catchAsyncError');
const User = require('../models/UserModel');
const sendToken = require('../utils/jwtToken');
const cloudinary = require('cloudinary');
const getDataUri = require("../utils/datauri");
const Course = require('../models/courseModels');
const Payment = require('../models/PaymentModel');

// register user
exports.registerInstructor = catchAsyncError( async(req,res,next)=>{

    const {name,email,password} = req.body;
    const file = req.file;

    if(!name || !email || !password || !file) return next(new ErrorHander("Please enter all field",400));
    let user = await User.findOne({ email });
    if(user) return next(new ErrorHander("User Already Exist",409));

    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
    const role = "instructor";
    
    user = await User.create({
        name,email,password,role,
        avatar:{
            public_id:mycloud.public_id,
            url:mycloud.secure_url,
        }
    });


    sendToken(user,201,res,"Signup Successfully","instructortoken");
} );
//instructor login user
exports.Instructorlogin = catchAsyncError (async(req,res,next)=>{
    const {email,password} = req.body

    // checking if user given pwd and email
    if(!email || !password){
        return next(new ErrorHander("Plese Enter Email & Password"))
    }

    const user = await User.findOne({email}).select("+password");

    if(!user || user.role == 'user' || user.role == 'admin' || user.active == false){
        return next(new ErrorHander("Invalid email or password",401));
    }
    const isPwdMatch = await user.comparePassword(password);
    if(!isPwdMatch){
        return next(new ErrorHander("Invalid email or password",401));
    }
    
    sendToken(user,200,res,"Login Successfully","instructortoken"); 
});
//Instructor logout user
exports.Instructorlogout = catchAsyncError(async(req,res)=>{

    res.cookie("instructortoken", null ,{
        expires: new Date(Date.now()),
        httpOnly:true
    })
    res.status(200).json({
        success:true,
        message:"logged out successfully"
    })
})


// get instructor payments
exports.getInstructorPayments = catchAsyncError(async(req,res,next)=>{
    
    let user = await User.findById(req.user.id);

    if(!user){
        return next(new ErrorHander("user not found",404));
    }
    const mycourse = await Course.find({'createBy.creatorid':user._id});

    const payments = await Payment.find({'courses.courseid':{$in:mycourse.map(item=>item._id)}}).populate('courses.courseid');
   
    let paymentsData = [];

    for (let i = 0; i < payments.length; i++) {
        
        let payment = payments[i];
        
        for (let j = 0; j < payment.courses.length; j++) {
            let course = await Course.findById(payment.courses[j].courseid);
            if(course){
                paymentsData.push({payments:payment,course});
            }
            
        }
    }
      
    res.status(200).json({
        success:true,
        mypayments : paymentsData 
    })

});