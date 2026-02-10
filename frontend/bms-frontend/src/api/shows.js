import { axiosInstance } from "./axios";

const addShow = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/shows/add-show", payload);
    return response.data;
  } catch (error) {
		throw error.response?.data?.message || "Something went wrong"
    //return err.message;
  }
};

const updateShow = async (payload) => {
  try {
    const response = await axiosInstance.put("/api/shows/update-show", payload);
    //console.log(payload, response);
    return response.data;
  } catch (error) {
		throw error.response?.data?.message || "Something went wrong"
    //return err.response;
  }
};

const getShowsByTheatre = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/shows/get-all-shows-by-theatre", payload);
    return response.data;
  } catch (error) {
		throw error.response?.data?.message || "Something went wrong"
    //return err.response;
  }
};

const deleteShow = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/shows/delete-show",payload);
    return response.data;
  } catch (error) {
		throw error.response?.data?.message || "Something went wrong"
    //return err.response;
  }
};

const getAllTheatresByMovie = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/shows/get-all-theatres-by-movie",payload);
    return response.data;
  } catch (error) {
		throw error.response?.data?.message || "Something went wrong"
    //return err.response;
  }
};

const getShowById = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/shows/get-show-by-id",payload);
    return response.data;
  } catch (error) {
		throw error.response?.data?.message || "Something went wrong"
    //return err.message;
  }
};

export{
	addShow,
	updateShow,
	deleteShow,
	getShowById,
	getAllTheatresByMovie,
	getShowsByTheatre
}