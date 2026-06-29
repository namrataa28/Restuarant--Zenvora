import axios from "axios";

// Uses cookie-based auth (httpOnly token cookie is set by backend).
// Therefore we send credentials on every request.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default api;

