import axios from 'axios';
import {BASE_URL} from "../utils/const";

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: `${BASE_URL}/api`
});

// Alter defaults after instance has been created
instance.interceptors.request.use((config) => {
  config.headers.Authorization =  `Bearer ${localStorage.getItem("token")}`;
    return config;
});

export default instance;