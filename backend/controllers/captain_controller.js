const captionModel = require('../models/captain.model');
const captionService = require('../services/captain_service');
const { validationResult } = require('express-validator');
const blacklistTokenSchema = require('../models/blacklistToken.model');

module.exports.registerCaption = async (req, res, next) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { fullname, email, password, vehicle } = req.body;
        const { firstname, lastname } = fullname;
        const { color, plate, capacity, vehicleType } = vehicle;

        const isCaptainExists = await captionModel.findOne({ email });
        if (isCaptainExists) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashPassword = await captionModel.hashPassword(password);

        // Create a new captain
        const captain = await captionService.createCaptain({
            firstname,
            lastname,
            email,
            password: hashPassword,
            color,
            plate,
            capacity,
            vehicleType
        });

        // Generate auth token
        const token = await captain.generateAuthToken();

        res.status(201).json({ token, captain });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.loginCaption = async (req, res, next) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // Find the captain by email
        const captain = await captionModel.findOne({ email }).select('+password');;
        if (!captain) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Compare the password
        const isMatch = await captain.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate auth token
        const token = await captain.generateAuthToken();

        res.cookie('token', token);

        res.status(200).json({ token, captain });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.getCaptionProfile = async (req, res, next) => {
    try {
        const captain = req.captain; // Captured from authCaptain middleware
        if (!captain) {
            return res.status(404).json({ error: 'Captain not found' });
        }

        res.status(200).json({ captain });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports.logoutCaption = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(400).json({ error: 'No token provided' });
        }

        // Blacklist the token
        await blacklistTokenSchema.create({token});

        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}