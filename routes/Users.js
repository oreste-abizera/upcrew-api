const express = require("express")
const router = express.Router()
const { getUsers, createUser, getSingleUser, updateUser, deleteUser } = require("../controllers/Users")


router.route("/").get(getUsers).post(createUser)
router.route("/:id").get(getSingleUser).put(updateUser).delete(deleteUser)
module.exports = router