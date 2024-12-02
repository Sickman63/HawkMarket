// src/api/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://hawkmarket.ddns.net/api', // Adjust the base URL as needed
});

export default instance;