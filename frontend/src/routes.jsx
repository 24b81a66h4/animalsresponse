import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import UserDashboard from './pages/user/Dashboard';
import SubmitComplaint from './pages/user/SubmitComplaint';
import MyComplaints from './pages/user/MyComplaints';
import ComplaintDetail from './pages/user/ComplaintDetail';
import Feedback from './pages/user/Feedback';

import AdminDashboard from './pages/admin/Dashboard';
import NGODashboard from './pages/ngo/Dashboard';
import AssignedComplaints from './pages/ngo/AssignedComplaints';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-800"></div>
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

    return children;
};

const AppRoutes = () => {
    return (
        <div className="min-h-screen flex flex-col bg-stone-50 font-sans">
            <Navbar />
            <main className="flex-grow">
                <Routes>
                    {/* Public */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />

                    {/* User */}
                    <Route
                        path="/user/dashboard"
                        element={
                            <ProtectedRoute roles={['user', 'admin']}>
                                <UserDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/user/submit-complaint"
                        element={
                            <ProtectedRoute roles={['user']}>
                                <SubmitComplaint />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/user/complaints"
                        element={
                            <ProtectedRoute roles={['user']}>
                                <MyComplaints />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/user/complaints/:id"
                        element={
                            <ProtectedRoute roles={['user', 'admin', 'ngo']}>
                                <ComplaintDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/user/feedback/:id"
                        element={
                            <ProtectedRoute roles={['user']}>
                                <Feedback />
                            </ProtectedRoute>
                        }
                    />

                    {/* NGO */}
                    <Route
                        path="/ngo/dashboard"
                        element={
                            <ProtectedRoute roles={['ngo']}>
                                <NGODashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/ngo/complaints"
                        element={
                            <ProtectedRoute roles={['ngo']}>
                                <AssignedComplaints />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin */}
                    <Route
                        path="/admin/dashboard"
                        element={
                            <ProtectedRoute roles={['admin']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

export default AppRoutes;