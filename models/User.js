const mongoose = require("mongoose")
const Joi = require("joi")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: [2, "First name can not be less than 2 characters"],
        maxlength: [255, "First name must not be greater than 255 characters"],
        required: [true, "First name is required"],
        trim: true
    },
    lastName: {
        type: String,
        minlength: [2, "Last name can not be less than 2 characters"],
        maxlength: [255, "Last name must not be greater than 255 characters"],
        required: [true, "Last name is required"],
        trim: true
    },
    userName: {
        type: String,
        minlength: [2, "Username can not be less than 2 characters"],
        maxlength: [255, "Username must not be greater than 255 characters"],
        required: [true, "Username is required"],
        unique: [true, "username already taken"],
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    userCountry: {
        type: String,
        minlength: [2, "Country can not be less than 2 characters"],
        maxlength: [255, "Country must not be greater than 255 characters"]
    },
    userEmail: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    gender: {
        type: String,
        enum: [
            'male',
            'female'
        ]
    },
    userPassword: {
        type: String,
        minlength: 6,
        required: true,
        select: false
    },
    type: {
        type: String,
        enum: [
            "student",
            "teacher",
            "librarian",
            "parent"
        ],
        default: "student",
    },
    phoneNumber: {
        type: String,
        minlength: 10,
        maxlength: 10,
    },
    children: {
        type: [String],
        select: false
    },
    currentClass: String,
    classTeacher: String,
    father: mongoose.Schema.ObjectId,
    mother: mongoose.Schema.ObjectId,
    image: String,
    occupation: {
        type: String,
        min: 2,
        max: 255
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


//sign Jwt
UserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({
        id: this._id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    })
}


//match password
UserSchema.methods.comparePasswords = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.userPassword)
}


//joi validation
const validateUser = (User) => {
    const schema = {
        firstName: Joi.string().max(255).min(2).required(),
        lastName: Joi.string().max(255).min(2).required(),
        userName: Joi.string().max(255).min(2).required(),
        userEmail: Joi.string().max(255).min(3).required().email(),
        userPassword: Joi.string().max(255).min(6).required(),
        type: Joi.string().min(1).max(9).default("student"),
        dateOfBirth: Joi.date(),
        userCountry: Joi.string().max(255).min(2).required(),
        gender: Joi.string().min(4).max(6).required(),
        phoneNumber: Joi.string().min(10).max(10),
        currentClass: Joi.string(),
        classTeacher: Joi.string(),
        occupation: Joi.string().min(2).max(255),
        father: Joi.string(),
        mother: Joi.string(),
        image: Joi.string(),
        children: Joi.array()
    }
    return Joi.validate(User, schema)
}

const User = mongoose.model("User", UserSchema)
module.exports.User = User
module.exports.validateUser = validateUser