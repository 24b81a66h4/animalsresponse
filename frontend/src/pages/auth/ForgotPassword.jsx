import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            setLoading(true);
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            setSent(true);
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (sent) {
        return (
            <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full text-center">
                    <div className="text-5xl mb-4">📧</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Check your inbox</h2>
                    <p className="text-sm text-gray-500">
                        If <strong>{email}</strong> is registered, you'll receive a password reset link shortly.
                    </p>
                    <Link to="/login" className="mt-6 inline-block text-sm text-emerald-600 hover:underline">
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <div className="text-4xl mb-2">🔑</div>
                    <h2 className="text-xl font-bold text-gray-800">Forgot Password?</h2>
                    <p className="text-sm text-gray-500 mt-1">Enter your email and we'll send a reset link.</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition disabled:opacity-60"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Remember your password?{' '}
                    <Link to="/login" className="text-emerald-600 hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;