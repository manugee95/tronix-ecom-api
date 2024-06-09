const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config()

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("Connected to MongoDB...");
    } catch (error) {
        console.log("Connection could not be established", error);
    }
}

module.exports = connectDB