const Payment = require("../models/PaymentModel");
const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require('../middleware/catchAsyncError');
const ApiFeatures = require("../utils/apifeatures");
const User = require('../models/UserModel');


// complete payment
exports.completePayment = catchAsyncError(async (req,res,next)=>{
    const {paymentID,amount} = req.body;
    const userID = req.user.id;
    
    if(!paymentID || !amount || !userID){
        return next(new ErrorHander("Payment not completed",400));
    }
    const user = await User.findById(userID);
     
    if(user.cart.length === 0){
        return next(new ErrorHander("Cart is empty",400));
    }

    const cartcourses = user.cart.map((item)=>{
        return {
            courseid:item.course,
        }
    })
    const userdetails = [{
        userID:user._id,
        username:user.name,
    }];
    
    const payment = await Payment.create({
        paymentID, 
        paidAmount:amount,
        user:userdetails,
        courses:cartcourses,
        createAt:Date.now(),
    });
    if(payment){
        user.cart = [];
        await user.save();
    }
    
    res.status(201).json({
        success:true,
        message:"Payment completed successfully",
    })
});


// get all user information -admin 
exports.getAllPayments = catchAsyncError(async(req,res,next)=>{

    let payments = await Payment.find();
    if(!payments){
        return next(new ErrorHander("somting went wrong",404));
    }

    res.status(200).json({
        success:true,
        payments
    })
});
