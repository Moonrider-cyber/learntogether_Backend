const Payment = require("../models/PaymentModel");
const ErrorHander = require("../utils/errorHander");
const catchAsyncError = require('../middleware/catchAsyncError');
const ApiFeatures = require("../utils/apifeatures");


// complete payment
exports.completePayment = catchAsyncError(async (req,res,next)=>{
    const {paymentID,amount,courses,userID,date} = req.body;
    if(!paymentID || !amount || !currency || !userID){
        return next(new ErrorHander("Payment not completed",400));
    }
    const payment = await Payment.create({
        paymentID,
        paidAmount,
        userID,
        courses,
        createAt:date,
    });
    res.status(201).json({
        success:true,
        message:"Payment completed successfully",
    })
});