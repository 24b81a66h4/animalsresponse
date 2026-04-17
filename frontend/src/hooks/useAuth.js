import { useState, useEffect } from "react";
import API from "../services/api";

export default function useAuth() {
  const [user, setUser] = useState(null);

  const loadUser = async () => {
    try {
      const res = await API.get("/auth/me"); // optional route
      setUser(res.data);
    } catch (err) {
      console.log("User not logged in");
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (formData) => {
    const res = await API.post("/auth/login", formData);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const register = async (formData) => {
    const res = await API.post("/auth/register", formData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, login, register, logout };
}