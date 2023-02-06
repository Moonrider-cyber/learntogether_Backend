const express = require("express");
const app = express();
const cookieParser = require('cookie-parser')

const errorMiddleware = require('./middleware/error');

app.use(express.json());
app.use(cookieParser());

// route imports
const courseroute = require("./routes/CourseRoute")
const userroute = require("./routes/UserRoute")

app.use("/api/v1",courseroute);
app.use("/api/v1",userroute);

// Middleware for errors
app.use(errorMiddleware);

module.exports = app

