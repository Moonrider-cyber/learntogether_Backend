const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter category title"],
        minLength:[4,"Password should have more then 4 charaters"],
        maxLength:[20,"price cannot exceed 80 characters"],
        trim:true
    },
    active:{
        type:Boolean,
        default:true,
    },
    description:{
        type:String,
        required:[true,"please enter course description"],    
        minLength:[30,"Password should have more then 30 charaters"]
    },
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

module.exports = mongoose.model("course",categorySchema);