import API from "./api";

// login
export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

// register
export const registerUser = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

// get current user
export const getMe = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};