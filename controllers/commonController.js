require('dotenv').config();
// Import users collection
const users = require('../models/allUsersSchema');
const nodemailer = require('nodemailer');
const companies = require('../models/companySchema');
const admins = require('../models/adminSchema')

const jwt = require('jsonwebtoken')

const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// bcrypt is used for password hashing
const bcrypt = require('bcrypt');

// Function to generate a 6-digit code
function generateCode() {
    return Math.floor(Math.random() * (999999 - 100000)) + 100000;
}

// Function to send verification code to given email
function sendEmail(name, email, verificationCode, res) {

    // Create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Set up email data
    let mailOptions = {
        from: '"WorkNow" <arpes902@gmail.com>',
        to: email,
        subject: 'Verify Your Email Address',
        html: `
            <div>
                <img src='https://i.postimg.cc/3wgBJQz4/logo-For-Mail.png' height='35' />
                <div style="margin:5px;">
                <p>Hello ${name},</p>
                <p>Welcome to WorkNow! To complete the setup of your account, please verify your email address by entering the code below:</p>
                <p>Verification Code: <b style:"color:black;">${verificationCode}</b></p>
                <p>Please enter this code on the email verification page to confirm your email address.</p>
                <p>Thankyou!</p>
                </div>
            </div>
            `
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return res.status(500).json({ error: error.message });
        } else {
            return res.status(200).json({ message: "Verification code sent to your email. Please check your inbox.", verificationCode, info });
        }
    });
}

// API to get verification code
exports.getVerificationCode = async (req, res) => {
    const verificationCode = generateCode();
    const { name, email } = req.body;

    try {
        const checkJobSeeker = await users.findOne({ email });
        const checkCompany = await companies.findOne({ email });
        const checkAdmin = await admins.findOne({ email });
        if (checkJobSeeker || checkAdmin) {
            return res.status(404).json({ message: "This account already exists. Please log in instead." });
        } else if (checkCompany) {
            if (checkCompany.statusOfRequest == "approved") {
                return res.status(404).json({ message: "This account already exists. Please log in instead." });
            } else if (checkCompany.statusOfRequest == "pending") {
                return res.status(404).json({ message: "This account is awaiting administrative approval. Please wait for a while. We will update you as soon as the process is complete." });
            }
        } else {
            sendEmail(name, email, verificationCode, res);
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// API to upload image
exports.uploadImage = async (req, res) => {
    try {
        // Upload the image file to Cloudinary using the path from multer
        const cloudResult = await cloudinary.uploader.upload(req.file.path);

        res.status(200).json({ message: "Image uploaded", imageUrl: cloudResult.secure_url });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: "Image upload failed", error: error.message });
    }
}

// API to upload pdf
exports.uploadPdf = (req, res) => {
    try {
        // Construct URL to access the uploaded PDF
        const pdfUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        res.status(200).json({ message: 'PDF uploaded successfully', url: pdfUrl })
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// API for password hashing
exports.passwordHashing = async (req, res) => {
    const { password } = req.body
    try {
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        res.status(200).json({ message: "Password hashed.", hashedPassword })
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// API to Login to account
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const jobSeeker = await users.findOne({ email })
        const company = await companies.findOne({ email })
        const admin = await admins.findOne({ email })

        const jwtSecretKey = process.env.JWT_SECRET;

        // Checking if it is a job seeker
        if (jobSeeker) {
            const isMatch = await bcrypt.compare(password, jobSeeker.password)
            if (isMatch) {
                // Extract necessary fields to create the token payload
                const payload = {
                    id: jobSeeker._id,
                    email: jobSeeker.email
                };
                const token = jwt.sign(payload, jwtSecretKey)
                res.status(200).json({ message: "Login Successful! Welcome back.", token, data: jobSeeker })
            } else {
                return res.status(404).json({ message: "Wrong password!", errCode:404 });
            }
        }

        // Checking if it is a company
        else if (company) {
            const isMatch = await bcrypt.compare(password, company.password)
            if (isMatch) {
                if (company.statusOfRequest == "approved") {
                    const payload = {
                        id: company._id,
                        email: company.email
                    };
                    const token = jwt.sign(payload, jwtSecretKey)
                    res.status(200).json({ message: "Login Successful! Welcome back.", token, data: company })
                } else if (company.statusOfRequest == "pending") {
                    return res.status(401).json({ message: "This account is awaiting administrative approval. Please wait for a while. We will update you as soon as the process is complete.", errCode:405 });
                }
            } else {
                return res.status(404).json({ message: "Wrong password!", errCode:404 });
            }
        } 

        // Checking if it is an admin
        else if (admin) {
            const isMatch = await bcrypt.compare(password, admin.password)
            if (isMatch) {
                const payload = {
                    id: admin._id,
                    email: admin.email
                };
                const token = jwt.sign(payload, jwtSecretKey)
                res.status(200).json({ message: "Login Successful! Welcome back.", token, data: admin })
            } else {
                return res.status(404).json({ message: "Wrong password!", errCode:404 });
            }
        }
        else {
            return res.status(404).json({ message: "Account not found. Please check your email and try again.", errCode:404 });
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
