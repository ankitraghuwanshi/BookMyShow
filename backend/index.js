const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const userRouter = require("./routes/userRoute");
const movieRouter = require("./routes/movieRoute");
const theatreRouter = require("./routes/theatreRoute");
const showsRouter = require("./routes/showRoute");
const bookingRouter = require("./routes/bookingRoute");

const { connectDB } = require("./config/db");
connectDB();


//Security middleware (PUT HELMET HERE)
app.use(helmet());

//Body parser
app.use(express.json());

//CORS
app.use(cors());


//Rate limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
});

app.use("/api", apiLimiter);


// Routes
app.use("/api/user", userRouter);
app.use("/api/movies", movieRouter);
app.use("/api/theatres", theatreRouter);
app.use("/api/shows", showsRouter);
app.use("/api/bookings", bookingRouter);


app.listen(process.env.PORT, () => {
    console.log("Backend application has started!");
});