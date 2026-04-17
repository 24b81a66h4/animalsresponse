import API from "./api";

// submit complaint
export const createComplaint = async (data) => {
  const res = await API.post("/complaints", data);
  return res.data;
};

// get all complaints (admin)
export const getAllComplaints = async () => {
  const res = await API.get("/complaints");
  return res.data;
};

// get my complaints (user)
export const getMyComplaints = async () => {
  const res = await API.get("/complaints/my");
  return res.data;
};

// get single complaint
export const getComplaintById = async (id) => {
  const res = await API.get(`/complaints/${id}`);
  return res.data;
};

// update status
export const updateComplaintStatus = async (id, status) => {
  const res = await API.put(`/complaints/${id}/status`, { status });
  return res.data;
};

// submit feedback
export const submitFeedback = async (id, text) => {
  const res = await API.post(`/complaints/${id}/feedback`, { text });
  return res.data;
};