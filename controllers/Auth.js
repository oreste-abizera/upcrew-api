const { User } = require("../models/User");
const { hashPassword } = require("../utils/hash.js");
const { getUserUniqueness, checkValidUser } = require("../utils/functions");
const ErrorResponse = require("../utils/ErrorResponse");
const { asyncHandler } = require("../middlewares/async");
const Joi = require("joi");

// @desc                create new user
//@route                POST /api/v1/auth/register
// @access              public route
exports.register = asyncHandler(async (req, res, next) => {
  //create user
  let newUser = { ...req.body };

  if (newUser.gender !== "") newUser.gender = newUser.gender.toLowerCase();
  newUser.userPassword = await hashPassword(newUser.userPassword);

  //@check uniqueness of the user details
  let checkUnique = await getUserUniqueness(newUser);
  if (checkUnique.unique === false) {
    next(new ErrorResponse(checkUnique.message, 400));
  }

  //validating father and mother
  if (newUser.father) {
    let father = await checkValidUser(newUser.father);
    if (!father.valid) {
      return next(
        new ErrorResponse(
          `father id '${newUser.father}' not registered to any account`,
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
          `father provided with id of ${newUser.father} is not registered as a parent`,
          400
        )
      );
    }
  }

  if (newUser.mother) {
    let mother = await checkValidUser(newUser.mother);
    if (!mother.valid) {
      return next(
        new ErrorResponse(
          `mother id '${newUser.mother}' not registered to any account`,
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
          `mother provided with id of ${newUser.mother} is not registered as a parent`,
          400
        )
      );
    }
  }

  newUser = await User.create(newUser);

  sendTokenResponse(newUser, 200, res);

  //end of create user
});

// @desc                login user
//@route                GET /api/v1/auth/login
// @access              private route
exports.login = asyncHandler(async (req, res, next) => {
  const { identifier, password } = req.body;
  var user = { identifier, password };
  let { error } = validate(user);
  if (error) {
    return next(new ErrorResponse(error.details[0].message, 400));
  }

  user = await User.findOne({ userEmail: identifier }).select("+userPassword");
  if (!user) {
    user = await User.findOne({ userName: identifier }).select("+userPassword");
  }

  if (user) {
    if (!(await user.comparePasswords(password))) {
      user = null;
    }
  }

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  sendTokenResponse(user, 200, res);

  //end of create user
});

//joi login data validator
const validate = (user) => {
  const schema = {
    identifier: Joi.string().required(),
    password: Joi.string().required(),
  };
  return Joi.validate(user, schema);
};

//get token from model, set cookies and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

// @desc                get loggedin user
//@route                POST /api/v1/auth/me
// @access              private route
exports.getMe = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc                update logged in user details
//@route                PUT /api/v1/auth/updateProfile
// @access              private route
exports.updateProfile = asyncHandler(async (req, res, next) => {
  let { userPassword, ...rest } = req.body;
  let user = await User.findByIdAndUpdate(req.user.id, rest, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc                update logged in user password
//@route                PUT /api/v1/auth/updatePassword
// @access              private route
exports.updatePassword = asyncHandler(async (req, res, next) => {
  let user = await User.findById(req.user.id).select("+userPassword");
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return next(
      new ErrorResponse(`add current password and new password`, 400)
    );
  }

  if (newPassword.length < 6) {
    return next(
      new ErrorResponse(`new password must be at least 6 characters`, 400)
    );
  }
  if (!(await user.comparePasswords(currentPassword))) {
    return next(new ErrorResponse(`invalid password`, 400));
  }

  user.userPassword = await hashPassword(newPassword);
  user.save();
  sendTokenResponse(user, 200, res);
});
