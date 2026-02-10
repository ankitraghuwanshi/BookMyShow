const express = require("express")
const cors=require("cors")
const app = express()

const dotenv = require("dotenv")
dotenv.config()

const userRouter = require("./routes/userRoute")
const movieRouter = require("./routes/movieRoute")
const theatreRouter = require("./routes/theatreRoute")
const showsRouter = require("./routes/showRoute")
const bookingRouter = require("./routes/bookingRoute")

const {connectDB } = require("./config/db")
connectDB()


// Add in middleware to handle request body as JSON
app.use(express.json())
app.use(cors())


// Registering my root level routes
app.use("/api/user", userRouter)
app.use("/api/movies", movieRouter)
app.use("/api/theatres", theatreRouter)
app.use("/api/shows", showsRouter)
app.use("/api/bookings", bookingRouter)


app.listen(process.env.PORT, () => {
    console.log("Backend application has started!")
})