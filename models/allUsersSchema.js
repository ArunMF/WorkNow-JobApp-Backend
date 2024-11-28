// import mongoose
const mongoose = require('mongoose')

// Define schema for user collection
const usersSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
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
    phoneNo: {
        type: Number,
        required: true
    },
    imageURL: {
        type: String
    },
    qualification: {
        type: String,
        required: true
    },
    resumeURL: {
        type: String,
        required: true
    },
    savedJobs: [],
    appliedJobs: [],
    preferredJobs: [],
    followingCompanies: []
})

// Create a model to store users
const users = new mongoose.model('users', usersSchema)

// Export users
module.exports = users

