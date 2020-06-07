const express = require("express");
const {
  getCourse,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/Courses");
const { protect, authorize } = require("../middlewares/Auth");

const Router = express.Router();
Router.route("/")
  .get(protect, getCourses)
  .post(protect, authorize("headmaster"), createCourse);
Router.route("/:id")
  .get(protect, getCourse)
  .put(protect, authorize("headmaster"), updateCourse)
  .delete(protect, authorize("headmaster"), deleteCourse);

module.exports = Router;
