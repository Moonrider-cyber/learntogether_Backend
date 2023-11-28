const mongoose = require('mongoose');
const validator = require('validator');
const byrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');

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
        enum:["super-admin","sub-admin","user","instructor"],
        default:"user",
    },
    active:{
        type:Boolean,
        default:true,
    },
    subscription:{
        id:String,
        status:String,
    },
    cart:[
        {
            course:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"course",
            },
            poster: String
        },
    ],
    createAt:{
        type:Date,
        default: Date.now,
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date
});

userSchema.pre('save',async function(next){

    if(!this.isModified("password")){
        next();
    }
    this.password = await byrypt.hash(this.password,10);
});

// jwt token
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this.id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE,
    });
}

// compare password
userSchema.methods.comparePassword = async function(enterdpassword){
    return await byrypt.compare(enterdpassword,this.password);
};

//genrating password reseting token

userSchema.methods.getResetPwdToken = async function(){ 

    //genrating token
    const resetToken =  crypto.randomBytes(20).toString("hex");
    // console.log("reset token before encript",resetToken);
    
    // hasing and ading resetPasswordToken to userSchema
    this.resetPasswordToken = crypto.createHmac("sha256",process.env.JWT_SECRET).update(resetToken).digest("hex");
    
    // console.log("reset token after encript",this.resetPasswordToken);
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return this.resetPasswordToken;
}

// export
module.exports = mongoose.model("User",userSchema);
