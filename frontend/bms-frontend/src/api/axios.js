import axios from 'axios'

export const axiosInstance=axios.create({
    headers:{
        "Content-Type": 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    baseURL:'https://bookmyshow-backend-4n8f.onrender.com'
})