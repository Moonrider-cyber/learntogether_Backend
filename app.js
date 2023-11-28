const express = require("express");
const app = express();

// config for env variables
const dotenv = require('dotenv');
dotenv.config({path:"config.env"});

const cookieParser = require('cookie-parser')
const cors = require('cors');

const errorMiddleware = require('./middleware/error');



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    optionSuccessStatus:200,
}));
// Middleware for errors
app.use(errorMiddleware);


// route imports
const courseroute = require("./routes/CourseRoute")
const userroute = require("./routes/UserRoute")
const categoryroute = require("./routes/CategoryRoute")

app.use("/api/v1",courseroute);
app.use("/api/v1",userroute);
app.use("/api/v1",categoryroute);

app.get('/',(req,res)=>{
    res.send(`WELCOME TO BUSILEARN BACKEND`);
});


module.exports = app
