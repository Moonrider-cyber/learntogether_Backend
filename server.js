const app = require('./app.js')
const dotenv = require('dotenv');
const connectDatabase = require("./config/database")

// Handling Uncaught exception
process.on("uncaughtException",err=>{
    console.log(`error: ${err.message}`);

    console.log("shutting down the server due to Uncaught exception");
    process.exit(1);
});


//config
dotenv.config({path:"config.env"});

// connect database
connectDatabase();

const server = app.listen(process.env.PORT,()=>{
    console.log('server runing on',process.env.PORT);
})


// unhandled Promise Rejection
process.on('unhandledRejection',err=>{
    console.log(`error: ${err.message}`);
    console.log("shutting down the server due to unhadled promise rejection");

    server.close(()=>{
        process.exit(1);
    });
});