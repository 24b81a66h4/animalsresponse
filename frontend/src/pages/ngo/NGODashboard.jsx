import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const NGODashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
  });

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
        console.log("Failed to load NGO stats");
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold">NGO Dashboard</h1>
        <div>
          <span className="mr-4">Welcome, {user?.name}</span>
          <button onClick={logout} className="text-red-600">
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 border rounded bg-gray-100">
          <h3>Total Assigned</h3>
          <p className="text-xl font-bold">{stats.total}</p>
        </div>

        <div className="p-4 border rounded bg-yellow-100">
          <h3>Pending</h3>
          <p className="text-xl font-bold">{stats.pending}</p>
        </div>

        <div className="p-4 border rounded bg-green-100">
          <h3>Resolved</h3>
          <p className="text-xl font-bold">{stats.resolved}</p>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;