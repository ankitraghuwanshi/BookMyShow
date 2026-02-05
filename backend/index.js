const express = require("express")
const cors=require("cors")
const app = express()

const dotenv = require("dotenv")
dotenv.config()

const userRouter = require("./routes/userRoute")
const movieRouter = require("./routes/movieRoute")

const {connectDB } = require("./config/db")
connectDB()


// Add in middleware to handle request body as JSON
app.use(express.json())
app.use(cors())


// Registering my root level routes
app.use("/api/user", userRouter)
app.use("/api/movies", movieRouter)

app.listen(process.env.PORT, () => {
    console.log("Backend application has started!")
})