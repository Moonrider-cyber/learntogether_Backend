const ErrorHander = require('../utils/errorHander');
const catchAsyncError = require('./catchAsyncError');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

exports.isAuthenticatedUser = catchAsyncError(async(req,res,next)=>{
    const { token } = req.cookies;
    
    if(!token){
        return res.status(401).json({
            success:false,
        })
    }
    
    const decodeData = jwt.verify(token,process.env.JWT_SECRET);

    req.user = await User.findById(decodeData.id);

    next();
});
exports.isAuthenticatedAdmin = catchAsyncError(async(req,res,next)=>{
    const { admintoken } = req.cookies;
    if(!admintoken){
        return res.status(401).json({
            success:false,
        })
    }

    const decodeData = jwt.verify(admintoken,process.env.JWT_SECRET);

    req.user = await User.findById(decodeData.id);

    next();
});
exports.isAuthenticatedInstructor = catchAsyncError(async(req,res,next)=>{
    const { instructortoken } = req.cookies;
    
    if(!instructortoken){
        return res.status(401).json({
            success:false,
        })
    }

    const decodeData = jwt.verify(instructortoken,process.env.JWT_SECRET);

    req.user = await User.findById(decodeData.id);

    next();
});
exports.autorizeRoles = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(
            new ErrorHander(`Role: ${req.user.role} is not allow to access this resourse`,403)
        )};
        next();
    }
}
