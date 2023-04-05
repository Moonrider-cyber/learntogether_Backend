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
    user:[
         {   
            userID:{
                type:mongoose.Schema.ObjectId,
                ref:"user",
                required:true
            },
            username:{
                type:String,
                required:true
            }  
        }
    ],
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