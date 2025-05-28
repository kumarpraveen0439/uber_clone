const userModel = require('../models/user_model');
const userService = require('../services/user_service');
const { validationResult  } = require('express-validator');

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors,' errors');
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {fullname, email, password} = req.body;

    const hashPassword = await userModel.hashPassword(password);//statics are available on the model itself (userModel)

    try {
        const user = await userService.createUser({firstname: fullname.firstname, lastname: fullname.lastname, email, password: hashPassword});
        //generate auth token
        const token = await user.generateAuthToken();//methods are available on document instances (user)

        res.status(201).json({
            token,
            user
        })
    }catch (error) {
        if (error.message === 'Email already exists') {
            return res.status(400).json({ error: error.message });
        }
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}