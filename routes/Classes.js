const express = require("express");
const {
  getClasses,
  getSingleClass,
  createClass,
  deleteClass,
  updateClass,
} = require("../controllers/Classes");

const Router = express.Router();

Router.route("/").get(getClasses).post(createClass);

Router.route("/:id").get(getSingleClass).delete(deleteClass).put(updateClass);

module.exports = Router;
