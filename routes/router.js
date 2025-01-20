// import express
const express = require('express');
const path = require('path')
const multer = require('multer');

// Configure Multer for Image uploads
const uploadImg = multer({ dest: 'uploads/' });

// Configure Multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder to save PDFs
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadPdf = multer({ storage });

const tokenAuth = require('../middleware/auth')

const commonController = require('../controllers/commonController')
const userController = require('../controllers/usersController')
const companyController = require('../controllers/companyController')
const adminController = require('../controllers/adminController')
// Using express create object for router class inorder to setup path
const router = new express.Router()

router.post('/getVerificationCode', commonController.getVerificationCode)
router.post('/imageUpload', uploadImg.single('image'), commonController.uploadImage)
router.post('/pdfUpload', uploadPdf.single('pdf'), commonController.uploadPdf)
router.post('/passwordHashing', commonController.passwordHashing)
router.post('/signUp', userController.signUp)
router.post('/registerCompany', companyController.companyRegister)
router.post('/login', commonController.login)
router.post('/adminAccount', adminController.adminAcc)
router.post('/postAJob', tokenAuth, companyController.postJob)
router.get('/getAllJobs', tokenAuth, userController.getAllJobs)

module.exports = router
