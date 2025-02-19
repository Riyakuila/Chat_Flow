import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001', // change 5000 to your actual port
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance; 