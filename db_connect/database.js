const mongoose = require("mongoose");

module.exports = () =>{

    mongoose.set('strictQuery', true);
    mongoose.connect(process.env.MONGODB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
.then((data)=>{
    console.log(`Mongodb connected with server: ${data.connection.host}`);
})
.catch((err)=>{
    console.log(`Error: ${err.message}`);
    process.exit(2);    
})
}


