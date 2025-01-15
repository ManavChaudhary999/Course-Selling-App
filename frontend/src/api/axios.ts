import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8787/api/v1",
});

// Automatically attach the token to every request
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error)
);

export default API;
