import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const NGODashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    inProgress: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${user.token}` },
        };
        const res = await axios.get(
          "http://localhost:5000/api/ngo/analytics",
          config
        );
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load NGO stats:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">NGO Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={logout}
            className="text-sm text-red-600 hover:text-red-800 border border-red-200 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <p className="text-gray-400 text-sm">Loading stats...</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-5 border rounded-xl bg-white shadow-sm">
              <p className="text-sm text-gray-500">Total Assigned</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{stats.total}</p>
            </div>
            <div className="p-5 border rounded-xl bg-yellow-50 shadow-sm">
              <p className="text-sm text-yellow-700">Pending</p>
              <p className="text-3xl font-bold text-yellow-800 mt-1">{stats.pending}</p>
            </div>
            <div className="p-5 border rounded-xl bg-blue-50 shadow-sm">
              <p className="text-sm text-blue-700">In Progress</p>
              <p className="text-3xl font-bold text-blue-800 mt-1">{stats.inProgress}</p>
            </div>
            <div className="p-5 border rounded-xl bg-green-50 shadow-sm">
              <p className="text-sm text-green-700">Resolved</p>
              <p className="text-3xl font-bold text-green-800 mt-1">{stats.resolved}</p>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/ngo/complaints"
            className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition flex items-center gap-4"
          >
            <div className="bg-blue-100 p-3 rounded-lg">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">View Available Complaints</h3>
              <p className="text-sm text-gray-500">Browse and accept new complaints</p>
            </div>
          </Link>

          <Link
            to="/ngo/complaints"
            className="p-6 bg-white border rounded-xl shadow-sm hover:shadow-md transition flex items-center gap-4"
          >
            <div className="bg-green-100 p-3 rounded-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">My Assigned Complaints</h3>
              <p className="text-sm text-gray-500">Update status on your complaints</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NGODashboard;