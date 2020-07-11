const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minlength: [2, "First name can not be less than 2 characters"],
      maxlength: [255, "First name must not be greater than 255 characters"],
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      minlength: [2, "Last name can not be less than 2 characters"],
      maxlength: [255, "Last name must not be greater than 255 characters"],
      required: [true, "Last name is required"],
      trim: true,
    },
    userName: {
      type: String,
      minlength: [2, "Username can not be less than 2 characters"],
      maxlength: [255, "Username must not be greater than 255 characters"],
      required: [true, "Username is required"],
      unique: [true, "username already taken"],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    userCountry: {
      type: String,
      minlength: [2, "Country can not be less than 2 characters"],
      maxlength: [255, "Country must not be greater than 255 characters"],
    },
    userEmail: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    userPassword: {
      type: String,
      minlength: 6,
      required: true,
      select: false,
    },
    type: {
      type: String,
      enum: ["student", "teacher", "librarian", "parent"],
      default: "student",
    },
    phoneNumber: {
      type: String,
    },
    children: {
      type: [String],
      select: false,
    },
    currentClass: {
      type: String,
      ref: "Class",
    },
    classTeacher: String,
    father: mongoose.Schema.ObjectId,
    mother: mongoose.Schema.ObjectId,
    image: String,
    occupation: {
      type: String,
      min: 2,
      max: 255,
    },
    resetPasswordToken: String,
    resetPasswordExpire: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//sign Jwt
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

//match password
UserSchema.methods.comparePasswords = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.userPassword);
};

//virtual classes field
UserSchema.virtual("classes", {
  ref: "Class",
  localField: "_id",
  foreignField: "classTeacher",
  justOne: false,
});

const User = mongoose.model("User", UserSchema);
module.exports.User = User;
