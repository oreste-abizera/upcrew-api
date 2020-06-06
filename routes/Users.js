const express = require("express")
const router = express.Router()
const { getUsers, getSingleUser, updateUser, deleteUser } = require("../controllers/Users")
const { protect, authorize } = require("../middlewares/Auth")


router.route("/").get(protect, getUsers)
router.route("/:id").get(protect, getSingleUser).put(protect, authorize("headmaster"), updateUser).delete(protect, authorize("headmaster"), deleteUser)
module.exports = router