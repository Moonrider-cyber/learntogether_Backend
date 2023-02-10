const ErrorHander = require('../utils/errorHander');
const catchAsyncError = require('./catchAsyncError');
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

exports.isAuthenticatedUser = catchAsyncError(async(req,res,next)=>{
    const { token } = req.cookies;

    if(!token){
        return next(new ErrorHander("Please Login to access this recourse",401));
    }

    const decodeData = jwt.verify(token,process.env.JWT_SECRET);

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
