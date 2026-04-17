import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        const fetchComplaints = async () => {
            try {
                setLoading(true);
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };

                const res = await axios.get('http://localhost:5000/api/complaints', config);
                setComplaints(res.data);

            } catch (err) {
                alert("Failed to fetch complaints");
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, [user]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };

            await axios.put(
                `http://localhost:5000/api/complaints/${id}/status`,
                { status: newStatus },
                config
            );

            setComplaints(prev =>
                prev.map(c => c._id === id ? { ...c, status: newStatus } : c)
            );

        } catch (error) {
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Resolved":
                return "bg-green-100 text-green-900";
            case "Pending":
                return "bg-yellow-100 text-yellow-900";
            case "In Progress":
                return "bg-blue-100 text-blue-900";
            case "Rejected":
                return "bg-red-100 text-red-900";
            default:
                return "bg-gray-100 text-gray-900";
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <header className="flex justify-between items-center py-6 border-b mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <div className="space-x-4">
                    <span className="text-gray-600">Admin: {user?.name}</span>
                    <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
                </div>
            </header>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="bg-white rounded shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold">Title</th>
                                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold">Category</th>
                                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold">Reporter</th>
                                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold">Status</th>
                                <th className="px-5 py-3 bg-gray-100 text-left text-xs font-semibold">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {complaints.map(c => (
                                <tr key={c._id}>
                                    <td className="px-5 py-4 border-b">
                                        <p className="font-medium">{c.title}</p>
                                        <p className="text-xs text-gray-500">{c.location?.address}</p>
                                    </td>

                                    <td className="px-5 py-4 border-b">{c.category}</td>

                                    <td className="px-5 py-4 border-b">
                                        {c.user_id?.name || 'Unknown'}
                                    </td>

                                    <td className="px-5 py-4 border-b">
                                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(c.status)}`}>
                                            {c.status}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 border-b">
                                        <select
                                            value={c.status}
                                            onChange={(e) => handleStatusChange(c._id, e.target.value)}
                                            className="border p-1 rounded text-sm"
                                        >
                                            <option>Pending</option>
                                            <option>Assigned</option>
                                            <option>In Progress</option>
                                            <option>Resolved</option>
                                            <option>Rejected</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;