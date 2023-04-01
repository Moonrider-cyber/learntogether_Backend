const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    paymentID:{
        type:String,
        required:true
    },
    paymentStatus:{
        type:String,
        required:true
    },
    paidAmount:{
        type:Number,
        required:true
    },
    userID:{   
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true  
    },
    course:[
        {
            courseid:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            coursename:{
                type:String,
                required:true
            },
            courseprice:{
                type:Number,
                required:true
            },
        }
    ],
    createAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("Payment",paymentSchema);