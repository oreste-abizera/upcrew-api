const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, "class name must be at least 2 characters"],
    maxlength: 255,
    required: [true, "add a class name"],
    trim: true,
    unique: true,
  },
  classTeacher: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  courses: {
    type: [mongoose.Schema.ObjectId],
    ref: "Course",
  },
});

const Class = mongoose.model("Class", ClassSchema);
module.exports.Class = Class;
