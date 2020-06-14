const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "add an assignment title"],
  },
  class: {
    type: mongoose.Schema.ObjectId,
    ref: "Class",
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
  },
  teacher: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  duration: {
    type: Number,
    required: [true, "add duration"],
  },
  status: {
    type: String,
    required: true,
    default: "unpublished",
    enum: ["unpublished", "published", "completed"],
  },
});

module.exports.Assignment = mongoose.model("Assignment", AssignmentSchema);
