import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const STATUS_OPTIONS = ['all', 'pending', 'open', 'in-progress', 'resolved', 'closed'];
const PRIORITY_OPTIONS = ['all', 'low', 'medium', 'high', 'critical'];
const CATEGORY_OPTIONS = ['all', 'injured_animal', 'stray_animal', 'abuse', 'trapped', 'sick_animal', 'other'];

const STATUS_COLORS = {
    pending:       'bg-yellow-100 text-yellow-800',
    open:          'bg-blue-100 text-blue-800',
    'in-progress': 'bg-purple-100 text-purple-800',
    resolved:      'bg-green-100 text-green-800',
    closed:        'bg-gray-100 text-gray-700',
};

const PRIORITY_COLORS = {
    low:      'bg-green-100 text-green-800',
    medium:   'bg-yellow-100 text-yellow-800',
    high:     'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
};

const MyComplaints = () => {
    const { user } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('all');
    const [priority, setPriority] = useState('all');
    const [category, setCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/complaints/my', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setComplaints(res.data);
                setFiltered(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [user]);

    useEffect(() => {
        let result = [...complaints];

        if (search) {
            const q = search.toLowerCase();
            result = result.filter(
                (c) =>
                    c.title?.toLowerCase().includes(q) ||
                    c.description?.toLowerCase().includes(q) ||
                    c.location?.address?.toLowerCase().includes(q)
            );
        }

        if (status !== 'all') result = result.filter((c) => c.status === status);
        if (priority !== 'all') result = result.filter((c) => c.priority === priority);
        if (category !== 'all') result = result.filter((c) => c.category === category);

        if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (sortBy === 'oldest') result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        if (sortBy === 'priority') {
            const order = { critical: 0, high: 1, medium: 2, low: 3 };
            result.sort((a, b) => (order[a.priority] ?? 4) - (order[b.priority] ?? 4));
        }

        setFiltered(result);
    }, [search, status, priority, category, sortBy, complaints]);

    const resetFilters = () => {
        setSearch(''); setStatus('all'); setPriority('all');
        setCategory('all'); setSortBy('newest');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">My Complaints</h1>
                        <p className="text-sm text-gray-500 mt-1">{filtered.length} of {complaints.length} shown</p>
                    </div>
                    <Link
                        to="/user/submit"
                        className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
                    >
                        + New Complaint
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 space-y-3">
                    <input
                        type="text"
                        placeholder="Search by title, description or location..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <select value={status} onChange={(e) => setStatus(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s}</option>)}
                        </select>

                        <select value={priority} onChange={(e) => setPriority(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p === 'all' ? 'All Priorities' : p}</option>)}
                        </select>

                        <select value={category} onChange={(e) => setCategory(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.replace('_', ' ')}</option>)}
                        </select>

                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="priority">By Priority</option>
                        </select>
                    </div>

                    {(search || status !== 'all' || priority !== 'all' || category !== 'all') && (
                        <button onClick={resetFilters} className="text-sm text-emerald-600 hover:underline">
                            Clear all filters
                        </button>
                    )}
                </div>

                {/* List */}
                {loading ? (
                    <p className="text-gray-400 text-center py-12">Loading...</p>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <p className="text-4xl mb-2">📭</p>
                        <p>No complaints match your filters.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filtered.map((c) => (
                            <Link
                                key={c._id}
                                to={`/user/complaints/${c._id}`}
                                className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-sm transition"
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-800">{c.title}</h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{c.description}</p>
                                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                                            {c.location?.address && <span>📍 {c.location.address}</span>}
                                            <span>🕒 {new Date(c.createdAt).toLocaleDateString()}</span>
                                            {c.media?.length > 0 && <span>📎 {c.media.length} file(s)</span>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1.5 items-end">
                                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${STATUS_COLORS[c.status] || 'bg-gray-100'}`}>
                                            {c.status}
                                        </span>
                                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${PRIORITY_COLORS[c.priority] || 'bg-gray-100'}`}>
                                            {c.priority}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyComplaints;