// utils/api.js
import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // your base URL
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // optional: 10s timeout
});

// Optional: Add interceptors for request or response
api.interceptors.request.use(
  (config) => {
    // e.g., attach token if exists
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // e.g., handle global errors
    console.error("API error:", error.response?.status);
    return Promise.reject(error);
  },
);

export default api;
