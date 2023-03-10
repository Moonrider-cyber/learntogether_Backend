const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"please enter category name"],
        minLength:[4,"category name should have more then 4 charaters"],
        maxLength:[20,"category cannot exceed 20 characters"],
        trim:true
    },
    active:{
        type:Boolean,
        default:true,
    },
    description:{
        type:String,
        required:[true,"please enter category description"],    
        minLength:[10,"catagory should have more then 10 charaters"]
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

module.exports = mongoose.model("catagory",categorySchema);