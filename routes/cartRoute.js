const express = require("express")
const cartController = require("../controllers/cartController")
const auth = require("../middleware/auth")
const handleAnonymousCart = require("../middleware/anonymousCart")

const router = express.Router()
router.use(handleAnonymousCart)

router.post("/addToCart", auth.optional ,cartController.addToCart)

module.exports = router 