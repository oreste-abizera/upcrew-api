const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
  question_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Question",
    required: [true, "add a question where the result belongs"],
  },
  answer: {
    type: String,
  },
  score: {
    type: Number,
    required: true,
    required: [true, "add score of the student on this question"],
  },
  student_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "add the student with this result"],
  },
});

// Prevent user from submitting more than one answer per question
ResultSchema.index({ question_id: 1, student_id: 1 }, { unique: true });

module.exports.Result = mongoose.model("Result", ResultSchema);
