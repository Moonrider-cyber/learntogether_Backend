const ErrorHander = require('../utils/errorHander');
const catchAsyncError = require('../middleware/catchAsyncError');
const User = require('../models/UserModel');

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

    res.status(201).json({
        success:true,
        token,
    })
} );