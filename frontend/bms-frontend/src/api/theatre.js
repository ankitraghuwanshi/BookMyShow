import {axiosInstance} from './axios'

const addTheatre = async (value) => {
    try {
        const response = await axiosInstance.post("/api/theatres/add-theatre", value)
        return response.data
    } catch (error) {
        throw error.response?.data?.message || "Theatre not added, try again"
    }
}

const updateTheatre = async (value) => {
    try {
        const response = await axiosInstance.put("/api/theatres/update-theatre", value)
        return response.data
    } catch (error) {
        throw error.response?.data?.message || "Theatre not updated, try again"
    }
}

const deleteTheatre = async (value) => {
    try {
        const response = await axiosInstance.delete("/api/theatres/delete-theatre", value)
        return response.data
    } catch (error) {
        throw error.response?.data?.message || "Theatre not deleted, try again"
    }
}

const getAllTheatres = async () => {
    try {
        const response = await axiosInstance.get("/api/theatres/get-all-theatres")
        return response.data
    } catch (error) {
        throw error.response?.data?.message || "not getting all theatres, try again"
    }
}

const getAllTheatresByOwner = async (values) => {
    try {
        const response = await axiosInstance.get(`/api/theatres/get-all-theatres-by-owner/${values.owner}`)
        return response.data
    } catch (error) {
        throw error.response?.data?.message || "not getting-all-theatre-by-owner, try again"
    }
}

export {
    addTheatre,
    updateTheatre,
    deleteTheatre,
    getAllTheatres,
    getAllTheatresByOwner
}