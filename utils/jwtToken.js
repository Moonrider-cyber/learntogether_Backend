// createing token and saving in cookie

const sendToken = (user,statusCode,res,message,tokenname = "token")=>{
    const token  = user.getJWTToken();

    // opction for cookie 
    const options = {
        expiredate : new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: false,
        secure:false, // change to true when deploy on https
        // sameSite:'none'
    }



    res.status(statusCode).cookie(tokenname,token,options).json({
        success:true,
        token,
        message,
        user
    });
}

module.exports = sendToken;