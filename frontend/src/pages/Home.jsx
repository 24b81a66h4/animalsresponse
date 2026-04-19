import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [publicComplaints, setPublicComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublicComplaints = async () => {
            try {
                const res = await API.get('/complaints/public');
                setPublicComplaints(res.data);
            } catch (err) {
                console.error('Failed to fetch public complaints', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPublicComplaints();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolved':    return 'bg-green-100 text-green-800';
            case 'In Progress': return 'bg-blue-100 text-blue-800';
            case 'Pending':     return 'bg-yellow-100 text-yellow-800';
            case 'Assigned':    return 'bg-purple-100 text-purple-800';
            case 'Rejected':    return 'bg-red-100 text-red-800';
            default:            return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="min-h-screen bg-stone-50">

            {/* Hero */}
            <div className="bg-emerald-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polygon fill="currentColor" points="0,100 100,0 100,100" className="text-emerald-800" />
                    </svg>
                </div>

                {/* Ambient blobs */}
                <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-700 rounded-full opacity-10 animate-blob" />
                <div className="absolute bottom-10 right-10 w-64 h-64 bg-amber-600 rounded-full opacity-10 animate-blob animation-delay-2000" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative z-10">
                    <div className="text-center">
                        <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl animate-fade-up">
                            <span className="block mb-2">Be the Voice for</span>
                            <span className="block text-amber-400 animate-fade-up-delay-1">Animals in Need</span>
                        </h1>
                        <p className="mt-4 max-w-md mx-auto text-base text-emerald-100 sm:text-lg md:mt-6 md:text-xl md:max-w-3xl animate-fade-up-delay-2">
                            Join our community to report injured, stray, or endangered animals.
                            Track the rescue progress and help NGOs save lives.
                        </p>
                        <div className="mt-8 max-w-md mx-auto sm:flex sm:justify-center animate-fade-up-delay-3">
                            {user ? (
                                <div className="rounded-md shadow">
                                    <Link
                                        to={
                                            user.role === 'admin' ? '/admin/dashboard'
                                            : user.role === 'ngo' ? '/ngo/dashboard'
                                            : '/user/dashboard'
                                        }
                                        className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-emerald-900 bg-amber-400 hover:bg-amber-500 md:text-lg md:px-10 transition shadow-lg hover:scale-105 transform"
                                    >
                                        Go to Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="rounded-md shadow">
                                        <Link
                                            to="/register"
                                            className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-emerald-900 bg-amber-400 hover:bg-amber-500 md:text-lg md:px-10 transition shadow-lg hover:scale-105 transform"
                                        >
                                            Join Now
                                        </Link>
                                    </div>
                                    <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                                        <Link
                                            to="/login"
                                            className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-emerald-800 hover:bg-emerald-700 md:text-lg md:px-10 transition"
                                        >
                                            Login
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Quick stats strip */}
                        <div className="mt-12 flex justify-center gap-8 animate-fade-in-delay-3">
                            {[
                                { label: 'Animals Rescued', value: '2,400+' },
                                { label: 'Active NGOs',     value: '38'     },
                                { label: 'Cities',         value: '12'     },
                            ].map(s => (
                                <div key={s.label} className="text-center">
                                    <p className="text-2xl font-extrabold text-amber-400">{s.value}</p>
                                    <p className="text-xs text-emerald-300 mt-0.5">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features strip */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
                    {[
                        { icon: '📍', title: 'Location-based routing', desc: 'Reports go to the nearest available NGO automatically.' },
                        { icon: '🔔', title: 'Real-time notifications', desc: 'Get instant updates as your report moves through the system.' },
                        { icon: '⭐', title: 'Rate & improve', desc: 'Your feedback helps NGOs get better at every rescue.' },
                    ].map(f => (
                        <div key={f.title} className="flex gap-4 p-4 animate-fade-up">
                            <span className="text-3xl flex-shrink-0">{f.icon}</span>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Community Board */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12 animate-fade-up">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
                        Community Rescue Board
                    </h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        See recent reports from your community and track the impact we are making together.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-800"></div>
                    </div>
                ) : publicComplaints.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-emerald-100 animate-fade-up">
                        <p className="text-gray-500 text-lg">No complaints have been reported yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
                        {publicComplaints.map((complaint, i) => (
                            <div
                                key={complaint._id}
                                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full animate-fade-up"
                            >
                                <div className="p-6 flex-grow">
                                    <div className="flex justify-between items-start mb-4">
                                        <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                                            {complaint.category}
                                        </span>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                                            {complaint.status}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{complaint.title}</h3>
                                    <p className="text-gray-600 line-clamp-3 mb-4">{complaint.description}</p>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <svg className="h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="truncate max-w-[120px]">{complaint.location?.address || 'Unknown'}</span>
                                        </div>
                                        <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-400">
                                        Reported by: {complaint.user_id?.name || 'Anonymous'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;