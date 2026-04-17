import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const MyComplaints = () => {
  const { user } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const res = await axios.get(
        "http://localhost:5000/api/complaints/my",
        config
      );

      setComplaints(res.data);
    };

    if (user) fetchData();
  }, [user]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Complaints</h2>

      {complaints.map((c) => (
        <Link key={c._id} to={`/complaint/${c._id}`}>
          <div className="border p-4 mb-3 rounded hover:bg-gray-50">
            <h3 className="font-semibold">{c.title}</h3>
            <p className="text-sm text-gray-600">{c.description}</p>
            <p className="text-xs text-gray-500">{c.status}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MyComplaints;