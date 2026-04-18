import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const BASE = 'http://localhost:5000/api';

const STATUS_COLOR = {
    'pending':     'bg-yellow-100 text-yellow-800',
    'open':        'bg-cyan-100 text-cyan-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    'resolved':    'bg-green-100 text-green-800',
    'closed':      'bg-gray-100 text-gray-600',
};

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [ngoUsers, setNgoUsers]   = useState([]);
    const [loading, setLoading]     = useState(false);
    const [assigning, setAssigning] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [search, setSearch] = useState('');

    const headers = { Authorization: `Bearer ${user?.token}` };

    useEffect(() => {
        if (!user) return;
        fetchComplaints();
        fetchNgoUsers();
    }, [user]);

    const fetchComplaints = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE}/complaints`, { headers });
            setComplaints(res.data);
        } catch (err) {
            console.error('Failed to fetch complaints', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchNgoUsers = async () => {
        try {
            const res = await axios.get(`${BASE}/admin/ngo-users`, { headers });
            setNgoUsers(res.data);
        } catch (err) {
            console.error('Failed to fetch NGO users', err);
        }
    };

    const assignNgo = async (complaintId, ngoUserId) => {
        if (!ngoUserId) return;
        try {
            setAssigning(complaintId);
            const res = await axios.put(
                `${BASE}/complaints/${complaintId}/assign`,
                { ngo_user_id: ngoUserId },
                { headers }
            );
            // Update complaint in local state with fresh populated data
            setComplaints(prev =>
                prev.map(c => c._id === complaintId ? res.data : c)
            );
        } catch (err) {
            alert('Failed to assign NGO: ' + (err.response?.data?.message || err.message));
        } finally {
            setAssigning(null);
        }
    };

    // Derived counts
    const total      = complaints.length;
    const pending    = complaints.filter(c => c.status === 'pending' || c.status === 'open').length;
    const inProgress = complaints.filter(c => c.status === 'in-progress').length;
    const resolved   = complaints.filter(c => c.status === 'resolved').length;

    // Filtered list
    const filtered = complaints.filter(c => {
        const matchStatus = filterStatus === 'all' || c.status === filterStatus;
        const q = search.toLowerCase();
        const matchSearch = !q ||
            c.title?.toLowerCase().includes(q) ||
            c.user_id?.name?.toLowerCase().includes(q) ||
            c.category?.toLowerCase().includes(q) ||
            c.assigned_to?.name?.toLowerCase().includes(q);
        return matchStatus && matchSearch;
    });

    return (
        <div className="max-w-7xl mx-auto p-4 py-6">
            {/* Header */}
            <header className="flex justify-between items-center py-4 border-b mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Manage all complaints and NGO assignments</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Admin: <strong>{user?.name}</strong></span>
                    <button
                        onClick={fetchComplaints}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                        ↻ Refresh
                    </button>
                    <button onClick={logout} className="text-red-500 hover:underline text-sm">Logout</button>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500">
                    <p className="text-xs text-gray-500 uppercase font-medium">Total</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{total}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-yellow-400">
                    <p className="text-xs text-gray-500 uppercase font-medium">Pending / Open</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-1">{pending}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-400">
                    <p className="text-xs text-gray-500 uppercase font-medium">In Progress</p>
                    <p className="text-3xl font-bold text-blue-600 mt-1">{inProgress}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500">
                    <p className="text-xs text-gray-500 uppercase font-medium">Resolved</p>
                    <p className="text-3xl font-bold text-green-600 mt-1">{resolved}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-4">
                <input
                    type="text"
                    placeholder="Search by title, reporter, category, NGO…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="flex-1 min-w-[220px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                </select>
                <span className="self-center text-sm text-gray-400">{filtered.length} of {total} shown</span>
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-x-auto border border-gray-100">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Complaint</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Reporter</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Assigned NGO</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Assign NGO</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(c => (
                                <tr key={c._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-800">{c.title}</p>
                                        {c.location?.address && (
                                            <p className="text-xs text-gray-400 mt-0.5">📍 {c.location.address}</p>
                                        )}
                                        <p className="text-xs text-gray-400">
                                            🕒 {new Date(c.createdAt).toLocaleDateString()}
                                        </p>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 capitalize">
                                        {c.category?.replace(/_/g, ' ')}
                                    </td>
                                    <td className="px-4 py-3 text-gray-700">
                                        {c.user_id?.name || <span className="italic text-gray-400">Unknown</span>}
                                    </td>
                                    <td className="px-4 py-3">
                                        {c.assigned_to?.name
                                            ? <span className="font-medium text-emerald-700">✅ {c.assigned_to.name}</span>
                                            : <span className="italic text-gray-400">Not assigned</span>
                                        }
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 text-xs rounded-full font-medium capitalize ${STATUS_COLOR[c.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {c.status === 'resolved' || c.status === 'closed' ? (
                                            <span className="text-xs text-gray-400 italic">Completed</span>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <select
                                                    defaultValue=""
                                                    onChange={e => assignNgo(c._id, e.target.value)}
                                                    disabled={assigning === c._id}
                                                    className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-60"
                                                >
                                                    <option value="" disabled>
                                                        {c.assigned_to ? `Reassign…` : 'Select NGO…'}
                                                    </option>
                                                    {ngoUsers.map(n => (
                                                        <option key={n._id} value={n._id}>{n.name}</option>
                                                    ))}
                                                </select>
                                                {assigning === c._id && (
                                                    <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                                                )}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="p-10 text-center text-gray-400">
                            <p className="text-3xl mb-2">📭</p>
                            <p>No complaints match your filters.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
