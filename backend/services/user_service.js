///user_service that intracts with database to create a user.
const userModel = require('../models/user_model');

module.exports.createUser = async ({ firstname, lastname, email, password })=>{
    if(!firstname || !email || !password){
        throw new Error('All fields are required');
    }
    try {
        const user = await userModel.create({
            fullname:{
                firstname,
                lastname
            },
            email,
            password
        })
        return user;
    }catch (error) {
        if (error.code === 11000) {
            throw new Error('Email already exists');
        }
        throw new Error('Error creating user');
    }
}