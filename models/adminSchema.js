// import mongoose
const mongoose = require('mongoose')

// Define schema for user collection
const adminSchema = new mongoose.Schema({
    adminId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    imageURL: {
        type: String
    },
    allMessages: []
})

// Create a model to store admin
const admin = new mongoose.model('admin', adminSchema)

// Export admin
module.exports = admin