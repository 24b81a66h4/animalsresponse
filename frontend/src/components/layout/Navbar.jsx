import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import NotificationBell from '../shared/NotificationBell'; // ✅ CORRECT PATH

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const getDashboardLink = () => {
        if (!user) return '/';
        if (user.role === 'admin') return '/admin/dashboard';
        if (user.role === 'ngo') return '/ngo/dashboard';
        return '/user/dashboard';
    };

    return (
        <nav className="bg-emerald-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">

                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2">
                            <span className="text-2xl">🐾</span>
                            <span className="font-bold text-xl tracking-tight text-emerald-50">
                                WildGuard
                            </span>
                        </Link>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-emerald-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                            Home
                        </Link>

                        {user ? (
                            <>
                                <Link to={getDashboardLink()} className="text-emerald-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                                    Dashboard
                                </Link>

                                {user.role === 'user' && (
                                    <Link to="/user/submit-complaint" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm transition">
                                        Report Issue
                                    </Link>
                                )}

                                <div className="border-l border-emerald-700 h-6 mx-2"></div>

                                {/* 🔔 Notification Bell */}
                                <NotificationBell />

                                <span className="text-emerald-200 text-sm hidden md:block">
                                    Hi, {user.name}
                                </span>

                                <button 
                                    onClick={() => { logout(); navigate('/'); }}
                                    className="text-emerald-100 hover:text-white hover:bg-emerald-700 px-3 py-2 rounded-md text-sm font-medium transition"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-emerald-100 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition">
                                    Login
                                </Link>
                                <Link to="/register" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-sm transition">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;