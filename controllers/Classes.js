const { asyncHandler } = require("../middlewares/async");
const ErrorResponse = require("../utils/ErrorResponse");
const { Class } = require("../models/Class");

// @desc                getting all classes
//@route                GET /api/v1/classes
// @access              private route
exports.getClasses = asyncHandler(async (req, res, next) => {
  let classes = await Class.find();
  if (!classes) {
    return next(new ErrorResponse("no classes found", 404));
  }
  res.json({
    success: true,
    count: classes.length,
    data: classes,
  });
});

// @desc                getting single class
//@route                GET /api/v1/classes/:id
// @access              private route
exports.getSingleClass = asyncHandler(async (req, res, next) => {
  let singleClass = await Class.findById(req.params.id);
  if (!singleClass) {
    return next(
      new ErrorResponse(`no class with id ${req.params.id} found`, 404)
    );
  }
  res.json({
    success: true,
    data: singleClass,
  });
});

// @desc                creating a class
//@route                POST /api/v1/classes
// @access              private route
exports.createClass = asyncHandler(async (req, res, next) => {
  let singleClass = await Class.create(req.body);
  res.json({
    success: true,
    data: singleClass,
  });
});

// @desc                deleting a class
//@route                DELETE /api/v1/classes/:id
// @access              private route
exports.deleteClass = asyncHandler(async (req, res, next) => {
  let deletedClass = await Class.findById(req.params.id);
  if (!deletedClass) {
    return next(
      new ErrorResponse(`class with id ${req.params.id} not found`),
      404
    );
  }

  deletedClass.remove();
  res.json({
    success: true,
    data: {},
  });
});

// @desc                updating a class
//@route                PUT /api/v1/classes/:id
// @access              private route
exports.updateClass = asyncHandler(async (req, res, next) => {
  let updatedClass = await Class.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedClass) {
    return next(
      new ErrorResponse(`class with id ${req.params.id} not found`),
      404
    );
  }
  res.json({
    success: true,
    data: updatedClass,
  });
});
