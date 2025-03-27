import axios from "axios";

const API = axios.create({
  // baseURL: (import.meta as any).env.VITE_API_URL || "http://localhost:3000/api/v1",
  // withCredentials: true,
  // headers: {
  //   'Content-Type': 'application/json',
  //   'Accept': 'application/json'
  // }
  baseURL: (import.meta as any).env.PROD
    ? `${(import.meta as any).env.VITE_API_URL}/api/v1` // Use full URL in production
    : "/api/v1", // Use proxy in development
  withCredentials: true,
});

console.log("Testing: " + API.defaults.baseURL);

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