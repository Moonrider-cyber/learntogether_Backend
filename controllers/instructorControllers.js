const ErrorHander = require('../utils/errorHander');
const catchAsyncError = require('../middleware/catchAsyncError');
const User = require('../models/UserModel');
const sendToken = require('../utils/jwtToken');

//admin login user
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