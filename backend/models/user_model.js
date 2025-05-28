const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { use } = require('../app');

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long'],
            maxlength: [50, 'First name must be at most 50 characters long']
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long'],
            maxlength: [50, 'Last name must be at most 50 characters long']
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        minlength: [5, 'Email must be at least 5 characters long'],
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    socialId: {
        type: String,
        unique: true,
        sparse: true
    },
    // phoneNumber: {
    //     type: String,
    //     required: true
    // },
    // profilePicture: {
    //     type: String,
    //     default: ''
    // },
    // isDriver: {
    //     type: Boolean,
    //     default: false
    // }
}, { timestamps: true });

// take  only id & return jwt token for user authentication
userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

userSchema.methods.comparePassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;