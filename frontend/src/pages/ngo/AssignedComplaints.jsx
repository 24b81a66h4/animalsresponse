import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import API from "../../services/api";

const BASE = `${import.meta.env.VITE_API_URL}/ngo`;

const AssignedComplaints = () => {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState("available");
  const [available, setAvailable] = useState([]);
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [availRes, myRes] = await Promise.all([
        API.get('/ngo/available-complaints'),
        API.get('/ngo/complaints'),
      ]);
      setAvailable(availRes.data);
      setAssigned(myRes.data);
    } catch (err) {
      console.error("Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const selfAssign = async (id) => {
    try {
      await API.put(`/ngo/complaints/${id}/assign`, {});
      alert("Complaint assigned to you!");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to assign");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/ngo/complaints/${id}/status`, { status });
      setAssigned((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status } : c))
      );
    } catch (err) {
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "resolved":    return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "pending":
      case "open":        return "bg-yellow-100 text-yellow-800";
      default:            return "bg-gray-100 text-gray-700";
    }
  };

  const ComplaintCard = ({ c, isAssigned }) => (
    <div className="border p-4 mb-3 rounded-xl shadow-sm bg-white">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">{c.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{c.description}</p>
          <p className="text-xs text-gray-400 mt-2">
            📍 {c.location?.address || "No location provided"}
          </p>
          <p className="text-xs text-gray-400">
            🕒 {new Date(c.createdAt).toLocaleDateString()}
          </p>
          {c.user_id && (
            <p className="text-xs text-gray-400">
              👤 Reported by: {c.user_id.name}
            </p>
          )}
        </div>
        <span className={`px-2 py-1 text-xs rounded-full font-medium ml-3 ${statusColor(c.status)}`}>
          {c.status}
        </span>
      </div>

      <div className="mt-4 flex gap-2 items-center">
        {isAssigned ? (
          <select
            value={c.status}
            onChange={(e) => updateStatus(c._id, e.target.value)}
            className="border rounded-lg p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        ) : (
          <button
            onClick={() => selfAssign(c._id)}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Accept & Assign to Me
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Complaint Management</h2>

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setTab("available")}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
              tab === "available"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            Available ({available.length})
          </button>
          <button
            onClick={() => setTab("assigned")}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition ${
              tab === "assigned"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
            }`}
          >
            My Assigned ({assigned.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : tab === "available" ? (
          available.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-2">📭</p>
              <p>No available complaints right now.</p>
            </div>
          ) : (
            available.map((c) => (
              <ComplaintCard key={c._id} c={c} isAssigned={false} />
            ))
          )
        ) : assigned.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📋</p>
            <p>No complaints assigned to you yet.</p>
          </div>
        ) : (
          assigned.map((c) => (
            <ComplaintCard key={c._id} c={c} isAssigned={true} />
          ))
        )}
      </div>
    </div>
  );
};

export default AssignedComplaints;