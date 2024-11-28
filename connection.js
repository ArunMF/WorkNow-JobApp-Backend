// Connecting node and mongodb

const mongoose = require('mongoose')
const DB = process.env.CONNECTION_URL

// Connection code
mongoose.connect(DB).then(() => {
    console.log("Database connection established.");
}).catch((err)=>{
    console.log(err);
})