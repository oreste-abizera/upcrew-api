const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  quiz_id: {
    type: mongoose.Schema.ObjectId,
    ref: "Assignment",
    required: [true, "add an assignment where the question belongs"],
  },
  type: {
    type: String,
    enum: ["MCQ", "TEXT"],
    required: [true, "add a type of question: 'MCQ' or 'TEXT'"],
  },
  question: {
    type: String,
    min: [4, "question title must be at least 4 characters"],
    required: [true, "add a question title"],
  },
  options: {
    type: Array,
    default: [],
    required: true,
  },
  answer: {
    type: String,
    required: [true, "add answer of the question"],
  },
  score: {
    type: Number,
    required: true,
    required: [true, "add score of the question"],
  },
});

module.exports.Question = mongoose.model("Question", QuestionSchema);
