import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [ngoUsers, setNgoUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        fetchComplaints();
        fetchNGOUsers();
    }, [user]);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get('http://localhost:5000/api/complaints', config);
            setComplaints(res.data);
        } catch (err) {
            alert('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    const fetchNGOUsers = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const res = await axios.get('http://localhost:5000/api/admin/ngo-users', config);
            setNgoUsers(res.data);
        } catch (err) {
            console.log('Failed to fetch NGO users');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(
                `http://localhost:5000/api/complaints/${id}/status`,
                { status: newStatus },
                config
            );
            setComplaints(prev =>
                prev.map(c => c._id === id ? { ...c, status: newStatus } : c)
            );
        } catch {
            alert('Failed to update status');
        }
    };

    const handleAssignNGO = async (id, ngoUserId) => {
        if (!ngoUserId) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(
                `http://localhost:5000/api/complaints/${id}/assign`,
                { ngo_user_id: ngoUserId },
                config
            );
            setComplaints(prev =>
                prev.map(c => c._id === id ? { ...c, assigned_to: ngoUserId, status: 'Assigned' } : c)
            );
        } catch {
            alert('Failed to assign complaint');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved':    return 'bg-green-100 text-green-900';
            case 'Pending':     return 'bg-yellow-100 text-yellow-900';
            case 'In Progress': return 'bg-blue-100 text-blue-900';
            case 'Assigned':    return 'bg-purple-100 text-purple-900';
            case 'Rejected':    return 'bg-red-100 text-red-900';
            default:            return 'bg-gray-100 text-gray-900';
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4">
            <header className="flex justify-between items-center py-6 border-b mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600">Admin: {user?.name}</span>
                    <button onClick={logout} className="text-red-600 hover:underline text-sm">
                        Logout
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-2xl font-bold">{complaints.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold">
                        {complaints.filter(c => c.status === 'Pending').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
                    <p className="text-sm text-gray-500">Assigned</p>
                    <p className="text-2xl font-bold">
                        {complaints.filter(c => c.status === 'Assigned').length}
                    </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
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
            ) : (
                <div className="bg-white rounded shadow overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-3 bg-gray-100 text-left text-xs font-semibold uppercase">Title</th>
                                <th className="px-4 py-3 bg-gray-100 text-left text-xs font-semibold uppercase">Category</th>
                                <th className="px-4 py-3 bg-gray-100 text-left text-xs font-semibold uppercase">Reporter</th>
                                <th className="px-4 py-3 bg-gray-100 text-left text-xs font-semibold uppercase">Status</th>
                                <th className="px-4 py-3 bg-gray-100 text-left text-xs font-semibold uppercase">Assign to NGO</th>
                                <th className="px-4 py-3 bg-gray-100 text-left text-xs font-semibold uppercase">Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map(c => (
                                <tr key={c._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 border-b">
                                        <p className="font-medium">{c.title}</p>
                                        <p className="text-xs text-gray-500">{c.location?.address}</p>
                                    </td>
                                    <td className="px-4 py-3 border-b text-sm">{c.category}</td>
                                    <td className="px-4 py-3 border-b text-sm">{c.user_id?.name || 'Unknown'}</td>
                                    <td className="px-4 py-3 border-b">
                                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(c.status)}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 border-b">
                                        <select
                                            className="border p-1 rounded text-sm"
                                            defaultValue=""
                                            onChange={(e) => handleAssignNGO(c._id, e.target.value)}
                                        >
                                            <option value="" disabled>Select NGO</option>
                                            {ngoUsers.map(ngo => (
                                                <option key={ngo._id} value={ngo._id}>
                                                    {ngo.name}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 border-b">
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
                    {complaints.length === 0 && (
                        <div className="p-8 text-center text-gray-500">No complaints found.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;