import axios from 'axios'

export const axiosInstance=axios.create({
    headers:{
        "Content-Type": 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    },
    baseURL:'http://localhost:3000'
})