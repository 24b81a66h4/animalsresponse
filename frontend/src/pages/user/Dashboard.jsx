import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
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
            case "Pending": return "bg-yellow-100 text-yellow-800";
            case "Resolved": return "bg-green-100 text-green-800";
            case "In Progress": return "bg-blue-100 text-blue-800";
            case "Assigned": return "bg-purple-100 text-purple-800";
            case "Rejected": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 py-8">
            <header className="flex justify-between items-center py-6 border-b border-gray-200 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-emerald-900">User Dashboard</h1>
                    <p className="text-gray-500 mt-1">Manage your reported animal issues</p>
                </div>
                <Link
                    to="/user/submit-complaint"
                    className="bg-amber-500 text-white px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-amber-600 transition hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    + Report New Issue
                </Link>
            </header>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-800"></div>
                </div>
            ) : complaints.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-gray-100">
                    <div className="text-5xl mb-4">🐾</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No complaints reported yet</h3>
                    <p className="text-gray-500 mb-6">If you see an animal in need, please report it so we can help.</p>
                    <Link
                        to="/user/submit-complaint"
                        className="bg-emerald-800 text-white px-6 py-3 rounded-full font-bold shadow hover:bg-emerald-700 transition"
                    >
                        Report an Issue Now
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {complaints.map((complaint) => (
                        <div
                            key={complaint._id}
                            className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col overflow-hidden"
                        >
                            <div className="p-6 flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700">
                                        {complaint.category}
                                    </span>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(complaint.status)}`}>
                                        {complaint.status}
                                    </span>
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-1">{complaint.title}</h3>
                                <p className="text-gray-600 mb-4 line-clamp-3">
                                    {complaint.description}
                                </p>
                            </div>
                            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    <span className="truncate max-w-[100px]">{complaint.location?.address}</span>
                                </span>
                                <span>
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