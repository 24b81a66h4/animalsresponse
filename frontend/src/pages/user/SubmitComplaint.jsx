import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const SubmitComplaint = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Injury',
        priority: 'Medium',
        address: ''
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) return;

        setLoading(true);

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            };

            const payload = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                priority: formData.priority,
                location: {
                    address: formData.address
                }
            };

            await axios.post(
                'http://localhost:5000/api/complaints',
                payload,
                config
            );

            alert("Complaint submitted successfully");
            navigate('/user/dashboard');

        } catch (err) {
            alert(err.response?.data?.message || "Failed to submit complaint");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-extrabold text-emerald-900 mb-2">
                    Report an Animal Issue
                </h1>
                <p className="text-lg text-gray-600">Provide details so our NGOs can respond quickly.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-50">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Issue Title</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g., Stray dog with injured leg"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Detailed Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            placeholder="Describe the animal's condition, exact location details, and any other helpful information..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition"
                            >
                                <option>Injury</option>
                                <option>Abuse</option>
                                <option>Stray</option>
                                <option>Dead Animal</option>
                                <option>Missing Pet</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition"
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Location Address</label>
                        <input
                            type="text"
                            name="address"
                            placeholder="e.g., 123 Main Street, Near Central Park"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate('/user/dashboard')}
                            className="w-full sm:w-1/3 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-2/3 bg-amber-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-amber-600 transition shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : "Submit Report"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitComplaint;