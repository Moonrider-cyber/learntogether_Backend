const app = require('./app.js');
const dotenv = require('dotenv');
// const connectDatabase = require("./config/database")
// const cloudinary = require("cloudinary")

// Handling Uncaught exception
// process.on("uncaughtException",err=>{
//     console.log(`error: ${err.message}`);

//     console.log("shutting down the server due to Uncaught exception");
//     process.exit(1);
// });


// config
dotenv.config({path:"config.env"});

// connect database
// connectDatabase();

// cloudinary.v2.config({
//     cloud_name:process.env.CLOUDINARY_NAME,
//     api_key:process.env.CLOUDINARY_API_KEY,
//     api_secret:process.env.CLOUDINARY_API_SECRET,
// });






const server = app.listen(8000,()=>{
    console.log('server runing on',process.env.PORT);
})

// unhandled Promise Rejection
// process.on('unhandledRejection',err=>{
//     console.log(`error: ${err.message}`);
//     console.log("shutting down the server due to unhadled promise rejection");

//     server.close(()=>{
//         process.exit(1);
//     });
// });