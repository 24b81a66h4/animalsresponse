import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AllComplaints() {
  const [complaints, setComplaints] = useState([]);

  const fetchAll = async () => {
    const res = await API.get("/admin/complaints");
    setComplaints(res.data);
  };

  const updateStatus = async (id, status) => {
    await API.patch(`/complaint/${id}/status`, { status });
    fetchAll();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="p-5">
      <h2>All Complaints</h2>

      {complaints.map((c) => (
        <div key={c._id} className="border p-3 my-2">
          <h3>{c.title}</h3>
          <p>{c.description}</p>
          <p>Status: {c.status}</p>

          <select
            onChange={(e) => updateStatus(c._id, e.target.value)}
            value={c.status}
            className="border rounded p-1 text-sm mt-2"
          >
            <option value="pending">Pending</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      ))}
    </div>
  );
}