import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const { userId, token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
        if (password !== confirm) { setError('Passwords do not match'); return; }

        try {
            setLoading(true);
            await axios.post(`http://localhost:5000/api/auth/reset-password/${userId}/${token}`, { password });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2500);
        } catch (err) {
            setError(err.response?.data?.message || 'Reset link is invalid or expired');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h2 className="text-xl font-bold text-gray-800">Password Reset!</h2>
                    <p className="text-sm text-gray-500 mt-1">Redirecting you to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <div className="text-4xl mb-2">🔒</div>
                    <h2 className="text-xl font-bold text-gray-800">Set New Password</h2>
                    <p className="text-sm text-gray-500 mt-1">Choose a strong password for your account.</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="New password"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <input
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition disabled:opacity-60"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;