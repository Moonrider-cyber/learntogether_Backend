const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"please enter course title"],
        minLength:[4,"Password should have more then 4 charaters"],
        maxLength:[80,"price cannot exceed 80 characters"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"please enter course desc"],    
        minLength:[20,"Password should have more then 20 charaters"]
    },
    price:{
        type:Number,
        required:[true,"please enter course price"],
        maxLength:[8,"price cannot exceed 8 characters"]
    },
    lectures:{
        title:{
            type:Number,
            required:[true,"please enter lectures title"],
        },
        desc:{
            type:Number,
            required:[true,"please enter lectures desc"],
        },
        video:[
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
    },
    poster:[
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
    views:{
        type:Number,
        default:0,
    },
    noOfVideos:{
        type:Number,
        default:0,
    },
    catagory:{
        type:String,
        required:[true,"please enter course catagory"]
    },
    // rating:{
    //     type:Number,
    //     default:0
    // },
    numOfReviews:{
        type:Number,
        default:0
    },
    // reviews:[
    //     {
    //         name:{
    //             type:String,
    //             required:true        
    //         },
    //         rating:{
    //             type:String,
    //             required:true        
    //         },
    //         Comment:{
    //             type:String,
    //             required:true        
    //         }
    //     }
    // ],
    createBy:{
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