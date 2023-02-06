const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"please enter course title"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"please enter course desc"]    
    },
    price:{
        type:Number,
        required:[true,"please enter course price"],
        maxLength:[8,"price cannot exceed 8 characters"]
    },
    images:[
        {
            public_id:{
                type:String,
                required:true
            },
            url:{
                type:String,
                required:true
            }
        }
    ],
    catagory:{
        type:String,
        required:[true,"please enter course catagory"]
    },
    rating:{
        type:Number,
        default:0
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true        
            },
            rating:{
                type:String,
                required:true        
            },
            Comment:{
                type:String,
                required:true        
            }
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("course",courseSchema);