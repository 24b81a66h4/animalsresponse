import API from "./api";

// admin analytics
export const getAdminAnalytics = async () => {
  const res = await API.get("/admin/analytics");
  return res.data;
};

// NGO analytics
export const getNGOAnalytics = async () => {
  const res = await API.get("/ngo/analytics");
  return res.data;
};