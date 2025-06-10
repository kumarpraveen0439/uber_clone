const captionModel = require('../models/captain.model');

module.exports.createCaptain = async ({ firstname, lastname, email, password, color, plate, capacity, vehicleType }) => {
    if (!firstname  || !lastname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }

    try {
        const captain = await captionModel.create({
            fullname:{
                firstname,
                lastname
            },
            email,
            password,
            vehicle: {
                color,
                plate,
                capacity,
                vehicleType
            }
        });
        return captain;
    } catch (error) {
        if (error.code === 11000) {
            throw new Error('Email already exists');
        }
        throw new Error('Error creating captain');
    }
}