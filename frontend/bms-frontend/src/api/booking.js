import { axiosInstance } from "./axios";

// This is the API where I need to confirm my payment which has been started from frontend
export const makePayment = async (token, amount) => {
    try {
        const response = await axiosInstance.post('/api/bookings/make-payment', { token, amount });
        return response.data;
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || err.message || "Payment failed"
        };
    }
}

export const bookShow = async (payload) => {
    try {
        const response = await axiosInstance.post('/api/bookings/book-show', payload);
        return response.data;
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || err.message || "Booking failed"
        };
    }
}

export const getAllBookings = async () => {
    try {
        const response = await axiosInstance.get('/api/bookings/get-all-bookings');
        return response.data;
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || err.message || "Failed to fetch bookings"
        };
    }
}