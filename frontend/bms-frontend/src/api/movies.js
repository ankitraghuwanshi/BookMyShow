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

export {
    addMovie,
    getAllMovies,
    updateMovie
}