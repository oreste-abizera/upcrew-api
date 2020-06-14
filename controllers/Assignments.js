const { asyncHandler } = require("../middlewares/async");
const ErrorResponse = require("../utils/ErrorResponse");
const { Assignment } = require("../models/Assignment");

// @desc                getting all assignments
//@route                GET /api/v1/assignments
// @access              private route
exports.getAssignments = asyncHandler(async (req, res, next) => {
  let assignments = await Assignment.find();
  if (!assignments) {
    return next(new ErrorResponse("no assignments found", 404));
  }
  res.json({
    success: true,
    count: assignments.length,
    data: assignments,
  });
});

// @desc                getting single assignment
//@route                GET /api/v1/assignments/:id
// @access              private route
exports.getSingleAssignment = asyncHandler(async (req, res, next) => {
  let singleAssignment = await Assignment.findById(req.params.id);
  if (!singleAssignment) {
    return next(
      new ErrorResponse(`no assignment with id ${req.params.id} found`, 404)
    );
  }
  res.json({
    success: true,
    data: singleAssignment,
  });
});

// @desc                creating an assignment
//@route                POST /api/v1/assignments
// @access              private route
exports.createAssignment = asyncHandler(async (req, res, next) => {
  let newAssignment = await Assignment.create(req.body);
  res.json({
    success: true,
    data: newAssignment,
  });
});

// @desc                deleting an assignment
//@route                DELETE /api/v1/assignments/:id
// @access              private route
exports.deleteAssignment = asyncHandler(async (req, res, next) => {
  let deletedAssignment = await Assignment.findById(req.params.id);
  if (!deletedAssignment) {
    return next(
      new ErrorResponse(`assignment with id ${req.params.id} not found`),
      404
    );
  }

  deletedAssignment.remove();
  res.json({
    success: true,
    data: {},
  });
});

// @desc                updating an assignment
//@route                PUT /api/v1/assignments/:id
// @access              private route
exports.updateAssignment = asyncHandler(async (req, res, next) => {
  let updatedAssignment = await Assignment.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedAssignment) {
    return next(
      new ErrorResponse(`assignment with id ${req.params.id} not found`),
      404
    );
  }
  res.json({
    success: true,
    data: updatedAssignment,
  });
});
