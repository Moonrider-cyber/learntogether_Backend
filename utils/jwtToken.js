// createing token and saving in cookie

const sendToken = (user,statusCode,res,message)=>{
    const token  = user.getJWTToken();

    // opction for cookie 
    const options = {
        expiredate : new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure:true,
        sameSite:'none'
    }

    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        token,
        message,
        user
    })
}

module.exports = sendToken;