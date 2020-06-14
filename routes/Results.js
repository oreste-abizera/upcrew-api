const express = require("express");
const Router = express.Router();
const { protect, authorize } = require("../middlewares/Auth");
const {
  getResults,
  getSingleResult,
  createResult,
  updateResult,
  deleteResult,
  submitQuiz,
} = require("../controllers/Results");

Router.route("/")
  .get(protect, getResults)
  .post(protect, authorize("student"), createResult);
Router.route("/:id")
  .get(protect, getSingleResult)
  .put(protect, authorize("teacher"), updateResult)
  .delete(protect, authorize("teacher", "headmaster"), deleteResult);
Router.route("/submitQuiz").post(protect, authorize("student"), submitQuiz);
module.exports = Router;
