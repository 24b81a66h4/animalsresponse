import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchComplaints = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };

                const res = await axios.get(
                    'http://localhost:5000/api/complaints',
                    config
                );

                setComplaints(res.data);

            } catch (err) {
                alert("Failed to fetch complaints");
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case "Pending": return "bg-yellow-500";
            case "Resolved": return "bg-green-500";
            case "In Progress": return "bg-blue-500";
            case "Assigned": return "bg-purple-500";
            case "Rejected": return "bg-red-500";
            default: return "bg-gray-500";
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <header className="flex justify-between items-center py-6 border-b mb-8">
                <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
                <div className="space-x-4">
                    <span className="text-gray-600">Welcome, {user?.name}</span>
                    <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
                </div>
            </header>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">My Complaints</h2>
                <Link
                    to="/user/submit-complaint"
                    className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
                >
                    + Report Issue
                </Link>
            </div>

            {loading ? (
                <p>Loading complaints...</p>
            ) : complaints.length === 0 ? (
                <div className="bg-white p-8 rounded shadow text-center text-gray-500">
                    You haven't reported any issues yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {complaints.map((complaint) => (
                        <div
                            key={complaint._id}
                            className="bg-white p-6 rounded shadow border-l-4 border-blue-500 hover:shadow-lg transition"
                        >
                            <h3 className="font-bold text-lg mb-2">{complaint.title}</h3>

                            <p className="text-sm text-gray-600 mb-4 truncate">
                                {complaint.description}
                            </p>

                            <div className="flex justify-between text-sm">
                                <span
                                    className={`px-2 py-1 rounded text-white ${getStatusColor(complaint.status)}`}
                                >
                                    {complaint.status}
                                </span>

                                <span className="text-gray-500">
                                    {complaint.createdAt
                                        ? new Date(complaint.createdAt).toLocaleDateString()
                                        : "N/A"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dashboard;