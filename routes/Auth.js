const express = require("express")
const { register, login, getMe, updateProfile, updatePassword } = require("../controllers/Auth")
const { protect } = require("../middlewares/Auth")

const router = express.Router()
router.post("/register", register)
router.post("/login", login)
router.get("/me", protect, getMe)
router.put("/updateProfile", protect, updateProfile)
router.put("/updatePassword", protect, updatePassword)

module.exports = router