// import mongoose
const mongoose = require('mongoose')

// Define schema for jobs collection
const jobsSchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true,
        unique: true
    },
    companyId: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    companyLogo: {
        type: String,
        required: true,
    },
    jobTitle: {
        type: String,
        required: true
    },
    jobDesc: {
        type: String,
        required: true
    },
    modeOfWork: {
        type: String,
        required: true
    },
    empType: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    qualification: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    salaryFrom: {
        type: Number,
        required: true
    },
    salaryTo: {
        type: Number,
        required: true
    },
    otherDetails: {
        type: String
    },
    applyLink: {
        type: String,
        required: true
    },
    lastDateToApply: {
        type: String
    },
    date: {
        type: String,
        required: true
    },
    skills: [],
    status: {
        type: String,
        required: true
    },
    applications: [],
    reports: []
})

// Create a model to store jobs
const jobs = new mongoose.model('jobs', jobsSchema)

// Export jobs
module.exports = jobs