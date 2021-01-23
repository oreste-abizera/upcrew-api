const mongoose = require("mongoose");

const LectureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Lecture title is required"],
  },
  course: {
    type: mongoose.Schema.ObjectId,
    required: [true, "add a lecture course"],
    ref: "Course",
  },
  teacher: {
    type: mongoose.Schema.ObjectId,
    required: [true, "add lecture owner"],
    ref: "User",
  },
});

module.exports.Lecture = mongoose.model(LectureSchema);
