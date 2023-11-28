const ErrorHander = require('../utils/errorHander');
const catchAsyncError = require('../middleware/catchAsyncError');
const User = require('../models/UserModel');
const Course = require('../models/CourseModels');
const Payment = require('../models/PaymentModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail.js');
const cloudinary = require('cloudinary');
const getDataUri = require("../utils/datauri");
// const crypto = require('crypto');

// register user
exports.registerUser = catchAsyncError( async(req,res,next)=>{

    const {name,email,password} = req.body;
    
    const file = req.file;

    if(!name || !email || !password || !file) return next(new ErrorHander("Please enter all field",400));
    let user = await User.findOne({ email });
    if(user) return next(new ErrorHander("User Already Exist",409));

    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    user = await User.create({
        name,email,password,
        avatar:{
            public_id:mycloud.public_id,
            url:mycloud.secure_url,
        }
    });

    sendToken(user,201,res,"Signup Successfully");
} );


// add admin
exports.addWithRole = catchAsyncError( async(req,res,next)=>{

    const {name,email,password,role = "user"} = req.body;
    const file = req.file;

    if(!name || !email || !password || !file) return next(new ErrorHander("Please enter all field",400));
    let user = await User.findOne({ email });
    if(user) return next(new ErrorHander("User Already Exist",409));

    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    // let role = "admin";
    user = await User.create({
        name,email,password,role,
        avatar:{
            public_id:mycloud.public_id,
            url:mycloud.secure_url,
        }
    });

    res.status(201).json({
        success:true,
        message:`${role} added successfully`
    });
} );

//login user
exports.loginUser = catchAsyncError (async(req,res,next)=>{
    const {email,password} = req.body

    // checking if user given pwd and email
    if(!email || !password){
        return next(new ErrorHander("Plese Enter Email & Password"))
    }

    const user = await User.findOne({email}).select("+password");

    if(!user || user.role == 'sub-admin' || user.role == 'admin' || user.role == 'instuctor'){
        return next(new ErrorHander("Invalid email or password",401));
    }

    const isPwdMatch = await user.comparePassword(password);

    if(!isPwdMatch){
        return next(new ErrorHander("Invalid email or password",401));
    }
    sendToken(user,200,res,"Login Successfully");

});
//admin login user
exports.Adminlogin = catchAsyncError (async(req,res,next)=>{
    const {email,password} = req.body

    // checking if user given pwd and email
    if(!email || !password){
        return next(new ErrorHander("Plese Enter Email & Password"))
    }

    const user = await User.findOne({email}).select("+password");
    
    if(!user || user.role == 'user' || user.role == 'instuctor' || user.active == false){
        return next(new ErrorHander("Invalid email or password",401));
    }
    // const isPwdMatch = await user.comparePassword(password);
    
    // if(!isPwdMatch){
    //     return next(new ErrorHander("Invalid email or password",401));
    // }
    
    sendToken(user,200,res,"Login Successfully","admintoken");
    
});

//logout user
exports.logout = catchAsyncError(async(req,res)=>{

    res.cookie("token", null ,{
        expires: new Date(Date.now()),
        httpOnly:true

    })
    res.status(200).json({
        success:true,
        message:"logged out successfully"
    })
})
//Admin logout user
exports.Adminlogout = catchAsyncError(async(req,res)=>{

    res.cookie("admintoken", null ,{
        expires: new Date(Date.now()),
        httpOnly:true

    })
    res.status(200).json({
        success:true,
        message:"logged out successfully"
    })
})

// change password
exports.changePassword = catchAsyncError(async(req,res,next)=>{
    const { oldPassword, newPassword } = req.body;

    if(!oldPassword || !newPassword)
        return next(new ErrorHander("please enter all field",400));

    const user = await User.findById(req.user.id).select("+password");

    const isPwdMatch = await user.comparePassword(oldPassword);

    if(!isPwdMatch)
        return next(new ErrorHander("incorrect old password",400));

    user.password = newPassword;
    
    await user.save();

    res.status(200).json({
        success:true,
        message:"passsword change successfully"
    })
});

// update profile
exports.updateProfile = catchAsyncError(async(req,res)=>{
    const {name, email} = req.body;

    const user = await User.findById(req.user.id);

    if(name) user.name = name;
    if(email) user.email = email;

    await user.save();

    res.status(200).json({
        success:true,
        message:"profile change successfully"
    })
});

// update profilePicture
exports.updateProfilePicture = catchAsyncError(async(req,res)=>{
    
    const user = await User.findById(req.user.id);

    const file = req.file;
    const fileUri = getDataUri(file);

    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
    
    user.avatar = {
        public_id:mycloud.public_id,
        url:mycloud.secure_url,
    }

    res.status(200).json({
        success:true,
        message:"profile Picture change successfully"
    })
});

//  forgot pwd
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});
    
    if(!user){
        return next(new ErrorHander("User not found"),404);
    }
    //get ResetPassword token
    const resetToken = await user.getResetPwdToken();
    // console.log("reset token send",resetToken);
    await user.save({validateBeforeSave:false});
 
    // const resetPasswordURL = `${req.protocol}://${req.get("host")}/api/v1/resetpassword/${resetToken}`;
    let resetPasswordURL = ``;
    if(req.body.user == true){
        resetPasswordURL = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
    }else{
        resetPasswordURL = `${process.env.FRONTEND_URL}/admin/resetpassword/${resetToken}`;
    }
    let message = `Your password reset token in:- \n\n ${resetPasswordURL} \n\n If you have not requested this email then please ignore it`;

    try {
        message 
        await sendEmail({
            email:user.email,
            subject:"Busilearn Password recovery",
            message
        });

        res.status(200).json({
            success:true,
            message:`email send to ${user.email} successfully`,
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        await user.save({validateBeforeSave:false});
        return next(new ErrorHander(error.message,500));
    }
});

// reset password 
exports.resetPassword = catchAsyncError(async(req,res,next)=>{

    let { token } = req.params;
    
    if(!token){
        return next(new ErrorHander("token not found",404));
    }


    // console.log("req....",token);
    // const resetPasswordToken = crypto.createHmac("sha256",process.env.JWT_SECRET).update(token).digest("hex");
    // console.log("resettoken... after decrpt",resetPasswordToken);

    const user = await User.findOne({
        resetPasswordToken:token,
        resetPasswordExpire:{
            $gt: Date.now(),
        }
    })
    // console.log("user",user);
    if(!user){
        return next(new ErrorHander("reset token invalid or has been expired",404));
    }

    user.password = req.body.pwd;
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;

    await user.save();

    res.status(200).json({
        success:true,
        message:"passsword change successfully"
    })
});
 

// get user information 
exports.getMyProfile = catchAsyncError(async(req,res,next)=>{

    let user = await User.findById(req.user.id);
    if(!user){
        return next(new ErrorHander("user not found",404));
    }

    res.status(200).json({
        success:true,
        user
    })
});
 
// add to cart
exports.addToCart = catchAsyncError(async(req,res,next)=>{
    
    const user = await User.findById(req.user.id);
    const course = await Course.findById(req.body.courseid);

    if(!course){
        return next(new ErrorHander("course not found"),404);
    }

    const itemExist = user.cart.find((item)=>{
        if(item.course.toString()=== course.id.toString()) return true
    })

    if(itemExist) return next(new ErrorHander("Course already in cart"),409);

    user.cart.push({
        course:course.id,
        poster:course.poster.url
    });

    await user.save();
    
    res.status(200).json({
        success:true,
        message:"added to cart"
    })
})
// get course that are in cart
exports.getCartCourse = catchAsyncError(async(req,res)=>{
    const user = await User.findById(req.user.id);
    
    const cartcourses = await Course.find({_id:{$in:user.cart.map(item=>item.course)}});
    
    res.status(200).json({
        success:true,
        cartcourses
    })
})

// remove to cart
exports.removeFromCart = catchAsyncError(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    const course = await Course.findById(req.body.courseid);
    if(!course){
        return next(new ErrorHander("course not found"),404);
    }

    const newcart = await user.cart.filter(item=>{
        if(item.course.toHexString()!==course.id.toString()) return item;
    });
    user.cart = newcart;
    await user.save();
    res.status(200).json({
        success:true,
        message:"remove to cart"
    })
}) 

// get all user information -admin 
exports.getAllUsers = catchAsyncError(async(req,res,next)=>{

    let users = await User.find().sort({createAt: -1});
    if(!users){
        return next(new ErrorHander("somting went wrong",404));
    }

    res.status(200).json({
        success:true,
        users
    })
});

// update user role
exports.updateUserRole = catchAsyncError(async(req,res,next)=>{

    let user = await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHander("somting went wrong",404));
    }

    if(user.role==="user") user.role="admin"
    else user.role="user"

    await user.save();

    res.status(200).json({
        success:true,
        message:"role updated"
    })
});
// delete user
exports.deleteUser = catchAsyncError(async(req,res,next)=>{

    let user = await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHander("user not found",404));
    }
    await cloudinary.v2.uploader.destroy(user.avatar.public_id); 

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success:true,
        message:"user delete successfully"
    })
});

// active deactive user
exports.activeDeactiveUser = catchAsyncError(async(req,res,next)=>{
    let user = await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHander("user not found",404));
    }
    if(user.active == true) user.active=false
    else user.active=true

    await user.save();

    res.status(200).json({
        success:true,
        message:"user behavior change successfully"
    })
});

// check user already enroll or not
exports.checkEnroll = catchAsyncError(async(req,res,next)=>{
    let userid = await User.findById(req.user.id);
    let courseid = await req.body.courseid;
    if(!userid){
        return next(new ErrorHander("user not found",404));
    }
    
    const isEnroll = await Payment.findOne({
        user: { $elemMatch: { userID: userid, username: { $exists: true } } },
        courses: { $elemMatch: { courseid: courseid } }
      });
      
    if(!isEnroll){
        res.status(200).json({
            success:false,
            isEnroll : false
        })
    }else{
        res.status(200).json({
            success:true,
            isEnroll : true
        })
    }
    next();
})

// get all enroll course
exports.getEnrollCourse = catchAsyncError(async(req,res,next)=>{
    let userid = await User.findById(req.user.id);
    
    if(!userid){
        return next(new ErrorHander("user not found",404));
    }
    const payments = await Payment.find({'user.userID': userid}).populate('courses.courseid');
    if(!payments){
        return next(new ErrorHander("courses not found",404));
    }
    const courses = [];
    payments.forEach(payment => {
      payment.courses.forEach(course => {
        courses.push(course.courseid);
      });
    });

    const filtercourses = courses.map((item) =>
    {
        if(item === null){
            return false
        }
        if(item.active == true){
            return item
        }
        else{
            return false
        }
    }) 
    
    res.status(200).json({
        success:true,
        enrollcourses : filtercourses 
    })
})


// create review
exports.createReview = catchAsyncError(async(req,res,next)=>{
    const {rating,comment,courseid} = req.body;
    const {id} = req.user;

    
    if(!rating || !comment || !courseid){
        return next(new ErrorHander("please provide rating and comment",400));
    }
    const course = await Course.findById(courseid.id);
    
    if(!course){
        return next(new ErrorHander("course not found",404));
    }

    if(course.reviews.find(review=>review.userid.toString()===id.toString())){
        return next(new ErrorHander("you already review this course",400));
    }
    
    course.reviews.push({
        userid:id,  
        name:req.user.name,
        rating:Number(rating),
        comment
    })

    
    course.numOfReviews = course.numOfReviews + 1;
    let totalRating = 0;
  
    course.reviews.forEach((review)=>{
        totalRating += Number(review.rating);
    })
    
    course.rating = totalRating / course.numOfReviews;
    
    await course.save();

    res.status(200).json({
        success:true,
        message:"review created"
    })
});
// delete review
exports.deleteReview = catchAsyncError(async(req,res,next)=>{
    const {courseid,reviewid} = req.query;

    if(!courseid || !reviewid){
        return next(new ErrorHander("please provide courseid and reviewid",400));
    }
    const course = await Course.findById(courseid);
    
    if(!course){
        return next(new ErrorHander("course not found",404));
    }
    
    let newcoursesreviews = course.reviews.filter(review=>review._id.toString()!==reviewid.toString());
    course.reviews = newcoursesreviews;

    course.numOfReviews = course.numOfReviews - 1;
    
    let newtotalrate = 0;

    if(newcoursesreviews.length === 0){
        course.rating = 0;
    }else{
        newcoursesreviews.forEach((review)=>{        
           newtotalrate += Number(review.rating);
        })
        course.rating = newtotalrate / course.numOfReviews;
    }
    
    await course.save();

    res.status(200).json({
        success:true,
        message:"review deleted"
    })
});
