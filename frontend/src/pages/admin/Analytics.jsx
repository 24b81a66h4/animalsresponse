import { useEffect, useState } from "react";
import API from "../../services/api";

export default function Analytics() {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await API.get("/admin/analytics");
      setData(res.data);
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="p-5">
      <h2>Analytics</h2>

      <div className="mt-4">
        <p>Total Complaints: {data.total}</p>
        <p>Resolved: {data.resolved}</p>
        <p>Pending: {data.pending}</p>
      </div>
    </div>
  );
}