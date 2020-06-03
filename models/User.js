const mongoose = require("mongoose")
const Joi = require("joi")

const UsersSchema = new mongoose.Schema({
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
        minlength: [6, 'password must be greater than 6 characters'],
        required: true,
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
        minlength: [10, "phone number must be 10 characters"],
        maxlength: [10, "phone number must be 10 characters"],
    },
    children: {
        type: [String]
    },
    currentClass: String,
    classTeacher: String,
    father: String,
    mother: String,
    image: String,
    occupation: {
        type: String,
        min: 2,
        max: 255
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})


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

const User = mongoose.model("User", UsersSchema)
module.exports.User = User
module.exports.validateUser = validateUser