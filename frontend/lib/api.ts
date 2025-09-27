// lib/api.ts
import axios from "axios";


const API = axios.create({ baseURL:  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api" });

// ✅ Automatically attach JWT token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
