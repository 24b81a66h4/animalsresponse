import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword'; // ✅ ADDED
import ResetPassword from './pages/auth/ResetPassword';   // ✅ ADDED

import UserDashboard from './pages/user/Dashboard';
import SubmitComplaint from './pages/user/SubmitComplaint';
import Feedback from './pages/user/Feedback'; // ✅ ADDED

import AdminDashboard from './pages/admin/Dashboard';
import NGODashboard from './pages/ngo/Dashboard';

// Protected Route
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-800"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ✅ ADDED */}
          <Route path="/reset-password/:userId/:token" element={<ResetPassword />} /> {/* ✅ ADDED */}

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
            path="/user/feedback/:id"
            element={
              <ProtectedRoute roles={['user']}>
                <Feedback />
              </ProtectedRoute>
            }
          /> {/* ✅ ADDED */}

          {/* NGO */}
          <Route
            path="/ngo/dashboard"
            element={
              <ProtectedRoute roles={['ngo']}>
                <NGODashboard />
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
    </div>
  );
};

export default AppRoutes;