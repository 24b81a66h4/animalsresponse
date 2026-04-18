import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const BASE = 'http://localhost:5000/api/ngo';

const STATUS_COLOR = {
    'pending':     'bg-yellow-100 text-yellow-800',
    'open':        'bg-cyan-100 text-cyan-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'resolved':    'bg-green-100 text-green-800',
    'closed':      'bg-gray-100 text-gray-700',
};

const PRIORITY_COLOR = {
    'low':      'bg-green-100 text-green-800',
    'medium':   'bg-yellow-100 text-yellow-800',
    'high':     'bg-orange-100 text-orange-800',
    'critical': 'bg-red-100 text-red-800',
};

const NGODashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(null);

    const headers = { Authorization: `Bearer ${user?.token}` };

    useEffect(() => {
        if (!user) return;
        fetchComplaints();
    }, [user]);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            // Use the NGO-specific endpoint which returns only this NGO's complaints
            const res = await axios.get(`${BASE}/complaints`, { headers });
            setComplaints(res.data);
        } catch (err) {
            console.error('Failed to fetch complaints', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            setUpdating(id);
            await axios.put(
                `${BASE}/complaints/${id}/status`,
                { status: newStatus },
                { headers }
            );
            setComplaints(prev =>
                prev.map(c => c._id === id ? { ...c, status: newStatus } : c)
            );
        } catch (error) {
            alert('Failed to update status: ' + (error.response?.data?.message || error.message));
        } finally {
            setUpdating(null);
        }
    };

    const total      = complaints.length;
    const inProgress = complaints.filter(c => c.status === 'in-progress').length;
    const resolved   = complaints.filter(c => c.status === 'resolved').length;
    const pending    = complaints.filter(c => c.status === 'pending' || c.status === 'open').length;

    return (
        <div className="max-w-7xl mx-auto p-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-emerald-800">NGO Dashboard</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage complaints assigned to your organisation</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm">Welcome, <strong>{user?.name}</strong></span>
                    <Link
                        to="/ngo/complaints"
                        className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                    >
                        Browse Available
                    </Link>
                    <button onClick={logout} className="text-red-500 hover:underline text-sm">Logout</button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-gray-400">
                    <p className="text-sm text-gray-500">Total Assigned</p>
                    <p className="text-2xl font-bold">{total}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-400">
                    <p className="text-sm text-gray-500">Pending / Open</p>
                    <p className="text-2xl font-bold">{pending}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-400">
                    <p className="text-sm text-gray-500">In Progress</p>
                    <p className="text-2xl font-bold">{inProgress}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-400">
                    <p className="text-sm text-gray-500">Resolved</p>
                    <p className="text-2xl font-bold">{resolved}</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-800"></div>
                </div>
            ) : complaints.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl shadow text-center text-gray-500">
                    <p className="text-4xl mb-3">📋</p>
                    <p className="text-lg font-medium">No complaints assigned to you yet.</p>
                    <p className="text-sm mt-2">
                        Browse <Link to="/ngo/complaints" className="text-emerald-600 underline">available complaints</Link> and accept one to get started.
                    </p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-emerald-100">
                    <table className="min-w-full">
                        <thead className="bg-emerald-50">
                            <tr>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-emerald-800 uppercase">Issue</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-emerald-800 uppercase">Reporter</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-emerald-800 uppercase">Category</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-emerald-800 uppercase">Priority</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-emerald-800 uppercase">Current Status</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-emerald-800 uppercase">Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {complaints.map(c => (
                                <tr key={c._id} className="hover:bg-emerald-50/50 transition">
                                    <td className="px-5 py-4 border-b border-gray-100">
                                        <p className="font-medium text-gray-800">{c.title}</p>
                                        <p className="text-xs text-gray-400">{c.location?.address || 'No location'}</p>
                                        <p className="text-xs text-gray-400">🕒 {new Date(c.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-100 text-sm text-gray-700">
                                        {c.user_id?.name || 'Unknown'}
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-100 text-sm text-gray-700 capitalize">
                                        {c.category?.replace(/_/g, ' ')}
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-100">
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium capitalize ${PRIORITY_COLOR[c.priority] || 'bg-gray-100 text-gray-700'}`}>
                                            {c.priority}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-100">
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium capitalize ${STATUS_COLOR[c.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 border-b border-gray-100">
                                        <select
                                            value={c.status?.toLowerCase()}
                                            onChange={(e) => handleStatusChange(c._id, e.target.value)}
                                            disabled={updating === c._id}
                                            className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-60"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="resolved">Resolved</option>
                                        </select>
                                        {updating === c._id && (
                                            <span className="ml-2 text-xs text-gray-400">Saving...</span>
                                        )}
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