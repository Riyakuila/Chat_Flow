import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://chat-flow-i303.onrender.com', 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance; 