// src/api/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3500/api', // Adjust the base URL as needed
});

export default instance;