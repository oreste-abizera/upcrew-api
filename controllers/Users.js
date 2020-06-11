const { User } = require("../models/User");
const { hashPassword } = require("../utils/hash.js");
const { checkValidUser } = require("../utils/functions");
const ErrorResponse = require("../utils/ErrorResponse");
const { asyncHandler } = require("../middlewares/async");
const Joi = require("joi");

// @desc                getting all users
//@route                GET /api/v1/users
// @access              private route
exports.getUsers = asyncHandler(async (req, res, next) => {
  let users = await User.find().populate("classes");
  if (!users) {
    return next(new ErrorResponse("no users found", 404));
  }
  res.json({
    success: true,
    count: users.length,
    data: users,
  });
});

// @desc                getting single user
//@route                GET /api/v1/users/:id
// @access              private route
exports.getSingleUser = asyncHandler(async (req, res, next) => {
  // let user = await User.findById(req.params.id)
  let user = await checkValidUser(req.params.id);
  if (!user.valid) {
    return next(
      new ErrorResponse(`user with id ${req.params.id} not found`, 404)
    );
  }
  res.status(200).json({
    success: true,
    data: user.user,
  });
});

// @desc                updating user info
//@route                PUT /api/v1/users/:id
// @access              private route
exports.updateUser = asyncHandler(async (req, res, next) => {
  // const user = await User.findById(req.params.id)
  let user = await checkValidUser(req.params.id);
  if (!user.valid) {
    return next(
      new ErrorResponse(`user with id ${req.params.id} not found`, 404)
    );
  }

  let updates = { ...req.body };
  const { error } = validateUserBeforeUpdate(req.body);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 404));
  }
  if (updates.userPassword) {
    updates.userPassword = await hashPassword(updates.userPassword);
  }

  //validating father and mother
  if (updates.father) {
    let father = await checkValidUser(updates.father);
    if (!father.valid) {
      return next(
        new ErrorResponse(
          `father id '${updates.father}' not registered to any account`,
          400
        )
      );
    }
    if (father.user.gender !== "male") {
      return next(new ErrorResponse(`father provided is not male`, 400));
    }

    if (father.user.type !== "parent") {
      return next(
        new ErrorResponse(
          `father provided with id of ${updates.father} is not registered as a parent`,
          400
        )
      );
    }
  }

  if (updates.mother) {
    let mother = await checkValidUser(updates.mother);
    if (!mother.valid) {
      return next(
        new ErrorResponse(
          `mother id '${updates.mother}' not registered to any account`,
          400
        )
      );
    }
    if (mother.user.gender !== "female") {
      return next(new ErrorResponse(`mother provided is not female`, 400));
    }

    if (mother.user.type !== "parent") {
      return next(
        new ErrorResponse(
          `mother provided with id of ${updates.mother} is not registered as a parent`,
          400
        )
      );
    }
  }

  updates = await User.findByIdAndUpdate(req.params.id, updates, { new: true });

  res.json({
    success: true,
    data: updates,
  });
});

// @desc                delete user
//@route                DELETE /api/v1/users/:id
// @access              private route
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`user with id ${req.params.id} not found`, 404)
    );
  }
  await User.findOneAndDelete({ _id: req.params.id });
  res.json({
    success: true,
    data: {},
  });
});

//function to validate info before update
const validateUserBeforeUpdate = (User) => {
  const schema = {
    firstName: Joi.string().max(255).min(2),
    lastName: Joi.string().max(255).min(2),
    userName: Joi.string().max(255).min(2),
    userEmail: Joi.string().max(255).min(3).email(),
    userPassword: Joi.string().max(255).min(6),
    type: Joi.string().min(1).max(9),
    dateOfBirth: Joi.date(),
    userCountry: Joi.string().max(255).min(2),
    gender: Joi.string().min(4).max(6),
    phoneNumber: Joi.string().min(10).max(10),
    currentClass: Joi.string(),
    classTeacher: Joi.string(),
    occupation: Joi.string().min(2).max(255),
    father: Joi.string(),
    mother: Joi.string(),
    image: Joi.string(),
    children: Joi.array(),
  };
  return Joi.validate(User, schema);
};
