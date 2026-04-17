import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      const res = await API.get("/admin/analytics");
      setStats(res.data);
    };
    fetchStats();
  }, []);

  return (
    <div className="p-5">
      <h2>Admin Dashboard</h2>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="p-3 border">Total: {stats.total}</div>
        <div className="p-3 border">Pending: {stats.pending}</div>
        <div className="p-3 border">Resolved: {stats.resolved}</div>
      </div>
    </div>
  );
}