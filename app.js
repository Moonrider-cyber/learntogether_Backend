const express = require("express");
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser')
const cors = require('cors');

const errorMiddleware = require('./middleware/error');


// config for env variables
dotenv.config({path:"config.env"});


app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    optionSuccessStatus:200,

}));

// route imports
const courseroute = require("./routes/CourseRoute")
const userroute = require("./routes/UserRoute")

app.get("/", (req, res) => { 
    res.send(`server is working frontend in`); 
});

app.use("/api/v1",courseroute);
app.use("/api/v1",userroute);


// Middleware for errors
app.use(errorMiddleware);

module.exports = app
