const express = require("express")
const movieRouter = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const { addMovie, getAllMovies, updateMovie } = require("../controller/movieController");


// Add a movie
movieRouter.post("/add-movie", authMiddleware, addMovie)

// List all movie
movieRouter.get("/get-all-movies", authMiddleware, getAllMovies)

//update a movie
movieRouter.put("/update-movie", authMiddleware, updateMovie)


module.exports = movieRouter