const Course = require('../models/courseModels');
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
    let course = null;
    await Promise.all(cartcourses.map(async (item) => {
        course = await Course.findByIdAndUpdate(item.courseid, {
          $inc: {
            totalpurchase: 1
          }
        });
      }));
      


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
        await course.save();
    }
    
    res.status(201).json({
        success:true,
        message:"Payment completed successfully",
    })
});


// get all user information -admin 
exports.getAllPayments = catchAsyncError(async(req,res,next)=>{

    let payments = await Payment.find().sort({createAt: -1});
    if(!payments){
        return next(new ErrorHander("somting went wrong",404));
    }

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
        paymentsData
    })
});
