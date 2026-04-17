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
        <div className="max-w-2xl mx-auto p-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Report an Animal Issue
            </h1>

            <div className="bg-white p-6 rounded shadow">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">Title</label>
                        <input
                            type="text"
                            name="title"
                            className="w-full p-2 border rounded"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2 font-semibold">Description</label>
                        <textarea
                            name="description"
                            rows="4"
                            className="w-full p-2 border rounded"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block mb-2 font-semibold">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
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
                            <label className="block mb-2 font-semibold">Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                            >
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-semibold">Location</label>
                        <input
                            type="text"
                            name="address"
                            className="w-full p-2 border rounded"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 text-white px-6 py-2 rounded flex-grow"
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate('/user/dashboard')}
                            className="bg-gray-300 px-6 py-2 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SubmitComplaint;