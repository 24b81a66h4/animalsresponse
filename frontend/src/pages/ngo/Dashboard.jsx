import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const NGODashboard = () => {
    const { user } = useContext(AuthContext);
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

    return (
        <div className="max-w-7xl mx-auto p-4 py-8">
            <h1 className="text-3xl font-bold text-emerald-800 mb-6">NGO Dashboard</h1>
            
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="bg-white rounded shadow-lg overflow-hidden border border-emerald-100">
                    <table className="min-w-full">
                        <thead className="bg-emerald-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">Issue</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">Category</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">Status</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-emerald-800 uppercase tracking-wider">Actions</th>
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
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${c.status === 'Resolved' ? 'bg-green-100 text-green-800' : c.status === 'In Progress' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-100">
                                        <select
                                            value={c.status}
                                            onChange={(e) => handleStatusChange(c._id, e.target.value)}
                                            className="border-gray-300 border p-2 rounded text-sm focus:ring-emerald-500 focus:border-emerald-500"
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
                    {complaints.length === 0 && <div className="p-8 text-center text-gray-500">No complaints found.</div>}
                </div>
            )}
        </div>
    );
};

export default NGODashboard;
