import {axiosInstance} from './axios'


const addMovie = async (value) => {
    try {
        const response = await axiosInstance.post("/api/movies/add-movie", value)
        return response.data
    } catch (error) {
        throw error.response?.data?.message || "Something went wrong"
    }
}

const updateMovie = async (value) => {
    try {
        const response = await axiosInstance.put("/api/movies/update-movie", value)
        return response.data
    } catch (error) {
        throw error.response?.data?.message || "Something went wrong"
    }
}


const getAllMovies = async () => {
    try {
        const response = await axiosInstance.get("/api/movies/get-all-movies")
        return response.data
    } catch (error) {
        throw error.response?.data?.message || "Something went wrong"
    }
}

const getAllMoviesBySearchText = async (values) => {
    try {
        const response = await axiosInstance.get(`/api/movies/get-all-movies-by-search-text/${values}`)
        return response.data
    } catch (error) {
        throw error.response?.data?.message || "Something went wrong"
    }
}

const getMovieById = async (id) => {
    try{
        const response = await axiosInstance.get(`/api/movies/movie/${id}`)
        return response.data;
    }catch(err){
        return err.response
    }
}

export {
    addMovie,
    getAllMovies,
    updateMovie,
    getAllMoviesBySearchText,
    getMovieById
}