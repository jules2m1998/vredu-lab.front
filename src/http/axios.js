import axios from 'axios';

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: 'https://localhost:7086/api'
});

// Alter defaults after instance has been created
instance.interceptors.request.use((config) => {
    const token = `Bearer ${localStorage.getItem("token")}`;
    config.headers.Authorization =  token;

    return config;
});

export default instance;