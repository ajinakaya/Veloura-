// Authentication middleware
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateToken = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied: No token provided' });
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(verified._id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        res.status(400).json({ error: 'Invalid token' });
    }
};

const authorizeRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
    }

    next();
};

module.exports = {
    authenticateToken,
    authorizeRole,
};