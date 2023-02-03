const express = require("express");
const app = express();

const errorMiddleware = require('./middleware/error');

app.use(express.json());

// route imports
const course = require("./routes/CourseRoute")

app.use("/api/v1",course)

// Middleware for errors
app.use(errorMiddleware);

module.exports = app
