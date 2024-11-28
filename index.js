// Automatically load .env file into the application
require('dotenv').config()
const path = require('path')

// import express
const express = require('express') 

// import cors
const cors = require('cors')

// import connection.js
require('./connection')

// import router
const router = require('./routes/router')

// Create an application using the express
const server = express()

// Define the port
const PORT = 5000

// Use cors in server application
server.use(cors())
server.use(express.json())
server.use(router)

// Serve static files in the uploads folder
server.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Run the application
server.listen(PORT,()=>{
    console.log("Listening on the port "+PORT);
})

// define routes
server.get('/',(req,res)=>{
    res.status(200).json("WorkNow service started.")
})