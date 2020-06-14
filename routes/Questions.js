const express = require("express");
const Router = express.Router();
const { protect, authorize } = require("../middlewares/Auth");
const {
  getQuestions,
  getSingleQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/Questions");

Router.route("/")
  .get(protect, getQuestions)
  .post(protect, authorize("teacher"), createQuestion);
Router.route("/:id")
  .get(protect, getSingleQuestion)
  .put(protect, authorize("teacher"), updateQuestion)
  .delete(protect, authorize("teacher", "headmaster"), deleteQuestion);
module.exports = Router;
