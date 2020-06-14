const { Question } = require("../models/Question");
const { asyncHandler } = require("../middlewares/async");
const ErrorResponse = require("../utils/ErrorResponse");

// @desc                getting all questions
//@route                GET /api/v1/questions
// @access              private route
exports.getQuestions = asyncHandler(async (req, res, next) => {
  let questions = await Question.find();
  if (!questions) {
    return next(new ErrorResponse("no questions found", 404));
  }
  res.json({
    success: true,
    count: questions.length,
    data: questions,
  });
});

// @desc                getting single question
//@route                GET /api/v1/questions/:id
// @access              private route
exports.getSingleQuestion = asyncHandler(async (req, res, next) => {
  let question = await Question.findById(req.params.id);
  if (!question) {
    return next(
      new ErrorResponse(`no question with id ${req.params.id} found`, 404)
    );
  }
  res.json({
    success: true,
    data: question,
  });
});

// @desc                create question
//@route                POST /api/v1/questions
// @access              private route
exports.createQuestion = asyncHandler(async (req, res, next) => {
  let createdQuestion = await Question.create(req.body);
  if (!createdQuestion) {
    return next(
      new ErrorResponse("error occured while creating the question", 404)
    );
  }
  res.json({
    success: true,
    data: createdQuestion,
  });
});

// @desc                updating question info
//@route                PUT /api/v1/questions/:id
// @access              private route
exports.updateQuestion = asyncHandler(async (req, res, next) => {
  let updatedQuestion = await Question.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!updatedQuestion) {
    return next(
      new ErrorResponse(`no question with id of ${req.params.id} found`, 404)
    );
  }
  res.json({
    success: true,
    data: updatedQuestion,
  });
});

// @desc                deleting question
//@route                DELETE /api/v1/questions/:id
// @access              private route
exports.deleteQuestion = asyncHandler(async (req, res, next) => {
  let deletedQuestion = await Question.findByIdAndDelete(req.params.id);
  if (!deletedQuestion) {
    return next(
      new ErrorResponse(`no question with id of ${req.params.id} found`, 404)
    );
  }
  res.json({
    success: true,
    data: {},
  });
});
