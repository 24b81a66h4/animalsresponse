import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const NGODashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        fetchComplaints();
    }, [user]);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            // Fetch complaints assigned to this NGO user
            const res = await axios.get('http://localhost:5000/api/complaints', config);
            setComplaints(res.data);
        } catch (err) {
            console.error('Failed to fetch complaints', err);
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <div className="max-w-7xl mx-auto p-4 py-8">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-emerald-800">NGO Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600">Welcome, {user?.name}</span>
                    <button
                        onClick={logout}
                        className="text-red-600 hover:underline text-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-400">
                    <p className="text-sm text-gray-500">Total Assigned</p>
                    <p className="text-2xl font-bold">{complaints.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-400">
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold">
                        {complaints.filter(c => c.status === 'Pending' || c.status === 'Assigned').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-400">
                    <p className="text-sm text-gray-500">Resolved</p>
                    <p className="text-2xl font-bold">
                        {complaints.filter(c => c.status === 'Resolved').length}
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-800"></div>
                </div>
            ) : complaints.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
                    <p className="text-lg">No complaints assigned to you yet.</p>
                    <p className="text-sm mt-2">Ask the admin to assign complaints to your account.</p>
                </div>
            ) : (
                <div className="bg-white rounded shadow-lg overflow-hidden border border-emerald-100">
                    <table className="min-w-full">
                        <thead className="bg-emerald-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-emerald-800 uppercase">Issue</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-emerald-800 uppercase">Category</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-emerald-800 uppercase">Priority</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-emerald-800 uppercase">Status</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-emerald-800 uppercase">Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map(c => (
                                <tr key={c._id} className="hover:bg-emerald-50/50 transition">
                                    <td className="px-5 py-4 border-b border-gray-100">
                                        <p className="font-medium text-gray-800">{c.title}</p>
                                        <p className="text-xs text-gray-500">{c.location?.address}</p>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-100 text-gray-700">{c.category}</td>
                                    <td className="px-5 py-4 border-b border-gray-100">
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                            c.priority === 'High' ? 'bg-red-100 text-red-800' :
                                            c.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-green-100 text-green-800'
                                        }`}>
                                            {c.priority}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-100">
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                                            c.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                                            c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                            c.status === 'Assigned' ? 'bg-purple-100 text-purple-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-100">
                                        <select
                                            value={c.status}
                                            onChange={(e) => handleStatusChange(c._id, e.target.value)}
                                            className="border-gray-300 border p-2 rounded text-sm focus:ring-emerald-500 focus:border-emerald-500"
                                        >
                                            <option>Assigned</option>
                                            <option>In Progress</option>
                                            <option>Resolved</option>
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

export default NGODashboard;