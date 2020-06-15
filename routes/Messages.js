const express = require("express");
const { protect, authorize } = require("../middlewares/Auth");
const {
  createMessage,
  getMessages,
  getSingleMessage,
  deleteMessage,
  editMessage,
} = require("../controllers/Messages");
const Router = express.Router();

Router.route("/").get(protect, getMessages).post(protect, createMessage);
Router.route("/:id")
  .get(protect, getSingleMessage)
  .delete(protect, deleteMessage)
  .put(protect, editMessage);

module.exports = Router;
