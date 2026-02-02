const express = require("express")
const app = express()

const dotenv = require("dotenv")
dotenv.config()

const userRouter = require("./routes/userRoute")

const {connectDB } = require("./config/db")
connectDB()


// Add in middleware to handle request body as JSON
app.use(express.json())


// Registering my root level routes
app.use("/api/user", userRouter)

app.listen(process.env.PORT, () => {
    console.log("Backend application has started!")
})