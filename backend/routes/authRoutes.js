const express = require("express")
const router = express.Router()
const {
    login,
    signup,
    sendotp,
  } = require("../controllers/authController")


// const { auth } = require("../middleware/auth")
router.post("/signup", signup)
router.post("/sendotp", sendotp)
router.post("/login", login)
// router.post("/auth", auth)
module.exports = router;

