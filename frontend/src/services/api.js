import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Attach token from stored user object on every request
API.interceptors.request.use((req) => {
  try {
    const stored = localStorage.getItem("user");
    if (stored && stored !== "undefined") {
      const user = JSON.parse(stored);
      if (user?.token) {
        req.headers.Authorization = `Bearer ${user.token}`;
      }
    }
  } catch (e) {
    // ignore parse errors
  }
  return req;
});

export default API;