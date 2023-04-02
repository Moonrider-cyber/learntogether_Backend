const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    paymentID:{
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
    courses:[
        {
            courseid:{
                type:mongoose.Schema.ObjectId,
                ref:"Course",
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