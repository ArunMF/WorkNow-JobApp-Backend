// import mongoose
const mongoose = require('mongoose')

// Define schema for company collection
const companySchema = new mongoose.Schema({
    companyId: {
        type: String,
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: true
    },
    abbreviatedName: {
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
    logo: {
        type: String,
        required: true
    },
    headquaters: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    aboutCompany: {
        type: String,
        required: true
    },
    companySize: {
        type: String
    },
    website: {
        type: String
    },
    documentForVerification: {
        type: String,
        required: true
    },
    coverPicture: {
        type: String
    },
    specialties: {
        type: String
    },
    empDetails: {
        empName: {
            type: String,
            required: true
        },
        empPosition: {
            type: String,
            required: true
        },
        empID: {
            type: String,
            required: true
        },
        empEmail: {
            type: String,
            required: true
        }
    },
    statusOfRequest: {
        type: String,
        required: true
    },
    followers: [],
    allMessages: [],
    companyReviews: []
})

// Create a model to store companies
const companies = new mongoose.model('companies', companySchema)

// Export companies
module.exports = companies