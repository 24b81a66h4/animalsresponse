import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const ComplaintDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [complaint, setComplaint] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };

      const res = await axios.get(
        `http://localhost:5000/api/complaints/${id}`,
        config
      );

      setComplaint(res.data);
    };

    if (user) fetchDetail();
  }, [id, user]);

  if (!complaint) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold">{complaint.title}</h2>
      <p className="mt-2">{complaint.description}</p>

      <div className="mt-4">
        <p>Status: {complaint.status}</p>
        <p>Category: {complaint.category}</p>
        <p>Location: {complaint.location?.address}</p>
      </div>
    </div>
  );
};

export default ComplaintDetail;