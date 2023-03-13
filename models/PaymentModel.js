const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    
    user:[
        {
            userid:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true
            },
            username:{
                type:String,
                required:true
            },
        }
    ],
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