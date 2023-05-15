const ErrorHander = require('../utils/errorHander');

module.exports = (req,res,next,err)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    console.log(err)
    // Wrong mongoDB id error
    if(err.name== "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHander(message,400);
    }
 
    res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
}