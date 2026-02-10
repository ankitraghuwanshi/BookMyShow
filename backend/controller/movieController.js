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

const getAllMoviesBySearchText=async (req, res) => {
    try {
        if (req.params.text && req.params.text !== "undefined") {
            const movies = await MovieModel.find({ "movieName": { "$regex": req.params.text, "$options": "i" }})

            res.status(200).json({
                success: true,
                message: "Movies fetched!",
                movies
            })
        } else {
            const movies = await MovieModel.find()
            res.status(200).json({
                success: true,
                message: "Movies fetched!",
                movies
            })
        }
    } catch(e) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

const getMovieById=async (req, res) => {
    try{
        const movie = await MovieModel.findById(req.params.id);
        res.status(200).json({
            success: true,
            message: "Movie fetched successfully!",
            data: movie
        })
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
}

module.exports={
    addMovie,
    getAllMovies,
    updateMovie,
    getAllMoviesBySearchText,
    getMovieById
}