import { useEffect, useState } from "react";
import API from "../services/api";

export default function useComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMyComplaints = async () => {
    try {
      setLoading(true);
      const res = await API.get("/complaint/my");
      setComplaints(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getComplaintById = async (id) => {
    const res = await API.get(`/complaint/${id}`);
    return res.data;
  };

  const submitComplaint = async (data) => {
    await API.post("/complaint/submit", data);
    fetchMyComplaints();
  };

  const updateStatus = async (id, status) => {
    await API.patch(`/complaint/${id}/status`, { status });
    fetchMyComplaints();
  };

  useEffect(() => {
    fetchMyComplaints();
  }, []);

  return {
    complaints,
    loading,
    fetchMyComplaints,
    submitComplaint,
    getComplaintById,
    updateStatus,
  };
}