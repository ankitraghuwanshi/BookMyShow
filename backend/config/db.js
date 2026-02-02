const mongoose = require("mongoose")
const { DB_URL } = process.env

// Connecting to DB and importing models
const connectDB = async () => mongoose.connect(DB_URL).then(() => {
    console.log("Connected to our DATABASE")
}).catch((e) => {
    console.log(e)
    process.exit(1)
})

module.exports = {
    connectDB
}