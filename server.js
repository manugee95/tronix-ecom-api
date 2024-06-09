const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const connectDB = require("./config/db")
const categoryRoute = require("./routes/categoryRoute")
const productRoute = require("./routes/productRoute")
const authRoute = require("./routes/authRoute")
const cartRoute = require("./routes/cartRoute")

connectDB()
const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    allowedHeaders: ["Content-Type", "Authorization", "auth-token"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())
app.use("/uploads", express.static('uploads'))
app.use("/api/category", categoryRoute)
app.use("/api/product", productRoute)
app.use("/", authRoute)
app.use("/", cartRoute)

const port = process.env.PORT || 3000
app.listen(port, ()=> console.log(`Listening on port ${port}`))