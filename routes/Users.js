const express = require("express");
const router = express.Router();
const {
  getUsers,
  getSingleUser,
  updateUser,
  deleteUser,
  updatePicture,
} = require("../controllers/Users");
const { protect, authorize } = require("../middlewares/Auth");

router.route("/").get(protect, getUsers);
router
  .route("/:id")
  .get(protect, getSingleUser)
  .put(protect, authorize("headmaster"), updateUser)
  .delete(protect, authorize("headmaster"), deleteUser);
router.put("/:id/photoupload", protect, updatePicture);
module.exports = router;
