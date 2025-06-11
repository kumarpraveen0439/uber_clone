const userModel = require('../models/user_model');
const userService = require('../services/user_service');
const { validationResult  } = require('express-validator');
const blacklistTokenSchema = require('../models/blacklistToken.model');

module.exports.registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {fullname, email, password} = req.body;

    const isUserExists = await userModel.findOne({ email });
    if(isUserExists) {
        return res.status(400).json({ error: 'Email already exists' });
    }

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

module.exports.loginUser = async (req, res, next)  => {
    const errors = validationResult(req);console.log(errors,' errors');
    if(!errors.isEmpty())  {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email }).select('+password');
        if(!user) {
            return res.status(404).json({ message: 'Invalid email or password' });
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            return res.status(401).json({ message:  'Invalid email or password' });
        }
        //generate auth token
        const token = await user.generateAuthToken();
        res.cookie('token', token);
        res.status(200).json({ token, user });
    }catch (error) {
        console.error('Error logging in user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
}

module.exports.logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('token');
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        await blacklistTokenSchema.create({ token });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error logging out user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}