import {axiosInstance} from './axios'


const registerUser = async (value) => {
    try {
        const response = await axiosInstance.post("/api/user/register", value)
        return response.data
    } catch (error) {
        throw error.response?.data?.message || "Something went wrong"
    }
}

const loginUser = async (value) => {
    try {
        const response = await axiosInstance.post("/api/user/login", value)
        return response.data
    } catch (error) {
        throw error.response?.data?.message || "Something went wrong"
    }
}

const getCurrentUser = async () => {
    try {
        const response = await axiosInstance.get("/api/user/get-current-user")
        return response.data
    } catch (error) {
        throw error.response?.data?.message || "Something went wrong"
    }
}

//for Forget and Reset Password
const forgetPassword = async (value) => {
    try {
        const response = await axiosInstance.post("/api/user/forgetpassword", value);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Something went wrong"
    }
}

const resetPassword = async (value) => {
    try {
        const response = await axiosInstance.post("/api/user/resetpassword", value);
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Something went wrong"
    }
}


export {
    registerUser,
    loginUser,
    getCurrentUser,
    forgetPassword,
    resetPassword
}