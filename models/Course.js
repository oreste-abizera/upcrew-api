const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, "course name must be at least 2 characters"],
    maxlength: 255,
    required: [true, "add a course name"],
    trim: true,
    unique: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Course = mongoose.model("Course", CourseSchema);
module.exports.Course = Course;
