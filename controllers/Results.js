const { Result } = require("../models/Result");
const { Question } = require("../models/Question");
const { asyncHandler } = require("../middlewares/async");
const ErrorResponse = require("../utils/ErrorResponse");

// @desc                getting all results
//@route                GET /api/v1/results
// @access              private route
exports.getResults = asyncHandler(async (req, res, next) => {
  let results = await Result.find();
  if (!results) {
    return next(new ErrorResponse("no results found", 404));
  }
  res.json({
    success: true,
    count: results.length,
    data: results,
  });
});

// @desc                getting single result
//@route                GET /api/v1/results/:id
// @access              private route
exports.getSingleResult = asyncHandler(async (req, res, next) => {
  let result = await Result.findById(req.params.id);
  if (!result) {
    return next(
      new ErrorResponse(`no result with id ${req.params.id} found`, 404)
    );
  }
  res.json({
    success: true,
    data: result,
  });
});

// @desc                create result
//@route                POST /api/v1/results
// @access              private route
exports.createResult = asyncHandler(async (req, res, next) => {
  let createdResult = await Result.create({
    ...req.body,
    student_id: req.user._id,
  });
  if (!createdResult) {
    return next(
      new ErrorResponse("error occured while creating the result", 404)
    );
  }
  res.json({
    success: true,
    data: createdResult,
  });
});

// @desc                updating result info
//@route                PUT /api/v1/results/:id
// @access              private route
exports.updateResult = asyncHandler(async (req, res, next) => {
  let updatedResult = await Result.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedResult) {
    return next(
      new ErrorResponse(`no result with id of ${req.params.id} found`, 404)
    );
  }
  res.json({
    success: true,
    data: updatedResult,
  });
});

// @desc                deleting result
//@route                DELETE /api/v1/results/:id
// @access              private route
exports.deleteResult = asyncHandler(async (req, res, next) => {
  let deletedResult = await Result.findByIdAndDelete(req.params.id);
  if (!deletedResult) {
    return next(
      new ErrorResponse(`no result with id of ${req.params.id} found`, 404)
    );
  }
  res.json({
    success: true,
    data: {},
  });
});

// @desc                submit quiz
//@route                POST /api/v1/results/submitQuiz
// @access              private route
exports.submitQuiz = asyncHandler(async (req, res, next) => {
  let questions = await Question.find();
  let tempQuiz = [...req.body];
  tempQuiz.map((item) => {
    (item.question_id = item.id),
      (item.answer = item.value),
      (item.student_id = req.user._id);
    let question = questions.find((record) => {
      return record._id == item.id;
    });
    item.score = question.answer === item.value ? question.score : 0;
    return item;
  });
  let quizResults;
  try {
    quizResults = await Result.create(tempQuiz);
  } catch (error) {
    return next(error);
  }
  res.json({
    success: true,
    data: quizResults,
  });
});
