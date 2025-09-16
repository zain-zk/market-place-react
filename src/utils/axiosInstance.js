// src/utils/axiosInstance.js
import axios from "axios";
import { use } from "react";
import userContext from "../contexts/userContext";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL, // Update to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage
    let token = localStorage.getItem("token");

    // Fallback: get from stored user object
    if (!token) {
      const user = userContext(userContext);
      token = user?.token;
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Response interceptor for handling expired tokens globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: logout user or redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // or use navigate in React Router
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
