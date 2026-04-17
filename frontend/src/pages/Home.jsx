import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);
    const [publicComplaints, setPublicComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublicComplaints = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/complaints/public');
                setPublicComplaints(res.data);
            } catch (err) {
                console.error("Failed to fetch public complaints", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPublicComplaints();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "Resolved": return "bg-green-100 text-green-800";
            case "In Progress": return "bg-blue-100 text-blue-800";
            case "Pending": return "bg-yellow-100 text-yellow-800";
            case "Assigned": return "bg-purple-100 text-purple-800";
            case "Rejected": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="min-h-screen bg-stone-50">
            {/* Hero Section */}
            <div className="bg-emerald-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <polygon fill="currentColor" points="0,100 100,0 100,100" className="text-emerald-800"/>
                    </svg>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
                    <div className="text-center">
                        <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                            <span className="block mb-2">Be the Voice for</span>
                            <span className="block text-amber-400">Animals in Need</span>
                        </h1>
                        <p className="mt-3 max-w-md mx-auto text-base text-emerald-100 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                            Join our community to report injured, stray, or endangered animals. Track the rescue progress and help NGOs save lives.
                        </p>
                        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                            {user ? (
                                <div className="rounded-md shadow">
                                    <Link to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'ngo' ? '/ngo/dashboard' : '/user/dashboard'} className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-emerald-900 bg-amber-400 hover:bg-amber-500 md:py-4 md:text-lg md:px-10 transition shadow-lg hover:scale-105 transform">
                                        Go to Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="rounded-md shadow">
                                        <Link to="/register" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-emerald-900 bg-amber-400 hover:bg-amber-500 md:py-4 md:text-lg md:px-10 transition shadow-lg hover:scale-105 transform">
                                            Join Now
                                        </Link>
                                    </div>
                                    <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                                        <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-emerald-800 hover:bg-emerald-700 md:py-4 md:text-lg md:px-10 transition">
                                            Login
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Community Complaints Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">Community Rescue Board</h2>
                    <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                        See recent reports from your community and track the impact we are making together.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-800"></div>
                    </div>
                ) : publicComplaints.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-emerald-100">
                        <p className="text-gray-500 text-lg">No complaints have been reported yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {publicComplaints.map(complaint => (
                            <div key={complaint._id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
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
                                        <div className="flex items-center">
                                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="truncate max-w-[120px]">{complaint.location?.address}</span>
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
