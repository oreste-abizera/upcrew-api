const express = require("express");
const {
  getClasses,
  getSingleClass,
  createClass,
  deleteClass,
  updateClass,
} = require("../controllers/Classes");
const { protect, authorize } = require("../middlewares/Auth");

const Router = express.Router();

Router.route("/")
  .get(protect, getClasses)
  .post(protect, authorize("headmaster", "teacher"), createClass);

Router.route("/:id")
  .get(protect, getSingleClass)
  .delete(protect, authorize("headmaster", "teacher"), deleteClass)
  .put(protect, authorize("headmaster", "teacher"), updateClass);

module.exports = Router;
