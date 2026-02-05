const MovieModel = require('../model/movieModel')

const addMovie=async (req, res) => {
    try {
        const movie = new MovieModel(req.body)

        await movie.save()

        res.status(200).json({
            success: true,
            message: "Movie is added!"
        })
    } catch(e) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            //error: e
        })
    }
}

const getAllMovies=async (req, res) => {
    try {
        const movies = await MovieModel.find()

        res.status(200).json({
            success: true,
            message: "Movies fetched!",
            movies
        })
    } catch(e) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const updateMovie=async (req, res) => {
    try {
        const {movieId, ...updateData}=req.body
        const movie = await MovieModel.findOneAndUpdate(
            { _id: movieId }, updateData, { new: true } //return updated movie
        )

        res.status(200).json({
            success: true,
            message: "Movie is updated!",
            movie
        })
    } catch(e) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports={
    addMovie,
    getAllMovies,
    updateMovie
}