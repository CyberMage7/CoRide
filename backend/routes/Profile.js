const express = require("express")
const router = express.Router()
const { auth } = require("../middleware/auth")
const {

  getAllUserDetails,

} = require("../controllers/Profile")



router.get("/getUserDetails", auth,getAllUserDetails)


