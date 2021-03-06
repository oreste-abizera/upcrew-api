const path = require("path");
const { User } = require("../models/User");
const { hashPassword } = require("../utils/hash.js");
const { checkValidUser } = require("../utils/functions");
const ErrorResponse = require("../utils/ErrorResponse");
const { asyncHandler } = require("../middlewares/async");

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

// @desc                uploading a profile picture
//@route                PUT /api/v1/users/:id/photoupload
// @access              private route
exports.updatePicture = asyncHandler(async (req, res, next) => {
  console.log("BODY: ".green.inverse, req.body);

  let user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(`user with id ${req.params.id} not found`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`please upload an image`, 400));
  }

  const file = req.files.file;

  console.log(file);
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  file.name = `photo_${user._id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse("problem while uploading an image", 500));
    }
  });

  let finalUser = await User.findByIdAndUpdate(req.params.id, {
    image: file.name,
  });
  res.status(200).json({
    success: true,
    data: finalUser,
  });
});
