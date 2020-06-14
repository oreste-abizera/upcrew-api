const express = require("express");
const Router = express.Router();
const { protect, authorize } = require("../middlewares/Auth");
const {
  getAssignments,
  getSingleAssignment,
  createAssignment,
  deleteAssignment,
  updateAssignment,
} = require("../controllers/Assignments");

Router.route("/")
  .get(protect, getAssignments)
  .post(protect, authorize("teacher"), createAssignment);

Router.route("/:id")
  .get(protect, getSingleAssignment)
  .delete(protect, authorize("teacher"), deleteAssignment)
  .put(protect, authorize("teacher"), updateAssignment);
module.exports = Router;
