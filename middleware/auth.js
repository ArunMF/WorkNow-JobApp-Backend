const jwt = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {
    const token = req.header("Authorization")

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token with secret
        req.user = decoded; // Attach user info to the request object
        next();
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};

module.exports = authMiddleware;