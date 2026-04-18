import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userData = await login(formData.email, formData.password);
            if (!userData || !userData.role) {
                throw new Error("Invalid user data");
            }

            if (userData.role === 'admin') navigate('/admin/dashboard');
            else if (userData.role === 'ngo') navigate('/ngo/dashboard');
            else navigate('/user/dashboard');
        } catch (err) {
             // err might be an object, force it to string
            if (typeof err === 'string') {
                setError(err);
            } else if (err?.message) {
                setError(err.message);
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

            {/* Background */}
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-amber-200 rounded-full blur-3xl opacity-50"></div>

            <div className="max-w-md w-full bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/50 z-10">
                
                <h2 className="text-center text-3xl font-extrabold text-emerald-900">
                    Welcome Back
                </h2>

                {error && (
                    <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                    
                    {/* Email */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />

                        {/* 🔔 FORGOT PASSWORD LINK */}
                        <div className="text-right mt-2">
                            <Link 
                                to="/forgot-password" 
                                className="text-sm text-emerald-600 hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-emerald-800 text-white rounded-xl hover:bg-emerald-700"
                    >
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-amber-600 hover:underline">
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Login;