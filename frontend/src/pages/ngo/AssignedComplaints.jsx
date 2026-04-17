import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const AssignedComplaints = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAssigned = async () => {
    try {
      setLoading(true);

      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const res = await axios.get(
        "http://localhost:5000/api/ngo/assigned",
        config
      );

      setComplaints(res.data);
    } catch (err) {
      console.log("Error fetching complaints");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      await axios.put(
        `http://localhost:5000/api/complaints/${id}/status`,
        { status },
        config
      );

      setComplaints((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c))
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    if (user) fetchAssigned();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Resolved":
        return "bg-green-100 text-green-900";
      case "Pending":
        return "bg-yellow-100 text-yellow-900";
      case "In Progress":
        return "bg-blue-100 text-blue-900";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Assigned Complaints</h2>

      {loading ? (
        <p>Loading...</p>
      ) : complaints.length === 0 ? (
        <p>No complaints assigned</p>
      ) : (
        complaints.map((c) => (
          <div key={c._id} className="border p-4 mb-3 rounded shadow-sm">
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-sm text-gray-600">{c.description}</p>
            <p className="text-xs text-gray-500 mt-1">
              {c.location?.address}
            </p>

            <div className="flex justify-between items-center mt-3">
              <span className={`px-2 py-1 text-xs rounded ${getStatusColor(c.status)}`}>
                {c.status}
              </span>

              <select
                value={c.status}
                onChange={(e) => updateStatus(c._id, e.target.value)}
                className="border p-1 rounded text-sm"
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AssignedComplaints;