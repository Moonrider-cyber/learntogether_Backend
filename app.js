import express, { json, urlencoded } from "express";
const app = express();
// const cookieParser = require('cookie-parser')
// const cors = require('cors');

// const errorMiddleware = require('./middleware/error');

app.use(json());
// app.use(cookieParser());
app.use(urlencoded({ extended: true }));
// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
    
// }));

// route imports
// const courseroute = require("./routes/CourseRoute")
// const userroute = require("./routes/UserRoute")

app.get("/", (req, res) => { 
    res.send(`server is working frontend in`); 
});
app.use("/", (req, res) => {
    res.json(`from app.use is working`);
});
// app.use("/api/v1",courseroute);
// app.use("/api/v1",userroute);


// Middleware for errors
// app.use(errorMiddleware);

export default app

