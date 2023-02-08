const ErrorHander = require('../utils/errorHander');
const catchAsyncError = require('../middleware/catchAsyncError');
const User = require('../models/UserModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail.js')

// register user
exports.registerUser = catchAsyncError( async(req,res,next)=>{

    const {name,email,password} = req.body;

    const user = await User.create({
        name,email,password,
        avatar:{
            public_id:"this is simple id",
            url:"profileurl",
        }
    });

    const token = user.getJWTToken();

    sendToken(user,201,res);
} );

//login user
exports.loginUser = catchAsyncError (async(req,res,next)=>{
    const {email,password} = req.body

    // checking if user given pwd and email
    if(!email || !password){
        return next(new ErrorHander("Plese Enter Email & Password"))
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHander("Invalid email or password",401));
    }
    const isPwdMatch = await user.comparePassword(password);

    if(!isPwdMatch){
        return next(new ErrorHander("Invalid email or password",401));
    }

    sendToken(user,200,res);

});

//logout user
exports.logout = catchAsyncError(async(req,res,next)=>{

    res.cookie("token", null ,{
        expires: new Date(Date.now()),
        httpOnly:true

    })
    res.status(200).json({
        success:true,
        message:"logged out"
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
exports.updateProfile = catchAsyncError(async(req,res,next)=>{
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

//  forgot pwd
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        next (new ErrorHander("User not found"),404);
    }
    //get ResetPassword token
    const resetToken = await user.getResetPwdToken();

    await user.save({validateBeforeSave:false});

    const resetPasswordURL = `${req.protocol}://${req.get("host")}/api/v1/resetpassword/${resetToken}`;

    let message = `Your password reset token in:- \n\n ${resetPasswordURL} \n\n If you have not requested this email then please ignore it 🤣`;

    try {
        message = `Your password reset token in:- \n\n ${resetPasswordURL} \n\n If you have not requested this email then please ignore it 🤣`;
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
 
// reset password 
exports.resetPassword = catchAsyncError(async(req,res,next)=>{

    let { token } = req.params;
    
    if(!token){
        return next(new ErrorHander("token not found",404));
    }

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");


    res.status(200).json({
        success:true,
    })
});
 