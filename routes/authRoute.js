const express = require("express")
const authController = require("../controllers/authController")
const {auth} = require("../middleware/auth")
const userCart = require("../middleware/userCart")

const router = express.Router()

router.post("/register", authController.register)
router.post("/login", userCart, authController.login)
router.get("/me", auth, authController.getMe)

module.exports = router 