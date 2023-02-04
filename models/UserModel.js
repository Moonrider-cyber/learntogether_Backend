const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  
    name:{
        type:String,
        require:[true,"Please Enter Your Name"],
        maxLength:[30,"Name cannot exceed 30 charaters"],
        minLength:[4,"Name should have more then 4 charaters"]
    },
    email:{
        type:String,
        require:[true,"Please Enter Your Name"],
        unique:true,
        validate:[validator.isEmail,"Please Enter A Valid Email"]
    },
    password:{
        type:String,
        require:[true,"Please Enter Your Password"],
        minLength:[8,"Password should have more then 8 charaters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date
});

module.exports = mongoose.model("User",userSchema);