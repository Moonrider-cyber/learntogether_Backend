const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors');

const errorMiddleware = require('./middleware/error');

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    
}));

// route imports
const courseroute = require("./routes/CourseRoute")
const userroute = require("./routes/UserRoute")

app.use("/api/v1",courseroute);
app.use("/api/v1",userroute);

app.use("/", (req, res) => { res.send(`server is working frontend in ${process.env.FRONTEND_URL}`); });

// Middleware for errors
app.use(errorMiddleware);

module.exports = app

