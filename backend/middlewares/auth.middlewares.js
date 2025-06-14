const userModel = require('../models/user_model');
const blacklistTokenModel = require('../models/blacklistToken.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const captionModel = require('../models/captain.model');

module.exports.authUser = async (req, res, next) => {
    // Middleware to authenticate user using JWT
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied.' });
    }

    // Check if the token is blacklisted
    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        req.user = user; // Attach user to request object
        return next(); // Proceed to the next middleware or route handler
    }catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Access denied.' });
    }
}

module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if( !token ) {
        return  res.status(401).json({ message: 'Access denied.' });
    }

    const isBlacklisted = await blacklistTokenModel.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captionModel.findById(decoded._id);
        if (!captain) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.captain = captain; // Attach captain to request object
        return next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Access denied.' });
    }

}