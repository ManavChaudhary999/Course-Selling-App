import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8787/api/v1", // Replace with your backend URL
});

// Automatically attach the token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
