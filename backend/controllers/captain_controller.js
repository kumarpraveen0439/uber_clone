const captionModel = require('../models/captain.model');
const captionService = require('../services/captain_service');
const { validationResult } = require('express-validator');

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