import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

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
    console.error("Failed to read user token", e);
  }
  return req;
});

export default API;