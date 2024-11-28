const admins = require('../models/adminSchema')
const bcrypt = require('bcrypt');

// function to convert password to hashed password
function passwordBcrypt(password) {
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = bcrypt.hash(password, saltRounds)
    return hashedPassword;
}

// API to create admin account
exports.adminAcc = async (req, res) => {
    const data = req.body
    try {
        const hashPwd = await passwordBcrypt(data.password)
        const adminData = {
            adminId: data.adminId, name: data.name, email: data.email, password: hashPwd,
            role: data.role, imageURL: data.imageURL
        }

        const newAdmin = new admins(adminData)
        await newAdmin.save()
        res.status(200).json({ message: "Account created.", adminData })
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}