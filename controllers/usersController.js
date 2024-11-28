// Import users collection
const users = require('../models/allUsersSchema');

// function to generate unique id for jobseeker and company
const generateUniqueId = async () => {
    let uniqueId;
    let isUnique = false;
    while (!isUnique) {
        uniqueId = `USER${Math.floor(Math.random() * 99999) + 10000}`; // 6-digit ID
        const exists = await users.findOne({ userId: uniqueId });
        if (!exists) {
            isUnique = true;
        }
    }
    return uniqueId;
}

// API to create jobseeker account
exports.signUp = async (req, res) => {
    const userData = req.body;
    
    try {
        const checkUser = await users.findOne({ email: userData.email });
        if (checkUser) {
            return res.status(404).json({ message: "This account already exists. Please log in instead." });
        } else {
            const uniqueUserId = await generateUniqueId();
            const newData = { userId: uniqueUserId, ...userData }
            
            const newUser = new users(newData);
            await newUser.save()
            res.status(200).json({ message: "Account created successfully. Welcome aboard!"});
        }
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
